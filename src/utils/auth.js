

import { authAPI } from '../services/authAPI';

export const authUtils = {
    // Obtener usuario actual del localStorage
    getCurrentUser: () => {
        return authAPI.getCurrentUser();
    },

    // Verificar si el usuario está autenticado
    isAuthenticated: () => {
        return authAPI.isAuthenticated();
    },

    // Verificar si el usuario es admin
    isAdmin: () => {
        return authAPI.isAdmin();
    },

    // Cerrar sesión
    logout: () => {
        authAPI.logout();
    },

    // Guardar usuario en localStorage (ya no se usa directamente, se maneja en authAPI)
    saveUser: (user) => {
        try {
            localStorage.setItem("currentUser", JSON.stringify({
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                loginTime: new Date().toISOString()
            }));
            return true;
        } catch (error) {
            console.error("Error al guardar usuario en localStorage:", error);
            return false;
        }
    },

    // Verificar token (nueva función)
    verifyToken: async () => {
        try {
            await authAPI.verifyToken();
            return true;
        } catch (error) {
            console.error("Token inválido:", error);
            return false;
        }
    }
};
