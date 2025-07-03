

export const authUtils = {
    // Obtener usuario actual del localStorage
    getCurrentUser: () => {
        try {
            const user = localStorage.getItem("currentUser");
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error al obtener usuario del localStorage:", error);
            return null;
        }
    },

    // Verificar si el usuario está autenticado
    isAuthenticated: () => {
        return authUtils.getCurrentUser() !== null;
    },

    // Verificar si el usuario es admin
    isAdmin: () => {
        const user = authUtils.getCurrentUser();
        return user && user.role === "admin";
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem("currentUser");
    },

    // Guardar usuario en localStorage
    saveUser: (user) => {
        try {
            localStorage.setItem("currentUser", JSON.stringify({
                username: user.username,
                role: user.role,
                loginTime: new Date().toISOString()
            }));
            return true;
        } catch (error) {
            console.error("Error al guardar usuario en localStorage:", error);
            return false;
        }
    }
};
