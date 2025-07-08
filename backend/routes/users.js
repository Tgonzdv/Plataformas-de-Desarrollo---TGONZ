const express = require('express');
const bcrypt = require('bcryptjs');
const DataModel = require('../models/DataModel');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

const usersModel = new DataModel('users.json');

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', requireAdmin, (req, res) => {
    try {
        const users = usersModel.read();
        // No enviar passwords en la respuesta
        const safeUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }));

        res.json({
            message: 'Usuarios obtenidos exitosamente',
            data: safeUsers
        });
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener los usuarios'
        });
    }
});

// GET /api/users/:id - Obtener usuario específico (solo admin o el mismo usuario)
router.get('/:id', (req, res) => {
    try {
        const requestedUserId = parseInt(req.params.id);
        const requestingUserId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        // Verificar permisos
        if (!isAdmin && requestedUserId !== requestingUserId) {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Solo puedes ver tu propia información'
            });
        }

        const user = usersModel.findById(requestedUserId);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'El usuario solicitado no existe'
            });
        }

        // No enviar password
        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.json({
            message: 'Usuario obtenido exitosamente',
            data: safeUser
        });
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener el usuario'
        });
    }
});

// POST /api/users - Crear nuevo usuario (solo admin)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { username, password, email, role = 'user' } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Datos faltantes',
                message: 'Usuario y contraseña son requeridos'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = usersModel.findByProperty('username', username);
        if (existingUser) {
            return res.status(409).json({
                error: 'Usuario ya existe',
                message: 'El nombre de usuario ya está en uso'
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = usersModel.create({
            username,
            password: hashedPassword,
            email: email || `${username}@pizzaya.com`,
            role,
            createdAt: new Date().toISOString()
        });

        // No enviar password en la respuesta
        const safeUser = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt
        };

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            data: safeUser
        });
    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al crear el usuario'
        });
    }
});

// PUT /api/users/:id - Actualizar usuario (solo admin o el mismo usuario)
router.put('/:id', (req, res) => {
    try {
        const targetUserId = parseInt(req.params.id);
        const requestingUserId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        // Verificar permisos
        if (!isAdmin && targetUserId !== requestingUserId) {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Solo puedes actualizar tu propia información'
            });
        }

        const { username, email, role } = req.body;
        const updates = {};

        if (username) {
            // Verificar que el username no esté en uso por otro usuario
            const existingUser = usersModel.findByProperty('username', username);
            if (existingUser && existingUser.id !== targetUserId) {
                return res.status(409).json({
                    error: 'Usuario ya existe',
                    message: 'El nombre de usuario ya está en uso'
                });
            }
            updates.username = username;
        }

        if (email) updates.email = email;
        
        // Solo admin puede cambiar roles
        if (role && isAdmin) {
            updates.role = role;
        }

        const updatedUser = usersModel.update(targetUserId, updates);
        if (!updatedUser) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'El usuario que intentas actualizar no existe'
            });
        }

        // No enviar password
        const safeUser = {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt
        };

        res.json({
            message: 'Usuario actualizado exitosamente',
            data: safeUser
        });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al actualizar el usuario'
        });
    }
});

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', requireAdmin, (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // No permitir eliminar al admin principal (id: 1)
        if (userId === 1) {
            return res.status(400).json({
                error: 'Operación no permitida',
                message: 'No se puede eliminar el usuario administrador principal'
            });
        }

        const deleted = usersModel.delete(userId);
        if (!deleted) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'El usuario que intentas eliminar no existe'
            });
        }

        res.json({
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al eliminar el usuario'
        });
    }
});

// PUT /api/users/:id/password - Cambiar contraseña
router.put('/:id/password', async (req, res) => {
    try {
        const targetUserId = parseInt(req.params.id);
        const requestingUserId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        // Verificar permisos
        if (!isAdmin && targetUserId !== requestingUserId) {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Solo puedes cambiar tu propia contraseña'
            });
        }

        const { currentPassword, newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                error: 'Datos faltantes',
                message: 'Nueva contraseña es requerida'
            });
        }

        const user = usersModel.findById(targetUserId);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'El usuario no existe'
            });
        }

        // Si no es admin, verificar contraseña actual
        if (!isAdmin && currentPassword) {
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Contraseña incorrecta',
                    message: 'La contraseña actual no es correcta'
                });
            }
        }

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        usersModel.update(targetUserId, { password: hashedPassword });

        res.json({
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al cambiar la contraseña'
        });
    }
});

module.exports = router;
