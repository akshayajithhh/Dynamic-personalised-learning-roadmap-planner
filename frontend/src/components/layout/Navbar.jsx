import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Button from '../ui/Button';

const Navbar = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navStyles = {
        backgroundColor: 'var(--surface-color)',
        boxShadow: 'var(--shadow-sm)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
    };

    const containerStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
    };

    const logoStyles = {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--primary-blue)',
        fontFamily: 'var(--font-heading)',
    };

    const linkGroupStyles = {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
    };

    const navLinkStyles = {
        fontWeight: '500',
        color: 'var(--secondary-black)',
        transition: 'color 0.2s',
    };

    return (
        <nav style={navStyles}>
            <div style={containerStyles}>
                <Link to="/" style={logoStyles}>
                    DPR Planner
                </Link>

                <div style={linkGroupStyles}>
                    <Link to="/about" style={navLinkStyles}>About</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" style={navLinkStyles}>Dashboard</Link>
                            <Link to="/progress" style={navLinkStyles}>My Progress</Link>
                            <span style={{ color: 'var(--text-light)', borderLeft: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
                                Hi, {user.name}
                            </span>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={navLinkStyles}>Login</Link>
                            <Button to="/register" variant="primary" size="sm">
                                Get Started
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
