import express, {Request, Response} from 'express'
import Users from './../models/user.model'
import Utilities from '../util/utilities'
import {DailyMeals, IUser} from "../interfaces/user.interface";

export default class QrController {

    private path = '/qr'
    private router = express.Router();


    constructor() {
        this.initializeRoutes();
    }

    /**
     * Initialize the routes for the current controller
     */
    private initializeRoutes() {

        this.router
            .get(this.path, QrController.getMeals)
            .post(this.path, QrController.consumeMeal)

    }

    /**
     * Can get the current meals left for the user specified by the code
     *
     * Query:
     *  code: hash under the qr code
     *
     * @param {e.Request} request
     * @param {e.Response} response
     * @returns {Promise<e.Response>}
     */
    static getMeals = async (request: Request, response: Response) => {

        const code = request.query.code;
        let day = request.query.day;

        if (code) {

            const user: IUser = await Users.findByCode(code);
            if (!user) {
                return response.status(404)
                    .send('User not found');
            }

            if(!day) {
                day = Utilities.getCurrentDayOfMonth();
            }

            const meals: DailyMeals = user.m_rezervate[day]
            if(meals === undefined || meals === null) {
                return response.status(404)
                    .send('Date not found')
            }

            return response.send(meals)
        }

        return response.status(422)
            .send('Qr code not specified');
    }


    /**
     * Consumes the specified meal for the specified user
     *
     * Body:
     *  code: hash under the qr code
     *  meal: number of meal to eat
     *      1 => breakfast
     *      2 => lunch
     *      3 => dinner
     *
     * @param {e.Request} request
     * @param {e.Response} response
     * @returns {Promise<e.Response>}
     */
    static consumeMeal = async (request: Request, response: Response) => {
        const code = request.body.code;
        const mealNumber = request.body.meal;
        let day = request.body.day;

        if (code && mealNumber) {

            const user: IUser = await Users.findByCode(code);
            if (!user) {
                return response.status(404)
                    .send('User not found')
            }

            const meal: string = Utilities.getMealValue(mealNumber);
            if(!day) {
                day = Utilities.getCurrentDayOfMonth();
            }

            if (day && meal && user.hasMeal(day, meal)) {
                const meals: DailyMeals = await user.eatMeal(day, meal);

                if(meals === undefined || meals === null) {
                    return response.status(404)
                        .send('Date not found')
                }

                return response.send(meals)
            }


            return response.status(403)
                .send('Meal not available for participant')
        }

        return response.status(422)
            .send('Qr code or meal not specified');
    }
}