import express, {Application} from 'express'
import mongoose, {Connection} from 'mongoose'

const database_url = process.env.IMPACT_DATABASE_URL

export default class App {

    private app: Application
    private readonly port: number
    private db: Connection

    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port

        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
        this.database();
    }

    private middlewares(middlewares: { forEach: (arg0: (middleWare: any) => void) => void }) {
        middlewares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }

    private async database() {
        await mongoose.connect(database_url, {useNewUrlParser: true})

        this.db = mongoose.connection
        this.db.on('error', (error) => console.error(error))
        this.db.once('open', () => console.log('connected to database'))
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }

}
