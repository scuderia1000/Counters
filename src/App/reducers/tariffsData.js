import uuid from "uuid";
import { TARIFF_DATA } from "../constants/ActionConst";
import { cloneObject } from "../constants/FunctionConst";


const initialState = {
    list: {
        'tariffId_1': {
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
            }
        },
        'tariffId_2': {
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
            }
        },
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case TARIFF_DATA.CREATE: {
            const newData = action.payload;
            const tariffIds = Object.keys(newData);
            const dataList = state.list ? cloneObject(state.list) : {};

            if (!tariffIds.length) return state;
            const dateNow = Date.now();

            tariffIds.forEach(tariffId => {
                const tariffData = dataList[tariffId];
                const tariffDataIds = tariffData && Object.keys(tariffData) || [];
                let dataId = newData[tariffId].dataId;
                if (dataId && tariffDataIds.length && tariffDataIds.includes(dataId)) {
                    dataList[tariffId] = {
                        ...dataList[tariffId],
                        [dataId]: {
                            ...dataList[tariffId][dataId],
                            ...newData[tariffId],
                        }
                    }
                } else {
                    dataId = uuid.v4();
                    dataList[tariffId] = {
                        ...dataList[tariffId],
                        [dataId]: {
                            ...newData[tariffId],
                            dataId: dataId,
                            tariffId: tariffId,
                            createTime: dateNow,
                        }
                    }
                }
            });

            return {
                ...state,
                list: dataList,
            }
        }
        default: return state;
    }
}