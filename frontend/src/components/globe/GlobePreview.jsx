import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule10, geoDistance, geoInterpolate } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import useInView from "../../hooks/useInView";

/*
  Connected supply-chain globe.
  - Real geography from the bundled world-atlas dataset (no network request).
  - Renders a static frame first; motion and drag are enabled after idle.
  - Animation pauses offscreen, honours reduced motion and a Pause button,
    and stays static on constrained devices (save-data / 2g / low memory).
  - Service nodes come from the approved location directory (`locations` prop).
  - Planes fly the air routes; cargo ships sail illustrative sea lanes.
*/

const SIZE = 400;
const C = SIZE / 2;
const RADIUS = 172;
const PH_CENTER = [122, 12]; // [lng, lat] the globe is centred on
const SWAY = 28; // degrees of slow east-west sweep so the Philippines stays in view
const ZOOM = 1.9;
const PLANE_SPEED = 0.05; // fraction of a route per second
const SHIP_SPEED = 0.02;

const land = feature(world, world.objects.land);
const philippines = feature(world, world.objects.countries).features.find(
  (f) => f.properties.name === "Philippines"
);
const graticule = geoGraticule10();

// Illustrative gateways that give the routes somewhere to connect.
// TODO: confirm with the business owner before presenting them as real coverage.
const GATEWAYS = [
  { id: "hong-kong", coords: [114.17, 22.32] },
  { id: "singapore", coords: [103.82, 1.35] },
  { id: "tokyo", coords: [139.69, 35.68] },
  { id: "sydney", coords: [151.21, -33.87] },
  { id: "dubai", coords: [55.27, 25.2] },
  { id: "los-angeles", coords: [-118.24, 34.05] },
];

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Illustrative sea lanes ([lng, lat] waypoints through open water). TODO: replace with real shipping lanes if needed.
const LANE_DEFS = [
  { id: "manila-hong-kong", pts: [[120.6, 14.3], [119.3, 14.0], [118, 17], [114.3, 22.2]] },
  { id: "manila-singapore", pts: [[120.6, 14.3], [119, 13], [116, 10], [113, 7], [108, 3], [104.3, 1.4]] },
  { id: "davao-tokyo", pts: [[125.7, 6.6], [126.8, 5.6], [130, 12], [137, 25], [139.9, 34.6]] },
  { id: "palawan-singapore", pts: [[118.6, 9.8], [116.5, 8.2], [113, 5.5], [108, 3], [104.3, 1.4]] },
];
const LANES = LANE_DEFS.map((l) => {
  let total = 0;
  const segs = l.pts.slice(1).map((p, i) => {
    const a = l.pts[i];
    const len = geoDistance(a, p);
    const s = { interp: geoInterpolate(a, p), start: total, len };
    total += len;
    return s;
  });
  return { ...l, segs, total };
});
const laneAt = (lane, f) => {
  const target = clamp(f, 0, 1) * lane.total;
  const seg = lane.segs.find((s) => target <= s.start + s.len) || lane.segs[lane.segs.length - 1];
  return seg.interp(seg.len ? clamp((target - seg.start) / seg.len, 0, 1) : 0);
};
const SHIPS = [
  { id: "ship-0", lane: 0, dir: 1, phase: 0.1, speed: SHIP_SPEED },
  { id: "ship-1", lane: 1, dir: 1, phase: 0.3, speed: SHIP_SPEED * 0.9 },
  { id: "ship-2", lane: 1, dir: -1, phase: 0.7, speed: SHIP_SPEED * 0.8 },
  { id: "ship-3", lane: 2, dir: 1, phase: 0.2, speed: SHIP_SPEED * 0.85 },
  { id: "ship-4", lane: 2, dir: -1, phase: 0.65, speed: SHIP_SPEED * 0.9 },
  { id: "ship-5", lane: 3, dir: 1, phase: 0.5, speed: SHIP_SPEED },
];

// Top-down icons, pointing up (-y). Trails extend behind (+y).
const PLANE_D = "M0 -7 L1.4 -2 L7 1.5 L7 3 L1.4 1.2 L1 5 L3 6.5 L3 7.5 L0 6.7 L-3 7.5 L-3 6.5 L-1 5 L-1.4 1.2 L-7 3 L-7 1.5 L-1.4 -2 Z";
const SHIP_D = "M0 -9 L4.5 -4 L4.5 8 L-4.5 8 L-4.5 -4 Z";

