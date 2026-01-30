import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const layoutStyles = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    };

    const mainStyles = {
        flex: 1,
        padding: '2rem 0',
    };

    return (
        <div style={layoutStyles}>
            <Navbar />
            <main style={mainStyles}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
