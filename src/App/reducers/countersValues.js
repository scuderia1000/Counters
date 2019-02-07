import { COUNTERS_VALUES } from "../constants/ActionConst";
import { cloneObject } from "../constants/FunctionConst";

const initState = {
    /*
    list: {
        counterId: [
            {
                date_2: ms {
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
                }
            },

        ]
    }
     */
};

export default (state = initState, action) => {
    switch (action.type) {
        case COUNTERS_VALUES.OPEN: {
            const { counterId = '' } = action.payload;
            if (!counterId) return state;

            return {
                ...state,
                currentCounterId: counterId
            }
        }
        case COUNTERS_VALUES.UPDATE: {
            const { counterId = '', counterData = ''} = action.payload;
            if (!counterId) return state;

            return {
                ...state,
                list: {
                    ...state.list,
                    [counterId]: [
                        ...counterData
                    ]
                },
                // currentCounterId: counterId
            }
        }

        default: return state;
    }
}