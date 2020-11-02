const localText = document.querySelector('#tXt');
const button = document.querySelector('#btn');

////////////////////////////////////////////////////// ОБЩИЕ ФУНКЦИИ

// Функция удаления пробелов из элемента
const deleteSpacesHandler = (element) => {
    let regexp = /\S/g;
    return element = element.match(regexp).join('');
}
// Функция исправления регистра в элементе
const correctionOfRegister = (element) => {
    let finalElement = element.toLowerCase();
    let regexpDash = /[-−–—]/g;
    if (finalElement === 'кызы' || finalElement === 'оглы') {
        return finalElement;
    } else {
        if (regexpDash.test(finalElement)) {
            let finalElementArray = finalElement.split('');
            for (let i = 0; i < finalElementArray.length; i++) {
                let isDash = regexpDash.test(finalElementArray[i]);
                switch (true) {
                    case i === 0 && !isDash:
                        finalElementArray[i] = finalElementArray[i].toUpperCase();
                        break;
                    case isDash:
                        if (finalElementArray[i + 1] === ' ' || finalElementArray[i + 1] === '\n' || finalElementArray[i + 1] === '\t') {
                            finalElementArray[i + 2] = finalElementArray[i + 2].toUpperCase();
                            finalElementArray.splice(i + 1, 1);
                        } else {
                            finalElementArray[i + 1] = finalElementArray[i + 1].toUpperCase();
                        }
                        if (finalElementArray[i - 1] === ' ' || finalElementArray[i - 1] === '\n' || finalElementArray[i - 1] === '\t') {
                            finalElementArray.splice(i - 1, 1);
                        }
                        i = finalElementArray.length;
                        break;
                }
            }
            return finalElementArray.join('');
        } else {
            let finalElementArray = finalElement.split('');
            finalElementArray[0] = finalElementArray[0].toUpperCase();
            let probableIndexPositionSpace = finalElementArray.findIndex((element, index) => {
                if (element.includes(' ')) {
                    return index;
                }
            });
            if (probableIndexPositionSpace !== -1) {
                let probableKyzyOrOgly = finalElementArray[probableIndexPositionSpace + 1] + finalElementArray[probableIndexPositionSpace + 2] + finalElementArray[probableIndexPositionSpace + 3] + finalElementArray[probableIndexPositionSpace + 4];
                if (probableKyzyOrOgly === 'кызы' || probableKyzyOrOgly === 'оглы' || probableKyzyOrOgly === 'дире') {
                    return finalElementArray.join('');
                } else {
                    finalElementArray[probableIndexPositionSpace + 1] = finalElementArray[probableIndexPositionSpace + 1].toUpperCase();
                }
            }
            return finalElementArray.join('');
        }
    }
}
// Функция определения номера в строке
const findStringNumber = (element) => {
    return +element.split(' ')[0];
}
// Функция для изъятия значений из элементов
const createValue = (currentIndex, lastIndex, keyWord, element, globalArray) => {
    let value = 'Значение не определено';
    let currentRegExp = new RegExp(`${keyWord}`, 'gi');
    let regExpPage = /Страница/gi;
    let regExpExtract = /выписка/gi;
    let elementArray = element.split(' ');
    let stringNumber = +elementArray[0];
    let indexPositionKeyWord = elementArray.findIndex((element, index) => {
        if (currentRegExp.test(element)) {
            return index;
        }
    }) || 0;
    elementArray = elementArray.slice(indexPositionKeyWord + 1, elementArray.length);
    for (let i = currentIndex + 1; i < lastIndex; i++) {
        let stringKey = globalArray[i].split(' ')[0];
        if (+stringKey === stringNumber + 1 || regExpPage.test(stringKey) || regExpExtract.test(stringKey)) {
            i = lastIndex;
        } else {
            elementArray = elementArray.concat(globalArray[i].split(' '));
        }
    }
    value = elementArray.join(' ');
    return value;
}

