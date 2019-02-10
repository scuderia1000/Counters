export const cloneObject = (obj = {}) => JSON.parse(JSON.stringify(obj));

export const calculateCounterValues = (counterId, tariffs, tariffsData) => {
    const tariffsIds = Object.keys(tariffsData);
    const counterTariffs = cloneObject(tariffs.list[counterId]);

    const sortedTariffsData = {}; // key = date

    tariffsIds.forEach(tariffId => {
        const dataIds = Object.keys(tariffsData[tariffId]);
        dataIds.sort((dataId1, dataId2) => tariffsData[tariffId][dataId2].createTime - tariffsData[tariffId][dataId1].createTime);
        dataIds.forEach((dataId, index) => {
            const data = tariffsData[tariffId][dataId];
            if (index !== dataIds.length - 1) {
                const tariffName = counterTariffs[tariffId].name;
                const previousDataId = dataIds[index + 1];
                const previousValue = Number(tariffsData[tariffId][previousDataId].value);
                const currentValue = Number(tariffsData[tariffId][dataId].value);
                const difference = currentValue - previousValue;
                const tariffAmount = Number(counterTariffs[tariffId].amount);
                const total = Number(difference) * Number(tariffAmount);

                sortedTariffsData[data.createTime] = {
                    ...sortedTariffsData[data.createTime],
                    [tariffName]: {
                        dataId: dataId,
                        tariffId: tariffId,
                        previousValue: previousValue,
                        currentValue: currentValue,
                        difference: (difference ^ 0) === difference ? difference : difference.toFixed(1),
                        tariffAmount: tariffAmount && tariffAmount.toFixed(2) || 0,
                        total: total && total.toFixed(2) || 0,
                    },

                }
            }
        });
    });
    return Object.keys(sortedTariffsData).map(date => {
        const amountByDate = Object.keys(sortedTariffsData[date])
            .map(tariffName => sortedTariffsData[date][tariffName].total)
            .reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue));
        console.log('amountByDate', amountByDate)
        return {
            [date]: {
                tariffs: sortedTariffsData[date],
                total: amountByDate && amountByDate.toFixed(2) || 0,
            }
        }
    });
};

export const getCounterTariffsData = (counterId, tariffs = {}, tariffsValues = {}, ) => {
    const { list = {} } = tariffs;
    const counterTariffs = cloneObject(list[counterId]);
    const tariffsIds = Object.keys(counterTariffs);
    const tariffsData = {};

    tariffsIds.forEach(id => {
        if (tariffsValues.list[id]) {
            tariffsData[id] = cloneObject(tariffsValues.list[id]);
        }
    });
    return tariffsData;
};

export const getEmailBody = (personalAccount, fio, address,) => {
    return `Лицевой счет №: ${personalAccount}\n` +
        `ФИО: ${fio}\n` +
        `Адрес: ${address}\n`;
};

export const query = (textQuery, state) => {
    let fields = [];
    let storeName = '';
    let predicate = [];
    const splittedTextQuery = textQuery.split(' ');
    splittedTextQuery.forEach((text, index) => {
        switch (text) {
            case 'select': {
                for (let i = index + 1; i < splittedTextQuery.length; i++) {
                    if (splittedTextQuery[i] === 'from') break;
                    fields.push(splittedTextQuery[i]);
                }
                break;
            }
            case 'from': {
                storeName = splittedTextQuery[index + 1];
                break;
            }
            case 'where': {
                for (let i = index + 1; i < splittedTextQuery.length; i++) {
                    // if (splittedTextQuery[i] === 'and') return;
                    // пока только одно условие можно передать
                    predicate.push(splittedTextQuery[i]);
                }
                break;
            }
            default:
                break;
        }
    });

    let store = state[storeName] && cloneObject(state[storeName].list);
    let result = [];
    if (store) {
        const predicateLength = predicate.length;
        if (predicateLength) {
            store = Object.values(store);
            for (let i = 0; i < predicateLength; i++) {
                if (predicate[i] === '=') {
                    const propertyName = predicate[i - 1];
                    const propertyValue = predicate[i + 1];
                    for (let j = 0; j < store.length; j++) {
                        if (store[j].hasOwnProperty(propertyName) && store[j][propertyName] === propertyValue) {
                            result.push(store[j]);
                        }
                    }
                }
            }
        }
    }
    return result;
};