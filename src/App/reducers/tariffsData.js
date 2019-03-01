import uuid from 'uuid';
import { TARIFF_DATA } from '../constants/ActionConst';
import { cloneObject } from '../constants/FunctionConst';


const initialState = {
    // list: {
    //         '1': {
    //             id: '1',
    //             tariffId: 'tariffId_1',
    //             prevValue: null,
    //             currentValue: 5,
    //             amount: 30.23,
    //             difference: null,
    //             total: null,
    //             createTime: Date.now(),
    //         },
    //         '2': {
    //             id: '2',
    //             tariffId: 'tariffId_1',
    //             prevValue: 5,
    //             currentValue: 15,
    //             amount: 30.23,
    //             difference: 10,
    //             total: 302.3,
    //             createTime: Date.now() + 100,
    //         },
    //         '3': {
    //             id: '3',
    //             tariffId: 'tariffId_2',
    //             prevValue: null,
    //             currentValue: 10,
    //             amount: 130.03,
    //             difference: null,
    //             total: null,
    //             createTime: Date.now(),
    //         },
    //         '4': {
    //             id: '4',
    //             tariffId: 'tariffId_2',
    //             prevValue: 10,
    //             currentValue: 30,
    //             amount: 130.03,
    //             difference: 20,
    //             total: 2600.6,
    //             createTime: Date.now() + 100,
    //         },
    // }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case TARIFF_DATA.CREATE: {
            // const counterId = action.payload.counterId;
            /*
                dataId: {
                    id: ,
                    tariffId: ,
                    currentValue: ,
                    amount: ,
                    createTime: ,
                }
             */
            const tariffsData = action.payload.tariffsData;
            const { list = {} } = state;
            const oldDataIds = Object.keys(list);

            const newList = {};

            Object.keys(tariffsData).forEach(dataId => {
                const newData = { ...tariffsData[dataId] };

                const tariffDataIds = oldDataIds
                    .filter(id => list[id].tariffId === newData.tariffId)
                    .sort((idA, idB) => list[idB].createTime - list[idA].createTime);
                if (tariffDataIds.length) {
                    newData['prevValue'] = Number(list[tariffDataIds[0]].currentValue);

                    let difference = newData.currentValue - newData.prevValue;
                    difference = (difference ^ 0) === difference ? difference : Number(difference.toFixed(1));
                    newData['difference'] = difference;

                    // amount должен приходить из action
                    const total = difference * newData.amount;
                    newData['total'] = (total ^ 0) === total ? total : Number(total.toFixed(1));
                } else {
                    newData['prevValue'] = null;
                    newData['difference'] = null;
                    newData['total'] = null;
                }
                newList[dataId] = newData;
            });

            return {
                ...state,
                list: {
                    ...state.list,
                    ...newList
                },
            };
        }
        case TARIFF_DATA.UPDATE: {
            /*
                dataId: {
                    currentValue:
                }
             */
            const { tariffsData } = action.payload;
            const list = cloneObject(state.list);

            const newList = {};

            Object.keys(tariffsData).forEach(dataId => {
                const newData = { ...list[dataId], ...tariffsData[dataId] };

                if (newData.prevValue !== null) {
                    let difference = newData.currentValue - newData.prevValue;
                    difference = (difference ^ 0) === difference ? difference : difference.toFixed(1);
                    newData['difference'] = difference;

                    let amount = list[dataId].amount;

                    const total = difference * amount;
                    newData['total'] = (total ^ 0) === total ? total : Number(total.toFixed(1));
                }
                newList[dataId] = newData;
                const editedNextData = recalculateNextData({ ...list }, newData);
                if (Object.keys(editedNextData).length) {
                    newList[editedNextData.id] = editedNextData;
                }
            });

            return {
                ...state,
                list: {
                    ...state.list,
                    ...newList
                },
            };
        }
        case TARIFF_DATA.EDIT: {
            // {tariffId_1: {value: , dataId: }, tariffId_2: {value: , dataId: }}
            const editDataIds = action.payload;
            const list = cloneObject(state.list);

            const editData = {};
            editDataIds.forEach(id => {
                const tariffId = list[id].tariffId;
                editData[tariffId] = {
                    id: id,
                    currentValue: list[id].currentValue,
                };
            });
            // if (!editData) return state;

            return {
                ...state,
                editData: editData
            };
        }
        case TARIFF_DATA.RESET_EDIT: {
            return {
                ...state,
                editData: {}
            };
        }
        case TARIFF_DATA.REMOVE: {
            const dataIds = action.payload.dataIds;
            if (!dataIds.length) return state;

            const dataList = state.list ? cloneObject(state.list) : {};
            const tariffsIds = Object.keys(dataList);
            if (tariffsIds.length) {
                dataIds.forEach(dataId => {
                    tariffsIds.forEach(tariffId => {
                        if (dataIds.includes(dataId)) {
                            delete dataList[tariffId][dataId];
                        }
                    });
                });

            }

            return {
                ...state,
                list: dataList
            };
        }
        case TARIFF_DATA.REMOVE_ALL_TARIFFS_DATA: {
            const { tariffsIds = [] } = action.payload;
            // const counterId = action.payload.counterId;
            // if (!counterId) return state;
            //
            // const removedTariffIds = Object.values(tariffs)
            //     .filter(tariff => tariff.counterId === counterId)
            //     .map(tariff => tariff.id);
            //
            const dataList = cloneObject(state.list);
            const removedDataIds = Object.values(dataList)
                .filter(data => tariffsIds.includes(data.tariffId))
                .map(data => data.id);

            removedDataIds.forEach(id => delete dataList[id]);

            return {
                ...state,
                list: dataList,
            };
        }
        default:
            return state;
    }
}

// пересчет следующего значения тарифа, если отредактировали текущие
const recalculateNextData = (allData = {}, newData = {}) => {
    let nextData = {};
    const tariffDataIds = Object.keys(allData)
        .filter(dataId => allData[dataId].tariffId === newData.tariffId)
        .sort((dataIdA, dataIdB) => allData[dataIdA].createTime - allData[dataIdB].createTime);
    const nextDataId = tariffDataIds[tariffDataIds.indexOf(newData.id) + 1];
    if (nextDataId) {
        nextData = allData[nextDataId];
        nextData.prevValue = newData.currentValue;
        let difference = nextData.currentValue - nextData.prevValue;
        difference = (difference ^ 0) === difference ? difference : difference.toFixed(1);

        nextData.difference = difference;
        nextData.total = difference * nextData.amount;
    }

    return nextData;
};