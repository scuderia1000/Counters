export const cloneObject = obj => JSON.parse(JSON.stringify(obj));

export const calculateCounterValues = (counterData, counterTariffs, tariffsData) => {
    const tariffsIds = Object.keys(tariffsData);
    const result = [];
    const sortedTariffsData = {}; // key = date
    tariffsIds.forEach(tariffId => {
        const dataIds = Object.keys(tariffsData[tariffId]);
        dataIds.sort((dataId1, dataId2) => tariffsData[tariffId][dataId2].createTime - tariffsData[tariffId][dataId1].createTime);
        dataIds.forEach((dataId, index) => {
            const data = tariffsData[tariffId][dataId];
            if (index !== dataIds.length - 1) {
                const tariffName = counterTariffs[tariffId].name;
                const previousDataId = dataIds[index + 1];
                const previousValue = tariffsData[tariffId][previousDataId].value;
                const currentValue = tariffsData[tariffId][dataId].value;
                const difference = currentValue - previousValue;
                const tariffAmount = counterTariffs[tariffId].amount;
                const total = difference * tariffAmount;

                sortedTariffsData[data.createTime] = {
                    ...sortedTariffsData[data.createTime],
                    [tariffName]: {
                        dataId: dataId,
                        previousValue: previousValue,
                        currentValue: currentValue,
                        difference: (difference ^ 0) === difference ? difference : difference.toFixed(1),
                        tariffAmount: Number(tariffAmount).toFixed(2),
                        total: total.toFixed(2)
                    },

                }
            }
        });
    });
    // console.log('sortedTariffsData', sortedTariffsData);
    // return sortedTariffsData;
    return Object.keys(sortedTariffsData).map(date => {
        const amountByDate = Object.keys(sortedTariffsData[date])
            .map(tariffName => sortedTariffsData[date][tariffName].total)
            .reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue));
        console.log('amountByDate', amountByDate)
        return {
            [date]: {
                tariffs: sortedTariffsData[date],
                total: amountByDate.toFixed(2),
            }
        }
    });
};