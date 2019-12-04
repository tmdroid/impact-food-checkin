import {database_url} from "./src/util/credentials";

let inscrisi = require('./inscrisi');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./dist/models/user.model');

const toateMesele = {
    29: {
        breakfast: false,
        lunch: false,
        dinner: true,
    },
    30: {
        breakfast: true,
        lunch: true,
        dinner: true,
    },
    31: {
        breakfast: true,
        lunch: true,
        dinner: true,
    },
    1: {
        breakfast: true,
        lunch: true,
        dinner: true,
    },
    2: {
        breakfast: true,
        lunch: false,
        dinner: false,
    }
};

const niciOMasa = {
    29: {
        breakfast: false,
        lunch: false,
        dinner: false,
    },
    30: {
        breakfast: false,
        lunch: false,
        dinner: false,
    },
    31: {
        breakfast: false,
        lunch: false,
        dinner: false,
    },
    1: {
        breakfast: false,
        lunch: false,
        dinner: false,
    },
    2: {
        breakfast: false,
        lunch: false,
        dinner: false,
    }
};



mongoose.connect(database_url, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));

inscrisi = Object.values(inscrisi);
inscrisi.forEach(async (participant) => {
    const md5sum = crypto.createHash('md5');
    let user = {...participant};

    user.muzica = user.muzica.replace('Implicare pe partea muzicală: ', '')
        .replace('.', '')
        .split("|")
        .map((item) => item.trim());
    user.primaData = user.primaData.toLowerCase() === "da";

    let mese = {...niciOMasa};

    user.m_rezervate
        .replace('Mesele rezervate sunt: ', '')
        .replace('Mesele rezervate: ', '')
        .split('|')
        .map((item) =>
            item.split('-')
                .map((item2) => item2.trim())
        )
        .forEach((meal) => {
            let day = meal[1];
            meal = meal[0];

            let value = false;
            switch (meal) {
                case "dejun":
                    value = true;
                    break;
                case "pranz":
                    value = true;
                    break;
                case "cina":
                    value = true;
                    break;
                case "toate":
                    mese = {...toateMesele};
            }

            let convertedMeal = {
                'dejun': 'breakfast',
                'prânz': 'lunch',
                'pranz': 'lunch',
                'cina': 'dinner',
                'cină': 'dinner'
            }[meal];

            let convertedDay = {
                'duminică': 29,
                'luni': 30,
                'marți': 31,
                'miercuri': 1,
                'joi': 2,
            }[day]

            if (day !== undefined && day !== "") {
                mese[convertedDay][convertedMeal] = value;
            }
        });


    user.qr = md5sum
        .update(participant.date + participant.index + participant.telefon + participant.adresa)
        .digest('hex');

    user = new User({
        _id: new mongoose.Types.ObjectId(),
        nume: user.nume,
        prenume: user.prenume,
        email: user.email,
        telefon: user.telefon,
        adresa: user.adresa,
        birth: user.birth,
        age: user.age,
        primaData: user.primaData,
        biserica: user.biserica,
        lucruStudii: user.lucruStudii,
        tutore: user.tutore,
        instrument: user.instrument,
        muzica: user.muzica,
        mese: user.mese,
        cazare: user.cazare,
        m_rezervate: mese,
        mate: user.mate,
        total: user.total,
        date: user.date,
        qr: user.qr,
        index: user.index,
    });

    await user.save();
});

console.log('done');