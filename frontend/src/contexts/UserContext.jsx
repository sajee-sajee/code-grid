import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, login as apiLogin, register as apiRegister, updateProfile } from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On app load, try to restore session from stored token
    useEffect(() => {
        const token = localStorage.getItem("cg_token");
        if (token) {
            getProfile()
                .then((res) => setUser(res.data.user))
                .catch(() => localStorage.removeItem("cg_token"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await apiLogin(email, password);
        localStorage.setItem("cg_token", res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async (email, password) => {
        const res = await apiRegister(email, password);
        localStorage.setItem("cg_token", res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = () => {
        localStorage.removeItem("cg_token");
        setUser(null);
    };

    // Optimistically update user state (for XP, solved, etc.)
    const patchUser = (updates) => {
        setUser((u) => ({ ...u, ...updates }));
    };

    const saveProfile = async (data) => {
        const res = await updateProfile(data);
        setUser(res.data.user);
        return res.data.user;
    };

    return (
        <UserContext.Provider value={{ user, setUser, patchUser, login, register, logout, saveProfile, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
