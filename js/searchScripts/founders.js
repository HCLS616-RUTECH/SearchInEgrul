'use strict';


// Конструкторы объектов записей
function NaturalPersonRecord() {
    this['Участник (учредитель)'] = 'Физическое лицо';
    this['ФИО'] = 'Не определены';
    this['ИНН'] = 'Не определен';
    this['Размер доли'] = 'Не определен';
    this['Номинальная стоимость доли'] = 'Не определена';
    this['Сведения об обременении'] = 'Не обнаружены';
    this['Сведения о недостоверности'] = 'Не обнаружены';
};
function LegalPersonRussianRecord() {
    this['Участник (учредитель)'] = 'Юридическое лицо';
    this['Полное наименование'] = 'Не определено';
    this['ОГРН'] = 'Не определен';
    this['ИНН'] = 'Не определен';
    this['Размер доли'] = 'Не определен';
    this['Номинальная стоимость доли'] = 'Не определена';
    this['Сведения об обременении'] = 'Не обнаружены';
    this['Сведения о недостоверности'] = 'Не обнаружены';
};
function LegalPersonForeignRecord() {
    this['Участник (учредитель)'] = 'Иностранное юридическое лицо';
    this['Полное наименование'] = 'Не определено';
    this['Страна происхождения'] = 'Не определена';
    this['Дата регистрации'] = 'Не определена';
    this['Регистрационный номер'] = 'Не определен';
    this['Наименование регистрирующего органа'] = 'Не определено';
    this['Адрес (место нахождения) в стране происхождения'] = 'Не определен';
    this['Размер доли'] = 'Не определен';
    this['Номинальная стоимость доли'] = 'Не определена';
    this['Сведения об обременении'] = 'Не обнаружены';
    this['Сведения о недостоверности'] = 'Не обнаружены';
};

// ФУНКЦИИ ФОРМИРОВАНИЯ ЗАПИСИ
let detectPerson = (firstIndex, lastIndex, typeOfPerson, array) => {
    let curentFounderRecord = 0;
    switch (typeOfPerson) {
        case 'Физическое лицо':
            curentFounderRecord = new NaturalPersonRecord();
            break;
        case 'Юридическое лицо':
            curentFounderRecord = new LegalPersonRussianRecord();
            break;
        case 'Иностранное юридическое лицо':
            curentFounderRecord = new LegalPersonForeignRecord();
            break;
    }
    for (let i = firstIndex; i < lastIndex; i++) {
        let currentValue = 0;
        switch (true) {
            // Кейсы для участника (учредителя) - физического лица
            case typeOfPerson === 'Физическое лицо' && array[i].includes('Фамилия') && curentFounderRecord['ФИО'] === 'Не определены':
                currentValue = createValue(i, lastIndex, 'Фамилия', array[i], array, false);
                currentValue = correctionOfRegister(deleteExcessText(currentValue, 'Отчество'));
                curentFounderRecord['ФИО'] = currentValue;
                break;
            // Общие кейсы для участника (учредителя) - физического лица и юридического лица
            case (typeOfPerson === 'Физическое лицо' || typeOfPerson === 'Юридическое лицо') && array[i].includes('ИНН') && curentFounderRecord['ИНН'] === 'Не определен':
                currentValue = createValue(i, lastIndex, 'ИНН', array[i], array, false);
                curentFounderRecord['ИНН'] = currentValue;
                break;
            // Кейсы для участника (учредителя) - юридического лица
            case typeOfPerson === 'Юридическое лицо' && array[i].includes('ОГРН') && curentFounderRecord['ОГРН'] === 'Не определен':
                if (!regexpMainMap.regexpColonAndPoint.test(array[i])) {
                    currentValue = createValue(i, lastIndex, 'ОГРН', array[i], array, false);
                    curentFounderRecord['ОГРН'] = currentValue;
                }
                break;
            // Общие кейсы для участника (учредителя) - юридического лица и юридического лица (иностранного)
            case (typeOfPerson === 'Юридическое лицо' || typeOfPerson === 'Иностранное юридическое лицо') && array[i].includes('Полное наименование') && curentFounderRecord['Полное наименование'] === 'Не определено':
                currentValue = createValue(i, lastIndex, 'наименование', array[i], array, false);
                curentFounderRecord['Полное наименование'] = currentValue;
                break;
            // Кейсы для участника (учредителя) - юридического лица (иностранного)
            case typeOfPerson === 'Иностранное юридическое лицо' && array[i].includes('Страна происхождения') && curentFounderRecord['Страна происхождения'] === 'Не определена':
                currentValue = createValue(i, lastIndex, 'происхождения', array[i], array, false);
                curentFounderRecord['Страна происхождения'] = currentValue;
                break;
            case typeOfPerson === 'Иностранное юридическое лицо' && array[i].includes('Дата регистрации') && curentFounderRecord['Дата регистрации'] === 'Не определена':
                currentValue = createValue(i, lastIndex, 'регистрации', array[i], array, false);
                curentFounderRecord['Дата регистрации'] = currentValue;
                break;
            case typeOfPerson === 'Иностранное юридическое лицо' && array[i].includes('Регистрационный номер') && curentFounderRecord['Регистрационный номер'] === 'Не определен':
                currentValue = createValue(i, lastIndex, 'номер', array[i], array, false);
                curentFounderRecord['Регистрационный номер'] = currentValue;
                break;
            case typeOfPerson === 'Иностранное юридическое лицо' && array[i].includes('Наименование регистрирующего органа') && curentFounderRecord['Наименование регистрирующего органа'] === 'Не определено':
                currentValue = createValue(i, lastIndex, 'органа', array[i], array, false);
                curentFounderRecord['Наименование регистрирующего органа'] = currentValue;
                break;
            case typeOfPerson === 'Иностранное юридическое лицо' && array[i].includes('Адрес (место нахождения) в стране') && curentFounderRecord['Адрес (место нахождения) в стране происхождения'] === 'Не определен':
                let temporaryValue = array[i];
                let temporaryIndex = i;
                if (array[i + 1].includes('происхождения')) {
                    temporaryValue = `${temporaryValue} ${array[i + 1]} ${array[i + 2]}`;
                    temporaryIndex += 2;
                }
                currentValue = createValue(temporaryIndex, lastIndex, 'происхождения', temporaryValue, array, false);
                curentFounderRecord['Адрес (место нахождения) в стране происхождения'] = currentValue;
                break;
            // Общие кейсы
            case array[i].includes('Размер доли') && curentFounderRecord['Размер доли'] === 'Не определен':
                let temporaryValueShare = 'процентах';
                if (array[i].includes('дробях')) {
                    temporaryValueShare = 'дробях';
                }
                currentValue = createValue(i, lastIndex, temporaryValueShare, array[i], array, false);
                curentFounderRecord['Размер доли'] = currentValue;
                break;
            case array[i].includes('Номинальная стоимость') && curentFounderRecord['Номинальная стоимость доли'] === 'Не определена':
                currentValue = createValue(i, lastIndex, 'рублях', array[i], array, false);
                curentFounderRecord['Номинальная стоимость доли'] = currentValue;
                break;
            case array[i].includes('Сведения об обременении') && curentFounderRecord['Сведения об обременении'] === 'Не обнаружены':
                curentFounderRecord['Сведения об обременении'] = 'ОБНАРУЖЕНО ОБРЕМЕНЕНИЕ';
                break;
            case array[i].includes('сведения') && regexpMainMap.regexpFalseData.test(array[i]):
                currentValue = createValue(i, lastIndex, 'сведения', array[i], array, false);
                curentFounderRecord['Сведения о недостоверности'] = `ОБНАРУЖЕНА НЕДОСТОВЕРНОСТЬ: ${currentValue}`;
                currentValue = 0;
                break;
        }
    }
    return curentFounderRecord;
}


