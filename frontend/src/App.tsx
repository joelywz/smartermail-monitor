import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Init from "./views/Init";
import Register from "./views/Register";
import Login from "./views/Login";
import useData from "./store";
import { TruckLoading } from "@emotion-icons/fa-solid";
import { useState } from "react";

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes/>
    </BrowserRouter>
  )
}

function AnimatedRoutes() {

  const location = useLocation();
  const data = useData();
  const [loading, setLoading] = useState(false);

  async function handleCheckUpdate() {
    if (loading) {
      return;
    }

    setLoading(true)

    try {
      await data.checkForUpdates(false)
    } catch (e) {

    }

    setLoading(false)
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="" element={<Init/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
      <div className="fixed right-0 bottom-0 text-neutral-400 text-xs p-2.5 z">
        <p className="cursor-pointer" onClick={handleCheckUpdate}>{data.appVersion}</p>
      </div>
    </div>

  )
}

export default App
