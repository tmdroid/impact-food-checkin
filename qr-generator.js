require('dotenv').config()

const qrcode = require('qrcode')
const mongoose = require('mongoose')
const Users = require("./src/models/user.model")

const database_url = process.env.IMPACT_DATABASE_URL
let db = null;
let csv = "firstname,lastname,qrfile\n"

mongoose.connect(database_url, {useNewUrlParser: true})
    .then(async () => {
        db = mongoose.connection
        db.on('error', (error) => console.error(error))
        db.once('open', () => console.log('connected to database'))
        await generate()

        console.log(csv)
    })
    .catch(console.log);


let generate = async () => {

    let all = await db.collection('users').find().toArray()

    for(let i = 0; i < all.length; i++) {
        let user = all[i]

        let fn = user.nume.trim()
        let ln = user.prenume.trim()
        let qr = user.qr
        let name = `${qr}.png`
        let path = `./qr_codes/${name}`

        let f = await qrcode.toFile(path, qr)
        csv += `${fn},${ln},${name}\n`
    }

    return Promise.resolve()

};