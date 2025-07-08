const fs = require('fs');
const path = require('path');

class DataModel {
    constructor(filename) {
        this.filename = filename;
        this.filePath = path.join(__dirname, '../data', filename);
        this.ensureDataDirectory();
    }

    ensureDataDirectory() {
        const dataDir = path.dirname(this.filePath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    }

    read() {
        try {
            if (!fs.existsSync(this.filePath)) {
                return [];
            }
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error leyendo ${this.filename}:`, error);
            return [];
        }
    }

    write(data) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error(`Error escribiendo ${this.filename}:`, error);
            return false;
        }
    }

    findById(id) {
        const data = this.read();
        return data.find(item => item.id === parseInt(id));
    }

    findByProperty(property, value) {
        const data = this.read();
        return data.find(item => item[property] === value);
    }

    create(newItem) {
        const data = this.read();
        const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
        const itemWithId = { id: maxId + 1, ...newItem };
        data.push(itemWithId);
        this.write(data);
        return itemWithId;
    }

    update(id, updates) {
        const data = this.read();
        const index = data.findIndex(item => item.id === parseInt(id));
        if (index === -1) return null;
        
        data[index] = { ...data[index], ...updates };
        this.write(data);
        return data[index];
    }

    delete(id) {
        const data = this.read();
        const filteredData = data.filter(item => item.id !== parseInt(id));
        this.write(filteredData);
        return data.length !== filteredData.length;
    }
}

module.exports = DataModel;
