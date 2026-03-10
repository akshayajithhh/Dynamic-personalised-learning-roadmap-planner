import { useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { UserContext } from './userContextObject';
const getStoredUser = () => {
    const storedUserRaw = localStorage.getItem('dpr_user');
    if (!storedUserRaw) return null;

    try {
        const parsed = JSON.parse(storedUserRaw);
        if (
            parsed &&
            typeof parsed === 'object' &&
            (parsed._id || parsed.id) &&
            parsed.token &&
            parsed.name
        ) {
            return parsed;
        }
    } catch {
        // Ignore invalid JSON and clear the stale session below.
    }

    localStorage.removeItem('dpr_user');
    return null;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => getStoredUser());
    const [loading] = useState(false);

    const isAdmin = user?.role === 'admin';

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
        <UserContext.Provider value={{ user, login, logout, register, loading, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
};
