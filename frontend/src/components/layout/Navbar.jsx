import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Button from '../ui/Button';

const Navbar = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'light');
    const isLoggedIn = Boolean(user && user.token && (user._id || user.id));

    React.useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate('/');
    };

    return (
        <nav className="top-nav">
            <div className="container top-nav-inner">
                <Link to="/" className="brand-title">
                    <span className="brand-primary">Dynamic Personalized</span>
                    <span className="brand-secondary">Roadmap Planner</span>
                </Link>

                <button
                    type="button"
                    className={`nav-toggle${menuOpen ? ' open' : ''}`}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div className={`nav-links${menuOpen ? ' open' : ''}`}>
                    <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                        Home
                    </NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/generate-roadmap" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                        Generate Roadmap
                    </NavLink>
                    <NavLink to="/my-roadmaps" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                        My Roadmaps
                    </NavLink>
                    <NavLink to="/progress" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                        Progress
                    </NavLink>

                    <button
                        type="button"
                        className="theme-toggle"
                        onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? (
                            <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                                <path
                                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        ) : (
                            <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </button>

                    {isLoggedIn ? (
                        <div className="nav-actions">
                            <Button to="/settings" variant="outline" size="sm">
                                Profile
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="nav-actions">
                            <Button to="/login" variant="primary" size="sm">
                                Login
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