const findTextValueHandler = (text) => {
    let valuesObject = {
        'недостоверность': 0,
        'залог': 0,
        'обременение': 0,
        'ограничение': 0,
        'запрещение': 0,
        'арест': 0,
        'ликвидация': 0,
        'прекращение': 0,
        'исключение': 0,
        'устав': 0,
        'банкротство': 0,
        'доверительное управление': 0,
    }

    let regExpFalseData = /недост/gi;
    let regExpPledge = /залог/gi;
    let regExpEncumbrance = /обрем/gi;
    let regExpLimitation = /огран/gi;
    let regExpProhibition = /запре/gi;
    let regExpArrest = /арест/gi;
    let regExpLiquidation = /ликвид/gi;
    let refExpDelition = /исключ/gi;
    let regExpTermination = /прекр/gi;
    let regExpStatut = /устав/gi;
    let regExpBankruptcy = /банкр/gi;
    let regExpAttorneyManagment = /доверит/gi;

    let probableFalseData = text.match(regExpFalseData) || [];
    let probablePledge = text.match(regExpPledge) || [];
    let probableEncumbrance = text.match(regExpEncumbrance) || [];
    let probableLimitation = text.match(regExpLimitation) || [];
    let probableProhibition = text.match(regExpProhibition) || [];
    let probableArrest = text.match(regExpArrest) || [];
    let probableLiquidation = text.match(regExpLiquidation) || [];
    let probableDelition = text.match(refExpDelition) || [];
    let probableTermination = text.match(regExpTermination) || [];
    let probableStatut = text.match(regExpStatut) || [];
    let probableBankruptcy = text.match(regExpBankruptcy) || [];
    let probableAttorneyManagment = text.match(regExpAttorneyManagment) || [];

    valuesObject['недостоверность'] = probableFalseData.length;
    valuesObject['залог'] = probablePledge.length;
    valuesObject['обременение'] = probableEncumbrance.length;
    valuesObject['ограничение'] = probableLimitation.length;
    valuesObject['запрещение'] = probableProhibition.length;
    valuesObject['арест'] = probableArrest.length;
    valuesObject['ликвидация'] = probableLiquidation.length;
    valuesObject['исключение'] = probableDelition.length;
    valuesObject['прекращение'] = probableTermination.length;
    valuesObject['устав'] = probableStatut.length;
    valuesObject['банкротство'] = probableBankruptcy.length;
    valuesObject['доверительное управление'] = probableAttorneyManagment.length;

    return valuesObject;
}

const createArrayHandler = (text) => {
    let currentTextArray = text.split('\n');
    return currentTextArray;
}

const makeExtract = (array) => {
    let extractString = ``;
    if (array[0] === 'ВЫПИСКА' && array[1] === 'из Единого государственного реестра юридических лиц') {
        extractString = `Выписка ${array[1]} ${array[2]}${array[3]}`;
        return extractString;
    } else {
        return 'Введены неккоректные данные.';
    }
}

const findStatutCapital = (array) => {
    let stringStatutCapital = array.find((element) => {
        if (element.includes('Размер (в рублях)')) {
            return element;
        }
    }) || 0;
    if (stringStatutCapital !== 0) {
        let arrayStatutCapital = stringStatutCapital.split(' ');
        let statutCapital = arrayStatutCapital[arrayStatutCapital.length - 1];
        return statutCapital;
    } else {
        return 'Размер уставного капитала не определен.';
    }
}

