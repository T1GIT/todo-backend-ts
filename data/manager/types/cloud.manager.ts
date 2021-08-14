const mongoose = require('mongoose')
const env = require('../../../environment')
const config = require('../../config')
const _ = require('lodash')

import Manager from '../Manager'


class CloudManager implements Manager {

    async connect() {
        const uri = `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@express-nodejs.jk9vv.mongodb.net/${env.DB_NAME}`
        await mongoose.connect(uri, config.OPTIONS)
        return mongoose.connection
    }

    async disconnect() {
        await mongoose.connection.close()
    }

    async clean() {
        const collections = mongoose.connection.collections
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
}


export default new CloudManager()
