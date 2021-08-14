import Manager from "../Manager";

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const config = require('../../config')


const memoryServer = new MongoMemoryServer()


class MemoryManager implements Manager {

    async connect() {
        await memoryServer.start()
        const uri = memoryServer.getUri()
        await mongoose.connect(uri, config.OPTIONS)
        return mongoose.connection
    }

    async disconnect() {
        await mongoose.connection.close()
        await memoryServer.stop()
    }

    async clean() {
        const collections = mongoose.connection.collections
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
}


export default new MemoryManager()