const findDirector = (array) => {
    let firstIndex = array.findIndex((element, index) => {
        if (element.includes('лице, имеющем право без доверенности') || element.includes('Сведения об управляющей организации')) {
            return index;
        }
    }) || 0;
    let lastIndex = array.findIndex((element, index) => {
        if (element.includes('об учредителях (участниках)')) {
            return index;
        }
    }) || 0;
    if (firstIndex !== 0 && lastIndex !== 0 && array[firstIndex].includes('лице, имеющем право без доверенности')) {
        let director = {
            'Тип': 'Единоличный исполнительный орган',
            'Должность': 'Не определена',
            'Фамилия': 'Не определена',
            'Имя': 'Не определено',
            'Отчество': 'Не определено',
            'ИНН': 'Не определен',
        };
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Фамилия'):
                    currentValue = createValue(i, lastIndex, 'Фамилия', array[i], array);
                    currentValue = correctionOfRegister(currentValue);
                    director['Фамилия'] = currentValue;
                    break;
                case array[i].includes('Имя'):
                    currentValue = createValue(i, lastIndex, 'Имя', array[i], array);
                    currentValue = correctionOfRegister(currentValue);
                    director['Имя'] = currentValue;
                    break;
                case array[i].includes('Отчество'):
                    currentValue = createValue(i, lastIndex, 'Отчество', array[i], array);
                    currentValue = correctionOfRegister(currentValue);
                    director['Отчество'] = currentValue;
                    break;
                case array[i].includes('ИНН'):
                    currentValue = createValue(i, lastIndex, 'ИНН', array[i], array);
                    director['ИНН'] = currentValue;
                    break;
                case array[i].includes('Должность'):
                    currentValue = createValue(i, lastIndex, 'Должность', array[i], array);
                    currentValue = correctionOfRegister(currentValue);
                    director['Должность'] = currentValue;
                    break;
                case director['Должность'] !== 'Не определена' && director['Фамилия'] !== 'Не определена' && director['Имя'] !== 'Не определено' && director['Отчество'] !== 'Не определено' && director['ИНН'] !== 'Не определен':
                    i = lastIndex;
                    break;
            }
        }
        return director;
    } else if (firstIndex !== 0 && lastIndex !== 0 && array[firstIndex].includes('Сведения об управляющей организации')) {
        let managingOrganization = {
            'Тип': 'Управляющая организация',
            'Полное наименование': 'Не определено',
            'Полное наименование': 'Не определено',
            'ОГРН': 'Не определен',
            'ИНН': 'Не определен',
        };
        let currentRegExpAlternation = /:|\./gi;
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Полное наименование'):
                    currentValue = createValue(i, lastIndex, 'наименование', array[i], array);
                    managingOrganization['Полное наименование'] = currentValue;
                    break;
                case array[i].includes('ОГРН'):
                    if (!currentRegExpAlternation.test(array[i])) {
                        currentValue = createValue(i, lastIndex, 'ОГРН', array[i], array);
                        managingOrganization['ОГРН'] = currentValue;
                    }
                    break;
                case array[i].includes('ИНН'):
                    currentValue = createValue(i, lastIndex, 'ИНН', array[i], array);
                    managingOrganization['ИНН'] = currentValue;
                    break;
            }
        }
        return managingOrganization;
    } else {
        return 'Единоличный исполнительный орган не определен.'
    }
}

