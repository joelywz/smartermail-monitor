import React from 'react'
import {createRoot} from 'react-dom/client'
import './style.css'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateDashboardPage from './pages/CreateDashboardPage'
import { DashboardProvider } from './context/DashboardContext'
import DashboardPage from './pages/DashboardPage'
import LoadDashboardPage from './pages/LoadDashboardPage'
import CheckUpdateButton from './components/CheckUpdateButton'
import { Toaster } from './components/ui/toaster'

const container = document.getElementById('root')

const root = createRoot(container!)

const router = createBrowserRouter([
  {
    path: "/",
    element: <>
        <DashboardProvider>
            <Outlet/>
            <Toaster/>
            <CheckUpdateButton/>
        </DashboardProvider>
    </>,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "create-dashboard",
        element: <CreateDashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage/>
      },
      {
        path: "load",
        element: <LoadDashboardPage/>
      },
    ],
  },
]);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
