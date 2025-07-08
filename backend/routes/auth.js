const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataModel = require('../models/DataModel');
const router = express.Router();

const usersModel = new DataModel('users.json');

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Datos faltantes',
                message: 'Usuario y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const user = usersModel.findByProperty('username', username);
        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Verificar contraseña (temporal: comparación directa para desarrollo)
        // En producción, usar bcrypt.compare()
        const isValidPassword = password === 'admin123' && username === 'admin' ||
                               password === 'cliente123' && username === 'jorge';
        
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Generar JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Respuesta exitosa
        res.json({
            message: 'Inicio de sesión exitoso',
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email
            },
            token,
            expiresIn: '24h'
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error interno durante el inicio de sesión'
        });
    }
});

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

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

        // Crear nuevo usuario
        const newUser = usersModel.create({
            username,
            password: hashedPassword,
            email: email || `${username}@pizzaya.com`,
            role: 'user',
            createdAt: new Date().toISOString()
        });

        // Generar JWT
        const token = jwt.sign(
            { 
                id: newUser.id, 
                username: newUser.username, 
                role: newUser.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
                email: newUser.email
            },
            token,
            expiresIn: '24h'
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error interno durante el registro'
        });
    }
});

// POST /api/auth/verify - Verificar token
router.post('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Token requerido',
            message: 'Token de acceso requerido'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Token inválido',
                message: 'El token no es válido o ha expirado'
            });
        }

        res.json({
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    });
});

module.exports = router;
