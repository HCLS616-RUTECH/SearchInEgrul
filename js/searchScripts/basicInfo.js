'use strict';


// Функция определения реквизитов текущей выписки
const makeExtract = (array) => {
    let extractString = ``;
    if (array[0] === 'ВЫПИСКА' && array[1] === 'из Единого государственного реестра юридических лиц') {
        extractString = `Выписка ${array[1]} ${array[2]}${array[3]}`;
        return extractString;
    } else {
        return 'Введены некорректные данные.';
    }
}


// Функция поиска основной информации о юридическом лице
const findBasicInformation = (array, indexes, step, object) => {
    let basicInformation = {
        'Полное наименование': 'Не определено',
        'Сокращенное наименование': 'Не определено',
        'Дата регистрации': 'Не определена',
        'ОГРН': 'Не определен',
        'ИНН': 'Не определен',
        'КПП': 'Не определен',
        'Вид уставного капитала': 'Не определен',
        'Размер уставного капитала': 'Не определен',
    };
    if (step !== 1) {
        basicInformation = object;
    }
    if (step === 5) {
        return basicInformation;
    } else {
        let firstIndex = -1;
        let lastIndex = -1;
        switch (step) {
            case 1:
                firstIndex = indexes.name.firstIndex;
                lastIndex = indexes.name.lastIndex;
                break;
            case 2:
                firstIndex = indexes.registration.firstIndex;
                lastIndex = indexes.registration.lastIndex;
                break;
            case 3:
                firstIndex = indexes.tax.firstIndex;
                lastIndex = indexes.tax.lastIndex;
                break;
            case 4:
                firstIndex = indexes.statutCapital.firstIndex;
                lastIndex = indexes.statutCapital.lastIndex;
                break;
        }
        if (firstIndex !== -1 && lastIndex !== -1) {
            let currentValue = 0;
            for (let i = firstIndex; i < lastIndex; i++) {
                switch (true) {
                    case step === 1 && array[i].includes('Полное наименование на русском языке') && basicInformation['Полное наименование'] === 'Не определено':
                        currentValue = createValue(i, lastIndex, 'языке', array[i], array, false);
                        basicInformation['Полное наименование'] = currentValue;
                        currentValue = 0;
                        break;
                    case step === 1 && array[i].includes('Сокращенное наименование на русском'):
                        currentValue = createValue(i, lastIndex, 'русском', array[i], array, false);
                        currentValue = deleteExcessText(currentValue, 'языке');
                        basicInformation['Сокращенное наименование'] = currentValue;
                        currentValue = 0;
                        break;
                    case step === 2 && array[i].includes('Дата регистрации'):
                        if (array[i].includes('2002 года')) {
                            currentValue = createValue(i, lastIndex, 'года', array[i], array, false);
                        } else {
                            currentValue = createValue(i, lastIndex, 'регистрации', array[i], array, false);
                        }
                        basicInformation['Дата регистрации'] = currentValue;
                        currentValue = 0;
                        break;
                    case step === 2 && array[i].includes('ОГРН') && basicInformation['ОГРН'] === 'Не определен':
                        if (!regexpMainMap.regexpColonAndPoint.test(array[i])) {
                            currentValue = createValue(i, lastIndex, 'ОГРН', array[i], array, false);
                            basicInformation['ОГРН'] = currentValue;
                            currentValue = 0;
                        }
                        break;
                    case step === 3 && array[i].includes('ИНН') && basicInformation['ИНН'] === 'Не определен':
                        currentValue = createValue(i, lastIndex, 'лица', array[i], array, false);
                        basicInformation['ИНН'] = currentValue;
                        currentValue = 0;
                        break;
                    case step === 3 && array[i].includes('КПП'):
                        currentValue = createValue(i, lastIndex, 'лица', array[i], array, false);
                        basicInformation['КПП'] = currentValue;
                        currentValue = 0;
                        break;
                    case step === 4 && array[i].includes('Вид'):
                        currentValue = createValue(i, lastIndex, 'Вид', array[i], array, false);
                        basicInformation['Вид уставного капитала'] = currentValue;
                        currentValue = 0;
                        break;
                    case step === 4 && array[i].includes('Размер (в рублях)'):
                        currentValue = createValue(i, lastIndex, 'рублях', array[i], array, false);
                        basicInformation['Размер уставного капитала'] = currentValue;
                        currentValue = 0;
                        break;
                    case basicInformation['Полное наименование'] !== 'Не определено' && basicInformation['Сокращенное наименование'] !== 'Не определено' && basicInformation['Дата регистрации'] !== 'Не определена' && basicInformation['ОГРН'] !== 'Не определен' && basicInformation['ИНН'] !== 'Не определен' && basicInformation['КПП'] !== 'Не определен' && basicInformation['Вид уставного капитала'] !== 'Не определен' && basicInformation['Размер уставного капитала'] !== 'Не определен':
                        i = lastIndex;
                        break;
                }
            }
            return findBasicInformation(array, indexes, step + 1, basicInformation);
        } else {
            return findBasicInformation(array, indexes, step + 1, basicInformation);
        }
    }
}

// Функция поиска адреса и недостоверности о нем
const makeAddress = (array, indexes) => {
    let address = {
        'Адрес': 'Адрес (место нахождения) не определен.',
        'Сведения о недостоверности': 'Не обнаружены',
    };
    let firstIndex = indexes.address.firstIndex;
    let lastIndex = indexes.address.lastIndex;
    if (firstIndex !== -1 && lastIndex !== -1) {
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Адрес юридического лица'):
                    currentValue = createValue(i, lastIndex, 'лица', array[i], array, true);
                    address['Адрес'] = currentValue;
                    break;
                case array[i].includes('сведения') && regexpMainMap.regexpFalseData.test(array[i]):
                    currentValue = createValue(i, lastIndex, 'сведения', array[i], array, false);
                    address['Сведения о недостоверности'] = `В АДРЕСЕ ОБНАРУЖЕНА НЕДОСТОВЕРНОСТЬ: ${currentValue}`;
                    break;
            }
        }
        return address;
    } else {
        return address;
    }

}