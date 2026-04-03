import { useEffect, useState } from "react";
import { getProfile, login as apiLogin, register as apiRegister, updateProfile } from "../services/api";
import { UserContext } from "./user-context";

function readStoredToken() {
    try {
        return localStorage.getItem("cg_token");
    } catch {
        return null;
    }
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(readStoredToken()));

    // On app load, try to restore session from stored token
    useEffect(() => {
        const token = readStoredToken();
        if (!token) return;

        let cancelled = false;

        getProfile()
            .then((res) => {
                if (!cancelled) {
                    setUser(res.data.user);
                }
            })
            .catch(() => localStorage.removeItem("cg_token"))
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
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
