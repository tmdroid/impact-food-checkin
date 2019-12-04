class Utilities {

    /**
     * Gets the day name from the current date
     *
     * @returns string
     */
    public static getCurrentDayOfMonth = (): number => {
        const today: Date = new Date();
        return today.getDay();
    };


    /**
     * Convers the meal from a numeric ordering (1, 2, 3)
     * to a bitwise value used for storing in the database
     *
     * breakfast => 1
     * lunch     => 2
     * dinner    => 4
     *
     * We can then do bitwise operations to store all the meals in one int number
     *
     * @param meal
     * @returns number
     */
    public static getMealValue = (meal: number): string => {
        let value = {
            1: 'breakfast',
            2: 'lunch',
            3: 'dinner',
        };

        return value[meal];
    };
}

export default Utilities