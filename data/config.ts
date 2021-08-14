import mongoose from 'mongoose'

// TODO: passport.js
export type DataConfig = {
    IN_MEMORY: boolean,
    OPTIONS: mongoose.ConnectOptions,
    MAX_SESSIONS: number
}

const config: DataConfig = {
    IN_MEMORY: true,
    OPTIONS: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    MAX_SESSIONS: 5
}


export default config
