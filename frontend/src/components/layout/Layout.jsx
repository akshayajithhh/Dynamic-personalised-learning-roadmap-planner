import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useUser } from '../../context/UserContext';
import AIAgentPanel from '../agent/AIAgentPanel';

const Layout = ({ children }) => {
    const { user } = useUser();
    const isLoggedIn = Boolean(user && user.token && (user._id || user.id));

    return (
        <div className="app-shell">
            <Navbar />
            <main className={`app-main${isLoggedIn ? ' with-agent' : ''}`}>{children}</main>
            {isLoggedIn && <AIAgentPanel />}
            <Footer />
        </div>
    );
};

export default Layout;
