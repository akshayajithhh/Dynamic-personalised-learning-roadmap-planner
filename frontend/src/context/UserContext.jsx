import { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage or similar for persisted session
        const storedUser = localStorage.getItem('dpr_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const userData = await apiLogin(email, password);
            setUser(userData);
            localStorage.setItem('dpr_user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dpr_user');
    };

    const register = async (name, email, password) => {
        try {
            const userData = await apiRegister(name, email, password);
            setUser(userData);
            localStorage.setItem('dpr_user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            // Re-throw the error so the Register component can display it
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