function isConstrained() {
  if (typeof navigator === "undefined") return false;
  const c = navigator.connection;
  const slowNetwork = Boolean(c && (c.saveData || /2g$/.test(c.effectiveType || "")));
  const lowMemory = Boolean(navigator.deviceMemory && navigator.deviceMemory <= 2);
  return slowNetwork || lowMemory;
}

export default function GlobePreview({ locations = [], services = [] }) {
  const reduced = usePrefersReducedMotion();
  const [wrapRef, inView] = useInView();
  const [paused, setPaused] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [picked, setPicked] = useState(false);
  const constrained = useMemo(isConstrained, []);

  const live = interactive && inView && !paused && !reduced && !constrained;
  const canDrag = interactive && !constrained;

  const names = useMemo(() => Object.fromEntries(services.map((s) => [s.slug, s.name])), [services]);

  const hubs = useMemo(
    () =>
      locations.map((l) => ({
        id: l.id,
        name: l.name,
        coords: [l.lng, l.lat],
        services: l.services || [],
      })),
    [locations]
  );

  const routes = useMemo(() => {
    const list = [];
    hubs.forEach((h, i) => {
      if (i > 0) list.push({ id: `d-${hubs[i - 1].id}-${h.id}`, a: hubs[i - 1].coords, b: h.coords, hubIds: [hubs[i - 1].id, h.id] });
    });
    if (hubs.length) {
      GATEWAYS.forEach((g, i) => {
        const h = hubs[i % hubs.length];
        list.push({ id: `g-${g.id}-${h.id}`, a: g.coords, b: h.coords, hubIds: [h.id] });
      });
    }
    return list;
  }, [hubs]);

  // Planes fly every gateway route plus the longer domestic hops.
  const planes = useMemo(
    () =>
      routes
        .filter((r) => r.id.startsWith("g-") || geoDistance(r.a, r.b) > 0.05)
        .map((r, i) => ({
          id: `plane-${r.id}`,
          interp: geoInterpolate(r.a, r.b),
          dir: i % 2 ? -1 : 1,
          phase: (i * 0.37) % 1,
          speed: PLANE_SPEED * (0.8 + (i % 3) * 0.2),
        })),
    [routes]
  );

  const active = hubs.find((h) => h.id === activeId) || hubs[0] || null;

  // ---- imperative drawing (no React re-render per frame) ----
  const view = useRef({ t: 0, dx: 0, dy: 0, scale: 1, target: 1 });
  const el = useRef({ routeBase: {}, routeFlow: {}, hubs: {}, gateways: {}, lanes: {}, ships: {}, planes: {} });
  const sphere = useRef(null);
  const halo = useRef(null);
  const shade = useRef(null);
  const gratEl = useRef(null);
  const landEl = useRef(null);
  const dotsEl = useRef(null);
  const phEl = useRef(null);

  const { projection, path } = useMemo(() => {
    const p = geoOrthographic().translate([C, C]).clipAngle(90).precision(0.6);
    return { projection: p, path: geoPath(p) };
  }, []);

  const draw = useCallback(() => {
    const v = view.current;
    const lambda = PH_CENTER[0] + v.dx + (SWAY / v.scale) * Math.sin(v.t * 0.3);
    const phi = clamp(PH_CENTER[1] + v.dy, -55, 75);
    const r = RADIUS * v.scale;
    projection.rotate([-lambda, -phi]).scale(r);

    sphere.current?.setAttribute("r", r);
    shade.current?.setAttribute("r", r);
    halo.current?.setAttribute("r", r + 16);
    gratEl.current?.setAttribute("d", path(graticule) || "");
    const landD = path(land) || "";
    landEl.current?.setAttribute("d", landD);
    dotsEl.current?.setAttribute("d", landD);
    phEl.current?.setAttribute("d", (philippines && path(philippines)) || "");

    routes.forEach((rt) => {
      const d = path({ type: "LineString", coordinates: [rt.a, rt.b] }) || "";
      el.current.routeBase[rt.id]?.setAttribute("d", d);
      el.current.routeFlow[rt.id]?.setAttribute("d", d);
    });
    LANES.forEach((l) => {
      el.current.lanes[l.id]?.setAttribute("d", path({ type: "LineString", coordinates: l.pts }) || "");
    });

    const centre = [lambda, phi];
    const place = (node, coords) => {
      if (!node) return;
      if (geoDistance(coords, centre) > Math.PI / 2 - 0.02) {
        node.style.display = "none";
        return;
      }
      const [x, y] = projection(coords);
      node.style.display = "";
      node.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    };
    hubs.forEach((h) => place(el.current.hubs[h.id], h.coords));
    GATEWAYS.forEach((g) => place(el.current.gateways[g.id], g.coords));

    // Vehicles: position, heading (from the next point on the path), altitude scale, fade at the ends.
    const zoomScale = Math.sqrt(v.scale);
    const placeVehicle = (node, at, ahead, u, altitude) => {
      if (!node) return;
      if (geoDistance(at, centre) > Math.PI / 2 - 0.02) {
        node.style.display = "none";
        return;
      }
      const p = projection(at);
      const q = projection(ahead);
      if (!p) {
        node.style.display = "none";
        return;
      }
      const ang = q ? (Math.atan2(q[0] - p[0], -(q[1] - p[1])) * 180) / Math.PI : 0;
      const s = zoomScale * (altitude ? 0.75 + 0.5 * Math.sin(Math.PI * u) : 1);
      node.style.display = "";
      node.style.opacity = Math.min(1, Math.min(u, 1 - u) * 8).toFixed(2);
      node.setAttribute("transform", `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${s.toFixed(2)})`);
    };
    planes.forEach((pl) => {
      const u = (v.t * pl.speed + pl.phase) % 1;
      const f = pl.dir > 0 ? u : 1 - u;
      const f2 = clamp(f + 0.01 * pl.dir, 0, 1);
      placeVehicle(el.current.planes[pl.id], pl.interp(f), pl.interp(f2), u, true);
    });
    SHIPS.forEach((sh) => {
      const u = (v.t * sh.speed + sh.phase) % 1;
      const f = sh.dir > 0 ? u : 1 - u;
      const f2 = clamp(f + 0.006 * sh.dir, 0, 1);
      const lane = LANES[sh.lane];
      placeVehicle(el.current.ships[sh.id], laneAt(lane, f), laneAt(lane, f2), u, false);
    });
  }, [projection, path, routes, hubs, planes]);

  // Static frame before first paint.
  useLayoutEffect(() => {
    draw();
  }, [draw]);

  // Enable motion/interaction after idle, not during first paint.
  useEffect(() => {
    const start = () => setInteractive(true);
    const hasIdle = "requestIdleCallback" in window;
    const id = hasIdle ? window.requestIdleCallback(start, { timeout: 1200 }) : setTimeout(start, 500);
    return () => (hasIdle ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  // Animation loop: runs only while live, or briefly while zooming.
  useEffect(() => {
    const v = view.current;
    v.target = zoomed ? ZOOM : 1;
    if (reduced) {
      v.scale = v.target;
      draw();
      return undefined;
    }
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (live) v.t += dt;
      v.scale += (v.target - v.scale) * Math.min(1, dt * 6);
      draw();
      if (live || Math.abs(v.target - v.scale) > 0.003) {
        raf = requestAnimationFrame(tick);
      } else {
        v.scale = v.target;
        draw();
      }
    };
    if (live || Math.abs(v.target - v.scale) > 0.003) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, zoomed, reduced, draw]);

  // Auto-highlight service nodes in turn until the visitor picks one.
  useEffect(() => {
    if (!live || picked || hubs.length < 2) return undefined;
    const id = setInterval(() => {
      setActiveId((cur) => {
        const i = hubs.findIndex((h) => h.id === (cur ?? hubs[0].id));
        return hubs[(i + 1) % hubs.length].id;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [live, picked, hubs]);

  const pick = useCallback((id) => {
    setActiveId(id);
    setPicked(true);
  }, []);

  // ---- drag / swipe / keyboard ----
  const drag = useRef(null);
  const onPointerDown = (e) => {
    if (!canDrag) return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const mx = e.clientX - d.x;
    const my = e.clientY - d.y;
    if (!d.moved && Math.hypot(mx, my) < 5) return;
    if (!d.moved) {
      d.moved = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    const k = 0.35 / view.current.scale;
    view.current.dx -= mx * k;
    view.current.dy = clamp(view.current.dy + my * k, -67, 63);
    d.x = e.clientX;
    d.y = e.clientY;
    draw();
  };
  const endDrag = (e) => {
    const d = drag.current;
    drag.current = null;
    if (d?.moved) e.currentTarget.releasePointerCapture?.(e.pointerId);
  };
  const onKeyDown = (e) => {
    if (!canDrag || e.target !== e.currentTarget) return;
    const v = view.current;
    const step = 8;
    if (e.key === "ArrowLeft") v.dx -= step;
    else if (e.key === "ArrowRight") v.dx += step;
    else if (e.key === "ArrowUp") v.dy = clamp(v.dy + step, -67, 63);
    else if (e.key === "ArrowDown") v.dy = clamp(v.dy - step, -67, 63);
    else if (e.key === "Home") {
      v.dx = 0;
      v.dy = 0;
    } else return;
    e.preventDefault();
    draw();
  };

  const toggleZoom = () => {
    if (!zoomed) {
      view.current.dx = 0;
      view.current.dy = 0;
    }
    setZoomed(!zoomed);
  };

  return (
    <div ref={wrapRef} className="w-full max-w-lg mx-auto">
      <div
        tabIndex={canDrag ? 0 : -1}
        role="group"
        aria-label="Connected supply-chain globe centred on the Philippines, with planes and cargo ships moving between hubs. Drag or use the arrow keys to rotate, Home to recentre."
        className={`relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
          canDrag ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={`block w-full h-auto select-none ${live ? "globe-live" : ""}`}>
          <defs>
            <radialGradient id="g-halo" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor="#2350d0" stopOpacity=".16" />
              <stop offset="100%" stopColor="#2350d0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g-sphere" cx="38%" cy="34%" r="75%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#dbe7ff" />
              <stop offset="100%" stopColor="#b5caf5" />
            </radialGradient>
            <radialGradient id="g-shade" cx="35%" cy="32%" r="80%">
              <stop offset="55%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#1a3594" stopOpacity=".22" />
            </radialGradient>
            <pattern id="g-dots" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r=".8" fill="#2350d0" fillOpacity=".35" />
            </pattern>
            {/* fading trail behind planes (contrail) and ships (wake) */}
            <linearGradient id="g-trail" gradientUnits="userSpaceOnUse" x1="0" y1="7" x2="0" y2="32">
              <stop offset="0%" stopColor="#2350d0" stopOpacity=".6" />
              <stop offset="100%" stopColor="#2350d0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="g-wake" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="36">
              <stop offset="0%" stopColor="#3f9a24" stopOpacity=".55" />
              <stop offset="100%" stopColor="#3f9a24" stopOpacity="0" />
            </linearGradient>
          </defs>

          <circle ref={halo} cx={C} cy={C} r={RADIUS + 16} fill="url(#g-halo)" />
          <circle ref={sphere} cx={C} cy={C} r={RADIUS} fill="url(#g-sphere)" stroke="#2350d0" strokeOpacity=".35" />
          <path ref={gratEl} fill="none" stroke="#1a3594" strokeOpacity=".10" strokeWidth=".6" />
          <path ref={landEl} fill="#2350d0" fillOpacity=".16" stroke="#2350d0" strokeOpacity=".45" strokeWidth=".6" />
          <path ref={dotsEl} fill="url(#g-dots)" />
          <path ref={phEl} fill="#2350d0" fillOpacity=".9" stroke="#1a3594" strokeWidth=".8" />
          <circle ref={shade} cx={C} cy={C} r={RADIUS} fill="url(#g-shade)" pointerEvents="none" />

          {/* sea lanes (dotted green) */}
          {LANES.map((l) => (
            <path
              key={l.id}
              ref={(n) => (el.current.lanes[l.id] = n)}
              fill="none"
              stroke="#3f9a24"
              strokeOpacity=".55"
              strokeWidth="1"
              strokeDasharray="1.5 3.5"
              strokeLinecap="round"
              pointerEvents="none"
            />
          ))}

          {routes.map((rt, i) => (
            <g key={rt.id} className={active && rt.hubIds.includes(active.id) ? "route route-on" : "route"} fill="none" strokeLinecap="round">
              <path className="route-base" ref={(n) => (el.current.routeBase[rt.id] = n)} />
              <path
                className="route-flow"
                pathLength="100"
                style={{ animationDelay: `${-(i * 0.7)}s` }}
                ref={(n) => (el.current.routeFlow[rt.id] = n)}
              />
            </g>
          ))}

          {GATEWAYS.map((g) => (
            <g key={g.id} ref={(n) => (el.current.gateways[g.id] = n)}>
              <circle r="2.6" fill="#1a3594" fillOpacity=".85" />
            </g>
          ))}

          {/* cargo ships */}
          {SHIPS.map((s) => (
            <g key={s.id} ref={(n) => (el.current.ships[s.id] = n)} pointerEvents="none">
              <path d="M0 8 L0 36" stroke="url(#g-wake)" strokeWidth="3.5" strokeLinecap="round" />
              <path d={SHIP_D} fill="#3f9a24" stroke="#ffffff" strokeWidth=".9" strokeLinejoin="round" />
              <rect x="-3" y="-2" width="6" height="3" fill="#1a3594" />
              <rect x="-3" y="2.2" width="6" height="3" fill="#7dc35a" />
            </g>
          ))}

          {/* planes */}
          {planes.map((p) => (
            <g key={p.id} ref={(n) => (el.current.planes[p.id] = n)} pointerEvents="none">
              <path d="M0 7 L0 32" stroke="url(#g-trail)" strokeWidth="1.6" strokeLinecap="round" />
              <path d={PLANE_D} fill="#1a3594" stroke="#ffffff" strokeWidth=".8" strokeLinejoin="round" />
            </g>
          ))}

          {hubs.map((h) => {
            const on = active?.id === h.id;
            return (
              <g
                key={h.id}
                ref={(n) => (el.current.hubs[h.id] = n)}
                className="hub-node"
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${h.name}: ${h.services.map((s) => names[s] || s).join(", ")}`}
                onClick={() => pick(h.id)}
                onMouseEnter={() => pick(h.id)}
                onFocus={() => pick(h.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(h.id);
                  }
                }}
              >
                <circle r="16" fill="transparent" />
                <circle className="node-ring" r="7" fill="none" stroke="#3f9a24" strokeWidth="1.5" />
                <circle className="hub-core" r={on ? 7 : 4.5} fill={on ? "#7dc35a" : "#3f9a24"} stroke="#ffffff" strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* legend */}
      <div className="mt-3 flex items-center justify-center gap-5 text-[11px] text-slate-500" aria-hidden="true">
        <span className="flex items-center gap-1.5">
          <svg viewBox="-8 -8 16 16" className="h-3.5 w-3.5"><path d={PLANE_D} fill="#1a3594" /></svg>
          Air routes
        </span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="-8 -10 16 20" className="h-3.5 w-3"><path d={SHIP_D} fill="#3f9a24" /></svg>
          Sea lanes
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div aria-live={picked ? "polite" : "off"} className="min-h-[3rem] text-sm">
          {active ? (
            <>
              <p className="text-brand-navy">{active.name}</p>
              <p className="text-slate-600">{active.services.map((s) => names[s] || s).join(", ")}</p>
            </>
          ) : (
            <p className="text-slate-600">Philippine network</p>
          )}
        </div>
        <div className="flex gap-2">
          {!constrained && (
            <button
              onClick={toggleZoom}
              aria-pressed={zoomed}
              className="text-xs text-slate-600 border border-slate-300 rounded px-2 py-1 hover:border-brand-blue"
            >
              {zoomed ? "Show world" : "Zoom to Philippines"}
            </button>
          )}
          {!reduced && !constrained && (
            <button
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
              className="text-xs text-slate-600 border border-slate-300 rounded px-2 py-1 hover:border-brand-blue"
            >
              {paused ? "Play animation" : "Pause animation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}