import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import SolutionDetail from "./pages/SolutionDetail";
import { getLocations, getServices } from "./api";
import { services as bundledServices } from "./data/services";
import { fallbackLocations } from "./data/locations";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";

export default function App() {
  // Bundled data renders immediately; API data replaces it when it arrives.
  const [services, setServices] = useState(bundledServices);
  const [locations, setLocations] = useState(fallbackLocations);

  useEffect(() => {
    getServices().then(setServices);
    getLocations().then(setLocations);
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home services={services} locations={locations} />} />
        <Route path="/solutions/:slug" element={<SolutionDetail services={services} locations={locations} />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
      </Routes>
      <Footer />
    </>
  );
}
