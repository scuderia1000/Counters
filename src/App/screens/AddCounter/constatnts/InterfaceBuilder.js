export const TARIFF_COMPONENT = {
    tariffName: {
        placeholder: 'Название тарифа...',
        errorText: 'Введите название',
        required: true,
    },
    tariffAmount: {
        keyboardType: 'numeric',
        placeholder: 'Ставка тарифа...',
        errorText: 'Введите ставку тарифа',
        required: true,
    },
    tariffCurrentValue: {
        keyboardType: 'numeric',
        placeholder: 'Текущее значение...',
        errorText: 'Введите текущее значение тарифа',
        style: {
            marginBottom: 15
        },
        required: true,
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
                errorText: 'Неверный формат e-mail',
                style: {
                    marginBottom: 15
                },
                keyboardType: 'email-address',
            },
        }
    },
    tariff: {
        fields: {
            ...TARIFF_COMPONENT
        }
    }
}