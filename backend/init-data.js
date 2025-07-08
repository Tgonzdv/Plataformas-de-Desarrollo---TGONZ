const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Script para inicializar datos con contraseñas hasheadas
async function initializeData() {
    try {
        console.log('🔧 Inicializando datos del backend...');

        // Hash de contraseñas
        const adminPassword = await bcrypt.hash('admin123', 10);
        const userPassword = await bcrypt.hash('cliente123', 10);

        // Usuarios con contraseñas hasheadas
        const users = [
            {
                "id": 1,
                "username": "admin",
                "password": adminPassword,
                "role": "admin",
                "email": "admin@pizzaya.com",
                "createdAt": "2024-01-01T00:00:00.000Z"
            },
            {
                "id": 2,
                "username": "jorge",
                "password": userPassword,
                "role": "user",
                "email": "jorge@email.com",
                "createdAt": "2024-01-01T00:00:00.000Z"
            }
        ];

        // Escribir archivo de usuarios
        const usersPath = path.join(__dirname, 'data', 'users.json');
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

   
        
    } catch (error) {
        console.error('❌ Error inicializando datos:', error);
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    initializeData();
}

module.exports = { initializeData };
