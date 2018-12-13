// react
// import React from 'react';
// libraries

// own component

// styles


export const TARIFF_COMPONENT = {
    name: {
        placeholder: 'Название тарифа...',
        errorText: 'Введите название',
        required: true,
    },
    amount: {
        keyboardType: 'numeric',
        placeholder: 'Ставка тарифа...',
        errorText: 'Введите ставку тарифа',
        style: {
            marginBottom: 15
        }
    }
};

export default {
    counter: {
        fields: {
            counterName: {
                placeholder: 'Название счетчика...',
                autoFocus: true,
                required: true,
                errorText: 'Введите название',
                style: {
                    marginBottom: 15
                }
            },
            /*tariffName: {
                ...TARIFF_COMPONENT.name,
                required: true,
            },
            tariff: {
                ...TARIFF_COMPONENT.amount,
                style: {
                    marginBottom: 15
                }
            },*/
            personalAccount: {
                placeholder: '№ счета/договора...',
                errorText: 'Введите №',
            },
            fio: {
                placeholder: 'ФИО, с кем заключен договор...',
                errorText: 'Введите ФИО',

            },
            address: {
                placeholder: 'Адрес...',
                errorText: 'Введите адрес',
            },
            emailAddress: {
                placeholder: 'E-mail, куда отправлять данные...',
                errorText: 'Введите e-mail',
                style: {
                    marginBottom: 15
                }
            },
        }
    }
}