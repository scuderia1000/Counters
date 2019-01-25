import { TARIFF_DATA } from "../constants/ActionConst";
import { cloneObject } from "../constants/FunctionConst";

const initState = {
    /*
    list: {
        counterId: {
            date_2: ms {
                data: {
                    tariffName_1: {
                        tariffName_1,
                        previous_data,
                        current_data,
                        difference,
                        tariff_amount,
                        total,

                    },
                    tariffName_2
                    tariffName_N
                },
                amount: сумма по всем тарифам на эту дату


            },
            date_1: ms {

            }
        }
    }
     */
};

export default (state = initState, action) => {
    switch (action.type) {

        default: return state;
    }
}