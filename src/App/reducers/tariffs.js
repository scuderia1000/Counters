import {TARIFF} from "../constants/ActionConst";
import {cloneObject} from "../constants/FunctionConst";

const initialState = {
    // list: {
    //         'tariffId_1': {
    //             id: 'tariffId_1',
    //             counterId: '1',
    //             createTime: new Date().getTime(),
    //             name: 'Холодная вода',
    //             amount: 30.23, // ставка тарифа
    //         },
    //         'tariffId_2': {
    //             id: 'tariffId_2',
    //             counterId: '1',
    //             createTime: new Date().getTime(),
    //             name: 'Горячая вода',
    //             amount: 130.03, // ставка тарифа
    //         }
    // }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case TARIFF.CREATE: {
            return {
                ...state,
                list: {
                    ...state.list,
                    ...action.payload
                }
            }
        }
        case TARIFF.UPDATE: {
            /*
            const { list = {} } = state;
            const { counterTariffs = {}, counterId = '' } = action.payload;
            const oldTariffs = cloneObject(list);
            const oldTariffsIds = Object.keys(list).filter(id => list[id].counterId === counterId);
            const newTariffsIds = Object.keys(counterTariffs);
            oldTariffsIds.forEach(id => {
                if (!newTariffsIds.includes(id)) {
                    oldTariffs[id]['deleteTime'] = Date.now();
                }
            });
             */
            return {
                ...state,
                list: {
                    ...state.list,
                    ...action.payload
                }
            }
        }
        case TARIFF.REMOVE_TARIFF: {
            const { tariffId = '' } = action.payload;
            const tariffsList = cloneObject(state.list);

            tariffsList[tariffId]['deleteTime'] = Date.now();
            // delete tariffsList[tariffId];
            return {
                ...state,
                list: tariffsList
            }
        }
        case TARIFF.REMOVE_TARIFF_BATCH: {
            const { tariffIds = [] } = action.payload;
            const tariffsList = cloneObject(state.list);

            tariffIds.forEach(id => {
                tariffsList[id]['deleteTime'] = Date.now();
            });
            // tariffIds.forEach(id => delete tariffsList[id]);
            return {
                ...state,
                list: tariffsList
            }
        }
        case TARIFF.REMOVE_ALL_COUNTER_TARIFFS: {
            const { counterId = '' } = action.payload;
            const tariffsList = cloneObject(state.list);
            const tariffsIds = Object.values(tariffsList)
                .filter(tariff => tariff.counterId === counterId)
                .map(tariff => tariff.id);
            tariffsIds.forEach(id => delete tariffsList[id])

            return {
                ...state,
                list: tariffsList
            }
        }
        default: return state;
    }
}