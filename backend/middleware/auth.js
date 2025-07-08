const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('=== MIDDLEWARE AUTH ===');
    console.log('Auth header:', authHeader);
    console.log('Token extraído:', token ? token.substring(0, 20) + '...' : 'No token');

    if (!token) {
        console.log('No se encontró token');
        return res.status(401).json({ 
            error: 'Token de acceso requerido',
            message: 'Debes estar autenticado para acceder a este recurso'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Error verificando token:', err);
            return res.status(403).json({ 
                error: 'Token inválido',
                message: 'El token proporcionado no es válido o ha expirado'
            });
        }
        
        console.log('Token válido. Usuario decodificado:', user);
        req.user = user; // Agregar info del usuario al request
        console.log('======================');
        next();
    });
};

// Middleware para verificar que el usuario es admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Acceso denegado',
            message: 'Necesitas permisos de administrador para esta acción'
        });
    }
    next();
};

// Middleware para verificar que el usuario es el propietario del recurso o admin
const requireOwnerOrAdmin = (req, res, next) => {
    const resourceUserId = parseInt(req.params.userId) || parseInt(req.body.userId);
    
    if (req.user.role !== 'admin' && req.user.id !== resourceUserId) {
        return res.status(403).json({ 
            error: 'Acceso denegado',
            message: 'Solo puedes acceder a tus propios recursos'
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireOwnerOrAdmin
};
