import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Init from "./views/Init";
import Register from "./views/Register";
import Login from "./views/Login";
import useData from "./store";
import Settings from "./views/Settings";
import AlertManager from "./components/AlertManager";
import VersionButton from "./components/VersionButton";
import Updater from "./components/Updater";

function App() {


  return (
    <>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
      <Updater/>
      <AlertManager />
      <VersionButton/>
    </>

  )
}

function AnimatedRoutes() {

  const location = useLocation();


  return (
    <div className="h-screen w-screen overflow-hidden relative">

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="" element={<Init />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AnimatePresence>
    </div>

  )
}

export default App