//
const findFounders = (array, indexes) => {
    // Определение начальных данных
    let finalFoundersArray = [];
    let firstIndex = indexes.founders.firstIndex;
    let lastIndex = indexes.founders.lastIndex;
    let isMoreThenOneFounder = false; // В ЮЛ больше одного участника
    switch (true) {
        case +array[firstIndex + 1] === 1:
            isMoreThenOneFounder = true;
            break;
        case regexpMainMap.regexpPage.test(firstIndex + 1):
            if (+array[firstIndex + 4] === 1) {
                isMoreThenOneFounder = true;
            }
            break;
    }
    if (firstIndex !== -1 && lastIndex !== -1) {
        let counterOfTheFounders = 1;
        let firstIndexCurrentFounder = firstIndex;
        if (isMoreThenOneFounder) {
            firstIndexCurrentFounder = firstIndex + 1;
        }
        let lastIndexCurrentFounder = 0;
        if (!isMoreThenOneFounder) {
            lastIndexCurrentFounder = lastIndex;
        }
        let isNaturalPerson = false;
        let isLegalPerson = false;
        let isLegalPersonForeign = false;
        for (let i = firstIndexCurrentFounder; i < lastIndex; i++) {
            switch (true) {
                case lastIndexCurrentFounder === 0 && i === lastIndex - 1 && isMoreThenOneFounder:
                    lastIndexCurrentFounder = i;
                    break;
                case +array[i] === counterOfTheFounders + 1 && isMoreThenOneFounder:
                    counterOfTheFounders++;
                    lastIndexCurrentFounder = i;
                    break;
                case !isLegalPerson && array[i].includes('Фамилия') && isMoreThenOneFounder:
                    isNaturalPerson = true;
                    break;
                case !isLegalPerson && array[i].includes('Фамилия') && !isMoreThenOneFounder && finalFoundersArray.length === 0:
                    isNaturalPerson = true;
                    break;
                case !isNaturalPerson && array[i].includes('Полное наименование') && isMoreThenOneFounder:
                    isLegalPerson = true;
                    break;
                case !isNaturalPerson && array[i].includes('Полное наименование') && !isMoreThenOneFounder && finalFoundersArray.length === 0:
                    isLegalPerson = true;
                    break;
                case array[i].includes('Страна происхождения') && isLegalPerson && isMoreThenOneFounder:
                    isLegalPerson = false;
                    isLegalPersonForeign = true;
                    break;
                case array[i].includes('Страна происхождения') && isLegalPerson && !isMoreThenOneFounder && finalFoundersArray.length === 0:
                    isLegalPerson = false;
                    isLegalPersonForeign = true;
                    break;
            }
            switch (true) {
                case lastIndexCurrentFounder !== 0 && isNaturalPerson:
                    finalFoundersArray.push(detectPerson(firstIndexCurrentFounder, lastIndexCurrentFounder, 'Физическое лицо', array));
                    firstIndexCurrentFounder = lastIndexCurrentFounder;
                    lastIndexCurrentFounder = 0;
                    isNaturalPerson = false;
                    break;
                case lastIndexCurrentFounder !== 0 && isLegalPerson:
                    finalFoundersArray.push(detectPerson(firstIndexCurrentFounder, lastIndexCurrentFounder, 'Юридическое лицо', array));
                    firstIndexCurrentFounder = lastIndexCurrentFounder;
                    lastIndexCurrentFounder = 0;
                    isLegalPerson = false;
                    break;
                case lastIndexCurrentFounder !== 0 && isLegalPersonForeign:
                    finalFoundersArray.push(detectPerson(firstIndexCurrentFounder, lastIndexCurrentFounder, 'Иностранное юридическое лицо', array));
                    firstIndexCurrentFounder = lastIndexCurrentFounder;
                    lastIndexCurrentFounder = 0;
                    isLegalPersonForeign = false;
                    break;
            }
        }
        return finalFoundersArray;
    } else {
        return 'Участники (учредители) не определены.';
    }
}


