import React from "react";
import Hero from "../components/sections/Hero";
import Solutions from "../components/sections/Solutions";
import Locations from "../components/sections/Locations";
import Facilities from "../components/sections/Facilities";
import About from "../components/sections/About";
import Clients from "../components/sections/Clients";
import NewsInsights from "../components/sections/NewsInsights";

export default function Home({ services, locations }) {
  return (
    <>
      <Hero services={services} locations={locations} />
      <Solutions services={services} />
      <Clients />
      <Locations services={services} locations={locations} />
      <Facilities />
      <About />
      <NewsInsights />
    </>
  );
}