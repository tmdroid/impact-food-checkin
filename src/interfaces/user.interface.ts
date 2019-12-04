import {Document, Model, Types} from "mongoose";
import Array = Types.Array

interface DailyMeals {
    breakfast: boolean,
    lunch: boolean,
    dinner: boolean
}

interface IMese extends Document {
    29: DailyMeals
    30: DailyMeals
    31: DailyMeals
    1: DailyMeals
    2: DailyMeals
}

interface IUserDocument extends Document{
    nume: string
    prenume: string
    email: string
    telefon: string
    adresa: string
    birth: string
    age: number
    primaData: boolean
    biserica: string
    lucruStudii: string
    tutore: string
    instrument: string
    muzica: Array<string>
    mese: number
    cazare: string
    m_rezervate: IMese
    mate: string
    total: number
    date: string
    qr: string
    index: number
}

interface IUser extends IUserDocument {

    hasMeal: (day: number, meal: string) => boolean
    eatMeal: (day: number, meal: string) => DailyMeals

}

interface IUserModel extends Model<IUser> {

    findByCode: (code: string) => IUser

}

export {IUser, IUserModel, DailyMeals}