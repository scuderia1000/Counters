import uuid from "uuid";
import { TARIFF_DATA } from "../constants/ActionConst";
import { cloneObject } from "../constants/FunctionConst";


const initialState = {
    /*list: {
        // 'tariffId_1': {
            '1': {
                dataId: '1',
                tariffId: 'tariffId_1',
                createTime: Date.now(),
                value: '15', // значение с которого начинать расчет
            },
            '2': {
                dataId: '2',
                tariffId: 'tariffId_1',
                createTime: Date.now() + 100,
                value: '20',
            },
            '5': {
                dataId: '5',
                tariffId: 'tariffId_1',
                createTime: Date.now() + 200,
                value: '30',
            },
        // },
        // 'tariffId_2': {
            '3': {
                dataId: '3',
                tariffId: 'tariffId_2',
                createTime: Date.now(),
                value: '5',
            },
            '4': {
                dataId: '4',
                tariffId: 'tariffId_2',
                createTime: Date.now() + 100,
                value: '10',
            },
            '6': {
                dataId: '6',
                tariffId: 'tariffId_2',
                createTime: Date.now() + 200,
                value: '40',
            },
        // },
    }*/
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
            const list = cloneObject(state.list);
            const oldDataIds = Object.keys(list);

            const newList = {};

            Object.keys(tariffsData).forEach(dataId => {
                const newData = {...tariffsData[dataId]};
                if (oldDataIds.length) {
                    oldDataIds
                        .filter(id => list[id].tariffId === newData.tariffId)
                        .sort((idA, idB) => list[idB].createTime - list[idA].createTime);
                    if (!oldDataIds.includes(dataId)) {
                        newData['prevValue'] = list[oldDataIds[0]].currentValue;
                    }
                    let difference = newData.currentValue - newData.prevValue;
                    difference = (difference ^ 0) === difference ? difference : difference.toFixed(1);
                    newData['difference'] = difference;
                    newData['total'] = difference * newData.amount;
                } else {
                    newData['prevValue'] = null;
                    newData['difference'] = null;
                    newData['total'] = null;
                }
                newList[dataId] = newData;
            });


            /*const newData = action.payload.tariffData;
            const tariffIds = Object.keys(newData);
            const dataList = state.list ? cloneObject(state.list) : {};

            if (!tariffIds.length) return state;
            const dateNow = Date.now();

            tariffIds.forEach(tariffId => {
                const tariffData = dataList[tariffId];
                const dataIds = tariffData && Object.keys(tariffData) || [];

                let updatedDataId = newData[tariffId].dataId;
                if (updatedDataId && dataIds.length && dataIds.includes(updatedDataId)) {
                    dataList[tariffId] = {
                        ...dataList[tariffId],
                        [updatedDataId]: {
                            ...dataList[tariffId][updatedDataId],
                            ...newData[tariffId],
                        }
                    }
                } else {
                    updatedDataId = uuid.v4();
                    dataList[tariffId] = {
                        ...dataList[tariffId],
                        [updatedDataId]: {
                            ...newData[tariffId],
                            dataId: updatedDataId,
                            tariffId: tariffId,
                            createTime: dateNow,
                        }
                    }
                }
            });*/

            return {
                ...state,
                list: {
                    ...state.list,
                    ...newList
                },
            }
        }
        case TARIFF_DATA.EDIT: {
            const editData = action.payload;
            if (!editData) return state;

            return {
                ...state,
                editData: editData
            }
        }
        case TARIFF_DATA.RESET_EDIT: {
            return {
                ...state,
                editData: {}
            }
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
                    })
                });

            }

            return {
                ...state,
                list: dataList
            }
        }
        case TARIFF_DATA.REMOVE_ALL_TARIFFS_DATA: {
            const tariffsIds = action.payload.tariffsIds;
            if (!tariffsIds.length) return state;

            const dataList = state.list ? cloneObject(state.list) : {};
            tariffsIds.forEach(tariffId => {
                delete dataList[tariffId];
            });

            return {
                ...state,
                list: dataList,
            }
        }
        default: return state;
    }
}