const findStatut = (array) => {
    let reverseArray = array.slice().reverse();
    let finalStatutArray = [];
    function StatutRecord() {
        this['Наименование документа'] = 'Не определено';
        this['ГРН документа'] = 'Не определен';
        this['Дата документа'] = 'Не определена';
    }

    let indexStatutName = reverseArray.findIndex((element, index) => {
        if (element.includes('Наименование документа') && element.includes('УСТАВ')) {
            return index;
        }
    }) || 0;

    let indexStatutDateAndGRN = 0;
    for (let i = indexStatutName; i < reverseArray.length; i++) {
        if (reverseArray[i].includes('ГРН и дата')) {
            indexStatutDateAndGRN = i;
            i = reverseArray.length;
        }
    }

    let makeStatutRecord = (indexName, indexGRN) => {
        let statutRecord = new StatutRecord();

        let statutNameArray = reverseArray[indexName].split(' ');
        let indexPositionStatutNameArray = statutNameArray.findIndex((element, index) => {
            if (element.includes('документа')) {
                return index;
            }
        });
        let statutName = statutNameArray.slice(indexPositionStatutNameArray + 1, statutNameArray.length).join(' ');
        statutRecord['Наименование документа'] = statutName;
        ///////////////////////////////////////
        let grnArray = reverseArray[indexGRN].split(' ');
        let indexPositionGRNArray = grnArray.findIndex((element, index) => {
            if (element.includes('ЕГРЮЛ')) {
                return index;
            }
        });
        let grn = grnArray.slice(indexPositionGRNArray + 1, grnArray.length).join(' ');
        statutRecord['ГРН документа'] = grn;
        ///////////////////////////////////////
        statutRecord['Дата документа'] = reverseArray[indexGRN - 1];

        return statutRecord;
    }

    if (indexStatutName !== 0 && indexStatutDateAndGRN !== 0) {
        if (reverseArray[indexStatutName].includes('Наименование документа') && reverseArray[indexStatutName].includes('ИЗМЕНЕНИ') && reverseArray[indexStatutName].includes('УСТАВ')) {
            finalStatutArray.push(makeStatutRecord(indexStatutName, indexStatutDateAndGRN));
            for (let i = indexStatutDateAndGRN + 1; i < reverseArray.length; i++) {
                let currentIndexStatutName = 0;
                let currentIndexStatutDateAndGRN = 0;
                switch (true) {
                    case reverseArray[i].includes('Наименование документа') && reverseArray[i].includes('ИЗМЕНЕНИ') && reverseArray[i].includes('УСТАВ'):
                        currentIndexStatutName = i;
                        for (let j = currentIndexStatutName; j < reverseArray.length; j++) {
                            if (reverseArray[j].includes('ГРН и дата')) {
                                currentIndexStatutDateAndGRN = j;
                                i = j + 1;
                                j = reverseArray.length;
                                finalStatutArray.push(makeStatutRecord(currentIndexStatutName, currentIndexStatutDateAndGRN));
                            }
                        }
                        break;
                    case reverseArray[i].includes('Наименование документа') && reverseArray[i].includes('УСТАВ') && !reverseArray[i].includes('ИЗМЕНЕНИ'):
                        currentIndexStatutName = i;
                        for (let j = currentIndexStatutName; j < reverseArray.length; j++) {
                            if (reverseArray[j].includes('ГРН и дата')) {
                                currentIndexStatutDateAndGRN = j;
                                j = reverseArray.length;
                                i = reverseArray.length;
                                finalStatutArray.push(makeStatutRecord(currentIndexStatutName, currentIndexStatutDateAndGRN));
                            }
                        }
                        break;
                }
            }
            return finalStatutArray;
        } else {
            finalStatutArray.push(makeStatutRecord(indexStatutName, indexStatutDateAndGRN));
            return finalStatutArray;
        }
    } else {
        return 'Последня версия устава не определена.'
    }

}

const findAllChangeStatutRecordsHandler = (array) => {
    let currentRegExpAlternation = /КАПИТАЛ|ФОНД/gi;
    let allChangeStatutRecords = array.filter((element) => {
        if ((element.includes('ИЗМЕНЕНИ') && element.includes('УСТАВ') && !currentRegExpAlternation.test(element)) || element.includes('УСТАВ') && !currentRegExpAlternation.test(element)) {
            return element;
        }
    });
    return allChangeStatutRecords;
}