//
const findStockRegister = (array, indexes) => {
    let stockRegister = {
        'Полное наименование': 'Не определено',
        'ОГРН': 'Не определен',
        'ИНН': 'Не определен',
    };
    let firstIndex = indexes.stockRegister.firstIndex;
    let lastIndex = indexes.stockRegister.lastIndex;
    if (firstIndex !== -1 && lastIndex !== -1) {
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Полное наименование') && stockRegister['Полное наименование'] === 'Не определено':
                    currentValue = createValue(i, lastIndex, 'наименование', array[i], array, false);
                    stockRegister['Полное наименование'] = currentValue;
                    break;
                case array[i].includes('ОГРН') && stockRegister['ОГРН'] === 'Не определен':
                    if (!regexpMainMap.regexpColonAndPoint.test(array[i])) {
                        currentValue = createValue(i, lastIndex, 'ОГРН', array[i], array, false);
                        stockRegister['ОГРН'] = currentValue;
                    }
                    break;
                case array[i].includes('ИНН') && stockRegister['ИНН'] === 'Не определен':
                    currentValue = createValue(i, lastIndex, 'ИНН', array[i], array, false);
                    stockRegister['ИНН'] = currentValue;
                    break;
                case stockRegister['Полное наименование'] !== 'Не определено' && stockRegister['ОГРН'] !== 'Не определен' && stockRegister['ИНН'] !== 'Не определен':
                    i = lastIndex;
                    break;
            }
        }
        return stockRegister;
    } else {
        return 'Держатель реестра акционеров не определен.';
    }
}

const findLegalPersonShare = (array, indexes) => {
    if (indexes.legalPersonShare.firstIndex !== -1 && indexes.legalPersonShare.lastIndex !== -1) {
        let legalPersonShare = {
            'Размер доли': 'Не определен',
            'Номинальная стоимость доли': 'Не определена',
        }
        let firstIndex = indexes.legalPersonShare.firstIndex;
        let lastIndex = indexes.legalPersonShare.lastIndex;
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Размер доли') && legalPersonShare['Размер доли'] === 'Не определен':
                    let temporaryValueShare = 'процентах';
                    if (array[i].includes('дробях')) {
                        temporaryValueShare = 'дробях';
                    }
                    currentValue = createValue(i, lastIndex, temporaryValueShare, array[i], array, false);
                    legalPersonShare['Размер доли'] = currentValue;
                    break;
                case array[i].includes('Номинальная стоимость') && legalPersonShare['Номинальная стоимость доли'] === 'Не определена':
                    currentValue = createValue(i, lastIndex, 'рублях', array[i], array, false);
                    legalPersonShare['Номинальная стоимость доли'] = currentValue;
                    break;
                case legalPersonShare['Размер доли'] !== 'Не определен' && legalPersonShare['Номинальная стоимость'] !== 'Не определена':
                    i = lastIndex;
                    break;
            }
        }
        return legalPersonShare;
    } else {
        return 'Доля, принадлежащая обществу не определена.';
    }
}