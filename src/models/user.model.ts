import {model, Schema} from "mongoose"
import ObjectId = Schema.Types.ObjectId
import String = Schema.Types.String
import Number = Schema.Types.Number
import Boolean = Schema.Types.Boolean
import {IUserModel, IUser} from "../interfaces/user.interface";

const meal = {
    breakfast: {
        type: Boolean,
        required: true
    },
    lunch: {
        type: Boolean,
        required: true
    },
    dinner: {
        type: Boolean,
        required: true
    }
}

const UserSchema: Schema = new Schema({
    _id: ObjectId,

    nume: {
        type: String,
        required: true
    },
    prenume: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    telefon: {
        type: String,
        required: false
    },
    adresa: {
        type: String,
        required: false
    },
    birth: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    primaData: {
        type: Boolean,
        required: false
    },
    biserica: {
        type: String,
        required: false
    },
    lucruStudii: {
        type: String,
        required: false
    },
    tutore: {
        type: String,
        required: false
    },
    instrument: {
        type: String,
        required: false
    },
    muzica: {
        type: [String],
        required: false
    },
    mese: {
        type: Number,
        required: true
    },
    cazare: {
        type: String,
        required: false
    },
    m_rezervate: {
        29: meal,
        30: meal,
        31: meal,
        1: meal,
        2: meal
    },
    mate: {
        type: String,
        required: false
    },
    total: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: false
    },
    qr: {
        type: String,
        required: false,
        index: true
    },
    index: {
        type: Number,
        required: false
    }
})

UserSchema.methods.hasMeal = function (day: number, meal: string) {
    return this.m_rezervate[day][meal]
}

UserSchema.methods.eatMeal = async function (day: number, meal: string) {
    this.m_rezervate[day][meal] = false
    await this.save()

    return this.m_rezervate[day]
}

UserSchema.statics.findByCode = async (code: string) => {
    return await Users.findOne({qr: code})
}


const Users: IUserModel = model<IUser, IUserModel>('User', UserSchema)
export = Users