const findFounders = (array) => {
    // Определение начальных данных
    let finalFoundersArray = [];
    let firstIndex = array.findIndex((element, index) => {
        if (element.includes('об учредителях (участниках)')) {
            return index;
        }
    }) || 0;
    let lastIndex = array.findIndex((element, index) => {
        if (element.includes('о держателе реестра акционеров') || element.includes('о видах экономической деятельности')) {
            return index;
        }
    }) || 0;
    let isStockCompany = false;
    if (array[firstIndex + 1].includes('В соответствии')) {
        isStockCompany = true;
    }
    let isMoreThenOneFounder = false;
    if (+array[firstIndex + 1] === 1) {
        isMoreThenOneFounder = true;
    }
    if (isStockCompany && +array[firstIndex + 6] === 1) {
        isMoreThenOneFounder = true;
    }
    // Конструкторы объектов записей
    function NaturalPersonRecord() {
        this['Участник (учредитель)'] = 'Физическое лицо';
        this['Фамилия'] = 'Не определена';
        this['Имя'] = 'Не определено';
        this['Отчество'] = 'Не определено';
        this['ИНН'] = 'Не определен';
        this['Размер доли'] = 'Не определен';
        this['Номинальная стоимость доли'] = 'Не определена';
        this['Вид обременения'] = 'Не определен';
    };
    function LegalPersonRussianRecord() {
        this['Участник (учредитель)'] = 'Юридическое лицо';
        this['Полное наименование'] = 'Не определено';
        this['ОГРН'] = 'Не определен';
        this['ИНН'] = 'Не определен';
        this['Размер доли'] = 'Не определен';
        this['Номинальная стоимость доли'] = 'Не определена';
        this['Вид обременения'] = 'Не определен';
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
        this['Вид обременения'] = 'Не определен';
    };
    // Функции формирования записей
    let detectNaturalPerson = (firstIndex, lastIndex) => {
        let naturalPersonRecord = new NaturalPersonRecord();
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Фамилия') && naturalPersonRecord['Фамилия'] === 'Не определена':
                    currentValue = createValue(i, lastIndex, 'Фамилия', array[i], array);
                    currentValue = correctionOfRegister(currentValue);
                    naturalPersonRecord['Фамилия'] = currentValue;
                    break;
                case array[i].includes('Имя') && naturalPersonRecord['Имя'] === 'Не определено':
                    currentValue = createValue(i, lastIndex, 'Имя', array[i], array);
                    currentValue = correctionOfRegister(currentValue);
                    naturalPersonRecord['Имя'] = currentValue;
                    break;
                case array[i].includes('Отчество') && naturalPersonRecord['Отчество'] === 'Не определено':
                    currentValue = createValue(i, lastIndex, 'Отчество', array[i], array);
                    currentValue = correctionOfRegister(currentValue);
                    naturalPersonRecord['Отчество'] = currentValue;
                    break;
                case array[i].includes('ИНН') && naturalPersonRecord['ИНН'] === 'Не определен':
                    currentValue = createValue(i, lastIndex, 'ИНН', array[i], array);
                    naturalPersonRecord['ИНН'] = currentValue;
                    break;
                case array[i].includes('Размер доли') && naturalPersonRecord['Размер доли'] === 'Не определен':
                    let temporaryValueShare = 'процентах';
                    if (array[i].includes('дроби')) {
                        temporaryValueShare = 'дроби';
                    }
                    currentValue = createValue(i, lastIndex, temporaryValueShare, array[i], array);
                    naturalPersonRecord['Размер доли'] = currentValue;
                    break;
                case array[i].includes('Номинальная стоимость') && naturalPersonRecord['Номинальная стоимость доли'] === 'Не определена':
                    currentValue = createValue(i, lastIndex, 'рублях', array[i], array);
                    naturalPersonRecord['Номинальная стоимость доли'] = currentValue;
                    break;
                case array[i].includes('Вид обременения') && naturalPersonRecord['Вид обременения'] === 'Не определен':
                    currentValue = createValue(i, lastIndex, 'обременени', array[i], array);
                    naturalPersonRecord['Вид обременения'] = currentValue;
                    break;
            }
        }
        return naturalPersonRecord;
    }
    let detectLegalPersonRussian = (firstIndex, lastIndex) => {
        let legalPersonRussianRecord = new LegalPersonRussianRecord();
        let currentRegExpAlternation = /:|\./gi;
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Полное наименование') && legalPersonRussianRecord['Полное наименование'] === 'Не определено':
                    currentValue = createValue(i, lastIndex, 'наименование', array[i], array);
                    legalPersonRussianRecord['Полное наименование'] = currentValue;
                    break;
                case array[i].includes('ОГРН') && legalPersonRussianRecord['ОГРН'] === 'Не определен':
                    if (!currentRegExpAlternation.test(array[i])) {
                        currentValue = createValue(i, lastIndex, 'ОГРН', array[i], array);
                        legalPersonRussianRecord['ОГРН'] = currentValue;
                    }
                    break;
                case array[i].includes('ИНН') && legalPersonRussianRecord['ИНН'] === 'Не определен':
                    currentValue = createValue(i, lastIndex, 'ИНН', array[i], array);
                    legalPersonRussianRecord['ИНН'] = currentValue;
                    break;
                case array[i].includes('Размер доли') && legalPersonRussianRecord['Размер доли'] === 'Не определен':
                    let temporaryValueShare = 'процентах';
                    if (array[i].includes('дроби')) {
                        temporaryValueShare = 'дроби';
                    }
                    currentValue = createValue(i, lastIndex, temporaryValueShare, array[i], array);
                    legalPersonRussianRecord['Размер доли'] = currentValue;
                    break;
                case array[i].includes('Номинальная стоимость') && legalPersonRussianRecord['Номинальная стоимость доли'] === 'Не определена':
                    currentValue = createValue(i, lastIndex, 'рублях', array[i], array);
                    legalPersonRussianRecord['Номинальная стоимость доли'] = currentValue;
                    break;
                case array[i].includes('Вид обременения') && legalPersonRussianRecord['Вид обременения'] === 'Не определен':
                    currentValue = createValue(i, lastIndex, 'обременени', array[i], array);
                    legalPersonRussianRecord['Вид обременения'] = currentValue;
                    break;
            }
        }
        return legalPersonRussianRecord;
    }
    let detectLegalPersonForeign = (firstIndex, lastIndex) => {
        let legalPersonForeignRecord = new LegalPersonForeignRecord();
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Полное наименование') && legalPersonForeignRecord['Полное наименование'] === 'Не определено':
                    currentValue = createValue(i, lastIndex, 'наименование', array[i], array);
                    legalPersonForeignRecord['Полное наименование'] = currentValue;
                    break;
                case array[i].includes('Страна происхождения') && legalPersonForeignRecord['Страна происхождения'] === 'Не определена':
                    currentValue = createValue(i, lastIndex, 'происхождения', array[i], array);
                    legalPersonForeignRecord['Страна происхождения'] = currentValue;
                    break;
                case array[i].includes('Дата регистрации') && legalPersonForeignRecord['Дата регистрации'] === 'Не определена':
                    currentValue = createValue(i, lastIndex, 'регистрации', array[i], array);
                    legalPersonForeignRecord['Дата регистрации'] = currentValue;
                    break;
                case array[i].includes('Регистрационный номер') && legalPersonForeignRecord['Регистрационный номер'] === 'Не определен':
                    currentValue = createValue(i, lastIndex, 'номер', array[i], array);
                    legalPersonForeignRecord['Регистрационный номер'] = currentValue;
                    break;
                case array[i].includes('Наименование регистрирующего органа') && legalPersonForeignRecord['Наименование регистрирующего органа'] === 'Не определено':
                    currentValue = createValue(i, lastIndex, 'органа', array[i], array);
                    legalPersonForeignRecord['Наименование регистрирующего органа'] = currentValue;
                    break;
                case array[i].includes('Адрес (место нахождения) в стране') && legalPersonForeignRecord['Адрес (место нахождения) в стране происхождения'] === 'Не определен':
                    let temporaryValue = array[i];
                    let temporaryIndex = i;
                    if (array[i + 1].includes('происхождения')) {
                        temporaryValue = `${temporaryValue} ${array[i + 1]} ${array[i + 2]}`;
                        temporaryIndex += 2;
                    }
                    currentValue = createValue(temporaryIndex, lastIndex, 'происхождения', temporaryValue, array);
                    legalPersonForeignRecord['Адрес (место нахождения) в стране происхождения'] = currentValue;
                    break;
                case array[i].includes('Размер доли') && legalPersonForeignRecord['Размер доли'] === 'Не определен':
                    let temporaryValueShare = 'процентах';
                    if (array[i].includes('дроби')) {
                        temporaryValueShare = 'дроби';
                    }
                    currentValue = createValue(i, lastIndex, temporaryValueShare, array[i], array);
                    legalPersonForeignRecord['Размер доли'] = currentValue;
                    break;
                case array[i].includes('Номинальная стоимость') && legalPersonForeignRecord['Номинальная стоимость доли'] === 'Не определена':
                    currentValue = createValue(i, lastIndex, 'рублях', array[i], array);
                    legalPersonForeignRecord['Номинальная стоимость доли'] = currentValue;
                    break;
                case array[i].includes('Вид обременения') && legalPersonForeignRecord['Вид обременения'] === 'Не определен':
                    currentValue = createValue(i, lastIndex, 'обременени', array[i], array);
                    legalPersonForeignRecord['Вид обременения'] = currentValue;
                    break;
            }
        }
        return legalPersonForeignRecord;
    }
    if (firstIndex !== 0 && lastIndex !== 0 && !isMoreThenOneFounder) {
        let isNaturalPerson = false;
        let isLegalPerson = false;
        let isLegalPersonForeign = false;
        for (let i = firstIndex; i < lastIndex; i++) {
            switch (true) {
                case !isLegalPerson && array[i].includes('Фамилия'):
                    isNaturalPerson = true;
                    break;
                case !isNaturalPerson && array[i].includes('Полное наименование'):
                    isLegalPerson = true;
                    break;
                case array[i].includes('Страна происхождения') && isLegalPerson:
                    isLegalPerson = false;
                    isLegalPersonForeign = true;
                    break;
            }
            switch (true) {
                case isNaturalPerson && !isLegalPerson && !isLegalPersonForeign:
                    finalFoundersArray.push(detectNaturalPerson(firstIndex, lastIndex));
                    i = lastIndex;
                    break;
                case isLegalPerson && !isLegalPersonForeign && i === lastIndex - 1:
                    finalFoundersArray.push(detectLegalPersonRussian(firstIndex, lastIndex));
                    i = lastIndex;
                    break;
                case !isLegalPerson && isLegalPersonForeign && i === lastIndex - 1:
                    finalFoundersArray.push(legalPersonForeignRecord(firstIndex, lastIndex));
                    i = lastIndex;
                    break;
            }
        }
        return finalFoundersArray;
    } else if (firstIndex !== 0 && lastIndex !== 0 && isMoreThenOneFounder) {
        let counterOfTheFounders = 1;
        let firstIndexCurrentFounder = firstIndex + 1;
        if (isStockCompany) {
            firstIndexCurrentFounder = firstIndex + 6;
        }
        let lastIndexCurrentFounder = 0;
        let isNaturalPerson = false;
        let isLegalPerson = false;
        let isLegalPersonForeign = false;
        for (let i = firstIndexCurrentFounder; i < lastIndex; i++) {
            switch (true) {
                case lastIndexCurrentFounder === 0 && i === lastIndex - 1:
                    lastIndexCurrentFounder = i;
                    break;
                case +array[i] === counterOfTheFounders + 1:
                    counterOfTheFounders++;
                    lastIndexCurrentFounder = i;
                    break;
                case !isLegalPerson && array[i].includes('Фамилия'):
                    isNaturalPerson = true;
                    break;
                case !isNaturalPerson && array[i].includes('Полное наименование'):
                    isLegalPerson = true;
                    break;
                case array[i].includes('Страна происхождения') && isLegalPerson:
                    isLegalPerson = false;
                    isLegalPersonForeign = true;
                    break;
            }
            switch (true) {
                case lastIndexCurrentFounder !== 0 && isNaturalPerson:
                    finalFoundersArray.push(detectNaturalPerson(firstIndexCurrentFounder, lastIndexCurrentFounder));
                    firstIndexCurrentFounder = lastIndexCurrentFounder;
                    lastIndexCurrentFounder = 0;
                    isNaturalPerson = false;
                    break;
                case lastIndexCurrentFounder !== 0 && isLegalPerson:
                    finalFoundersArray.push(detectLegalPersonRussian(firstIndexCurrentFounder, lastIndexCurrentFounder));
                    firstIndexCurrentFounder = lastIndexCurrentFounder;
                    lastIndexCurrentFounder = 0;
                    isLegalPerson = false;
                    break;
                case lastIndexCurrentFounder !== 0 && isLegalPersonForeign:
                    finalFoundersArray.push(detectLegalPersonForeign(firstIndexCurrentFounder, lastIndexCurrentFounder));
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

const makeAdress = (array) => {
    let adressArray = [];
    let firstIndex = array.findIndex((element, index) => {
        if (element.includes('Адрес (место нахождения)')) {
            return index;
        }
    }) || 0;
    let lastIndex = array.findIndex((element, index) => {
        if (element.includes('Сведения о регистрации')) {
            return index;
        }
    }) || 0;
    if (firstIndex !== 0 && lastIndex !== 0) {
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Почтовый индекс'):
                    currentValue = createValue(i, lastIndex, 'индекс', array[i], array);
                    adressArray.push(currentValue);
                    break;
                case array[i].includes('Субъект Российской Федерации'):
                    currentValue = createValue(i, lastIndex, 'Федерации', array[i], array);
                    adressArray.push(currentValue);
                    break;
                case array[i].includes('т.п.'):
                    currentValue = createValue(i, lastIndex, 'т.п.', array[i], array);
                    adressArray.push(currentValue);
                    break;
                case array[i].includes('т.д.'):
                    currentValue = createValue(i, lastIndex, 'т.д.', array[i], array);
                    adressArray.push(currentValue);
                    break;
            }
        }
        let adress = adressArray.join(', ');
        return adress;
    } else {
        return 'Адрес (место нахождения) не определен.'
    }
}

const findBasicInformation = (array) => {
    let basicInformation = {
        'Полное наименование': 'Не определено',
        'Сокращенное наименование': 'Не определено',
        'ОГРН': 'Не определен',
        'ИНН': 'Не определен',
        'КПП': 'Не определен',
    };
    let currentRegExpAlternation = /:|\./gi;
    let firstIndex = array.findIndex((element, index) => {
        if (element.includes('Наименование') && !element.includes('показателя') && !element.includes('полное')) {
            return index;
        }
    }) || 0;
    let lastIndex = array.findIndex((element, index) => {
        if (element.includes('о регистрации в качестве страхователя в территориальном')) {
            return index;
        }
    }) || 0;
    if (firstIndex !== 0 && lastIndex !== 0) {
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case array[i].includes('Полное наименование') && basicInformation['Полное наименование'] === 'Не определено':
                    currentValue = createValue(i, lastIndex, 'наименование', array[i], array);
                    basicInformation['Полное наименование'] = currentValue;
                    break;
                case array[i].includes('Сокращенное наименование'):
                    currentValue = createValue(i, lastIndex, 'наименование', array[i], array);
                    basicInformation['Сокращенное наименование'] = currentValue;
                    break;
                case array[i].includes('ОГРН') && basicInformation['ОГРН'] === 'Не определен':
                    if (!currentRegExpAlternation.test(array[i])) {
                        currentValue = createValue(i, lastIndex, 'ОГРН', array[i], array);
                        basicInformation['ОГРН'] = currentValue;
                    }
                    break;
                case array[i].includes('ИНН') && basicInformation['ИНН'] === 'Не определен':
                    currentValue = createValue(i, lastIndex, 'ИНН', array[i], array);
                    basicInformation['ИНН'] = currentValue;
                    break;
                case array[i].includes('КПП'):
                    currentValue = createValue(i, lastIndex, 'КПП', array[i], array);
                    basicInformation['КПП'] = currentValue;
                    break;
                case basicInformation['Полное наименование'] !== 'Не определено' && basicInformation['Сокращенное наименование'] !== 'Не определено' && basicInformation['ОГРН'] !== 'Не определен' && basicInformation['ИНН'] !== 'Не определен' && basicInformation['КПП'] !== 'Не определен':
                    i = lastIndex;
                    break;
            }
        }
        return basicInformation;
    } else {
        return 'Основная информация о юридическом лице не определена.'
    }
}

const chechTextHandler = () => {
    let currentText = localText.value; // Входящий текст
    let newValuesObject = findTextValueHandler(currentText); // Объект с заданными совпадениями
    // Функция формирования списка с количеством совпадений
    let newTextArray = createArrayHandler(currentText); // Массив сформированный из текста (по переносу)
    let extract = makeExtract(newTextArray); // Текущая выписка
    let statutCapital = findStatutCapital(newTextArray); // Размер уставного капитала
    let director = findDirector(newTextArray); // Руководитель
    let statut = findStatut(newTextArray); // Актуальные записи об уставе
    let allStatutRecords = findAllChangeStatutRecordsHandler(newTextArray); // Общее количество записей об уставе
    let founders = findFounders(newTextArray);
    let adress = makeAdress(newTextArray);
    let basicInformation = findBasicInformation(newTextArray);

    // console.log(newTextArray);
    console.log(newValuesObject);
    console.log(extract);
    console.log(statutCapital);
    console.log(director);
    console.log(allStatutRecords);
    console.log(statut);
    console.log(founders);
    console.log(adress);
    console.log(basicInformation);




}

button.addEventListener('click', chechTextHandler);