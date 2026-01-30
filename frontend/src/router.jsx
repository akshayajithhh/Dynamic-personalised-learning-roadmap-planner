import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

/* Pages */
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Technology from './pages/Technology';
import LearningFormPage from './pages/LearningFormPage';
import Roadmap from './pages/Roadmap';
import ModuleDetail from './pages/ModuleDetail';
import WeeklyPlan from './pages/WeeklyPlan';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import About from './pages/About';
import AdminCreateDomain from './pages/AdminCreateDomain';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/about',
        element: <About />,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        path: '/technology/:techId',
        element: <Technology />,
    },
    {
        path: '/learning-form/:techId',
        element: <LearningFormPage />,
    },
    {
        path: '/roadmap',
        element: <Roadmap />,
    },
    {
        path: '/roadmap/module/:moduleId',
        element: <ModuleDetail />,
    },
    {
        path: '/weekly-plan',
        element: <WeeklyPlan />,
    },
    {
        path: '/progress',
        element: <Progress />,
    },
    {
        path: '/settings',
        element: <Settings />,
    },
    {
        path: '/admin/create-domain',
        element: <AdminCreateDomain />,
    },
]);
