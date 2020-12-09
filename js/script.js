const localText = document.querySelector('#tXt');
const button = document.querySelector('#btn');

////////////////////////////////////////////////////// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
const regexpWithoutSpace = /\S/;
const regexpSpace = /\s/;
const regexpDash = /-|−|–|—/;
const regexpColonAndPoint = /:|\./gi;
const regexpPage = /cтраница|Страница|СТРАНИЦА/;
const regexpExtract = /выписка|Выписка|ВЫПИСКА/;
const regexpTime = /\d\d:\d\d:\d\d/;
const regexpDate = /\d\d\.\d\d\.\d\d/;
const regexpOGRN = /\d\d\d\d\d\d\d\d\d\d\d\d\d/;

////////////////////////////////////////////////////// ОБЩИЕ ФУНКЦИИ

// Дополнительные функции для корректировки регистра
const corStandartFunctions = {
    // Количество пробелов/дефисов в элементе/массиве
    countOfSpacesOrDashes: function (value, element) {
        let currentValue = 0;
        switch (true) {
            case typeof value === 'string' && element === 'space':
                currentValue = value.match(/\s/g) || [];
                return currentValue.length;
            case Array.isArray(value) && element === 'space':
                currentValue = value.join().match(/\s/g) || [];
                return currentValue.length;
            case typeof value === 'string' && element === 'dash':
                currentValue = value.match(/-|−|–|—/g) || [];
                return currentValue.length;
            case Array.isArray(value) && element === 'dash':
                currentValue = value.join().match(/-|−|–|—/g) || [];
                return currentValue.length;
            case !(typeof value === 'string') && !(Array.isArray(value)):
                return 0;
        }
    },
    // поиск первого индекса с пробелом или дефисом
    findIndex: function (value, element) {
        let transitionalValue = value;
        let index = -1;
        let isRelevantValue = false;
        switch (true) {
            case typeof value === 'string':
                transitionalValue = value.split('');
                isRelevantValue = true;
                break;
            case Array.isArray(value):
                isRelevantValue = true;
                break;
        }
        switch (true) {
            case isRelevantValue && element === 'dash':
                for (let i = 0; i < transitionalValue.length; i++) {
                    if (regexpDash.test(transitionalValue[i])) {
                        index = i;
                        i = transitionalValue.length;
                    }
                }
                break;
            case isRelevantValue && element === 'space':
                for (let i = 0; i < transitionalValue.length; i++) {
                    if (regexpSpace.test(transitionalValue[i])) {
                        index = i;
                        i = transitionalValue.length;
                    }
                }
                break;
        }
        return index;
    },
    // проверка на предмет азербайджанского отчества
    checkAzerbPatronymic: function (index, array) {
        if (array.length - index >= 4) {
            if ((index + 3 === array.length - 1) || regexpSpace.test(array[index + 4])) {
                let transitionalValue = array[index] + array[index + 1] + array[index + 2] + array[index + 3];
                if (transitionalValue === 'кызы' || transitionalValue === 'оглы' || transitionalValue === 'углы' || transitionalValue === 'гызы') {
                    return array[index];
                } else {
                    return array[index] = array[index].toUpperCase();
                }
            } else {
                return array[index] = array[index].toUpperCase();
            }
        } else {
            return array[index] = array[index].toUpperCase();
        }
    },
}

// Основные функции для корректировки регистра
const corGeneralFunctions = {
    // Функция для разбора значения только с пробелами или только с дефисами
    parseDashesAndSpaces: function (value, element, isJobTitle) {
        let currentRegexp = /к|о|у|г/;
        let transitionalValue = value;
        let isRelevantValue = false;
        switch (true) {
            case typeof value === 'string':
                transitionalValue = value.split('');
                isRelevantValue = true;
                break;
            case Array.isArray(value):
                isRelevantValue = true;
                break;
        }
        if (isRelevantValue) {
            let currentCount = 0;
            switch (true) {
                case element === 'dash':
                    currentCount = corStandartFunctions.countOfSpacesOrDashes(transitionalValue, 'dash');
                    break;
                case element === 'space':
                    currentCount = corStandartFunctions.countOfSpacesOrDashes(transitionalValue, 'space');
                    break;
            }
            let index = -1;
            let counter = 0;
            let elementsToDelete = [];
            //////////////////////////////////////////////////////////////////////////////////////////////
            switch (true) {
                case currentCount === 1 && element === 'dash' && !isJobTitle:
                    index = corStandartFunctions.findIndex(transitionalValue, 'dash');
                    if (index !== transitionalValue.length - 1) {
                        transitionalValue[index + 1] = transitionalValue[index + 1].toUpperCase();
                    }
                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////
                case currentCount > 1 && element === 'dash':
                    for (let i = 0; i < transitionalValue.length; i++) {
                        if (regexpDash.test(transitionalValue[i])) {
                            switch (true) {
                                case i === transitionalValue.length - 1:
                                    counter++;
                                    break;
                                case regexpDash.test(transitionalValue[i + 1]):
                                    elementsToDelete.unshift(i);
                                    counter++;
                                    break;
                                case !regexpDash.test(transitionalValue[i + 1]):
                                    if (!isJobTitle) {
                                        transitionalValue[i + 1] = transitionalValue[i + 1].toUpperCase();
                                    }
                                    counter++;
                                    break;
                            }
                        }
                        if (counter === currentCount) {
                            i = transitionalValue.length;
                        }
                    }
                    if (elementsToDelete.length > 0) {
                        for (let j = 0; j < elementsToDelete.length; j++) {
                            transitionalValue.splice(elementsToDelete[j], 1);
                        }
                    }
                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////
                case currentCount === 1 && element === 'space':
                    index = corStandartFunctions.findIndex(transitionalValue, 'space');
                    switch (true) {
                        case index === 0:
                            transitionalValue[index + 1] = transitionalValue[index + 1].toUpperCase();
                            transitionalValue.splice(index, 1);
                            break;
                        case index === transitionalValue.length - 1:
                            transitionalValue.splice(index, 1);
                            break;
                        case index !== 0 && index !== transitionalValue.length - 1:
                            if (!isJobTitle) {
                                if (currentRegexp.test(transitionalValue[index + 1])) {
                                    transitionalValue[index + 1] = corStandartFunctions.checkAzerbPatronymic(index + 1, transitionalValue);
                                } else {
                                    transitionalValue[index + 1] = transitionalValue[index + 1].toUpperCase();
                                }
                            }
                            break;
                    }
                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////
                case currentCount > 1 && element === 'space':
                    for (let i = 0; i < transitionalValue.length; i++) {
                        if (regexpSpace.test(transitionalValue[i])) {
                            switch (true) {
                                case i === 0 && !regexpSpace.test(transitionalValue[i + 1]):
                                    transitionalValue[i + 1] = transitionalValue[i + 1].toUpperCase();
                                    elementsToDelete.unshift(i);
                                    counter++;
                                    break;
                                case i > 0 && i <= 4 && !regexpSpace.test(transitionalValue[i + 1]) && regexpSpace.test(transitionalValue[i - 1]):
                                    if (currentRegexp.test(transitionalValue[i + 1])) {
                                        transitionalValue[i + 1] = corStandartFunctions.checkAzerbPatronymic(i + 1, transitionalValue);
                                    } else {
                                        transitionalValue[i + 1] = transitionalValue[i + 1].toUpperCase();
                                    }
                                    counter++;
                                    let isElementToDelete = true;
                                    for (j = i; j >= 0; j--) {
                                        if (!regexpSpace.test(transitionalValue[j])) {
                                            isElementToDelete = false;
                                        }
                                    }
                                    if (isElementToDelete) {
                                        elementsToDelete.unshift(i);
                                    }
                                    break;
                                case i === transitionalValue.length - 1 || regexpSpace.test(transitionalValue[i + 1]):
                                    elementsToDelete.unshift(i);
                                    counter++;
                                    break;
                                case i !== transitionalValue.length - 1 && i !== 0 && !regexpSpace.test(transitionalValue[i + 1]):
                                    if (!isJobTitle) {
                                        if (currentRegexp.test(transitionalValue[i + 1])) {
                                            transitionalValue[i + 1] = corStandartFunctions.checkAzerbPatronymic(i + 1, transitionalValue);
                                        } else {
                                            transitionalValue[i + 1] = transitionalValue[i + 1].toUpperCase();
                                        }
                                    }
                                    counter++;
                                    break;
                            }
                        }
                        if (counter === currentCount) {
                            i = transitionalValue.length;
                        }
                    }
                    if (elementsToDelete.length > 0) {
                        for (let j = 0; j < elementsToDelete.length; j++) {
                            transitionalValue.splice(elementsToDelete[j], 1);
                        }
                    }
                    break;
            }
            ///////////////////////////////////////////////////////////////////////////////////////////
            if (typeof value === 'string') {
                transitionalValue = transitionalValue.join('');
            }
            return transitionalValue;
        } else {
            return 0;
        }
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Функция для разбора значения и с пробелами и с дефисами
    parseDashesWithSpaces: function (value, isJobTitle) {
        let transitionalValue = value;
        let isRelevantValue = false;
        switch (true) {
            case typeof value === 'string':
                transitionalValue = value.split('');
                isRelevantValue = true;
                break;
            case Array.isArray(value):
                isRelevantValue = true;
                break;
        }
        if (isRelevantValue) {
            let countOfDashes = corStandartFunctions.countOfSpacesOrDashes(transitionalValue, 'dash');
            let countOfSpaces = corStandartFunctions.countOfSpacesOrDashes(transitionalValue, 'space');
            let indexOfDash = -1;
            let indexOfSpace = -1;
            let needStartToEnd = false;
            let noStartToEnd = true;
            switch (true) {
                case countOfDashes === 1 && countOfSpaces === 1:
                    indexOfDash = corStandartFunctions.findIndex(transitionalValue, 'dash');
                    indexOfSpace = corStandartFunctions.findIndex(transitionalValue, 'space');
                    switch (true) {
                        case indexOfSpace === transitionalValue.length - 1:
                            if (!isJobTitle) {
                                transitionalValue[indexOfDash + 1] = transitionalValue[indexOfDash + 1].toUpperCase();
                            }
                            transitionalValue.splice(indexOfSpace, 1);
                            break;
                        case indexOfSpace === 0:
                            transitionalValue[indexOfSpace + 1] = transitionalValue[indexOfSpace + 1].toUpperCase();
                            if (indexOfDash !== transitionalValue.length - 1 && !isJobTitle) {
                                transitionalValue[indexOfDash + 1] = transitionalValue[indexOfDash + 1].toUpperCase();
                            }
                            transitionalValue.splice(indexOfSpace, 1);
                            break;
                        case indexOfDash - indexOfSpace === -1:
                            if (!isJobTitle) {
                                transitionalValue[indexOfSpace + 1] = transitionalValue[indexOfSpace + 1].toUpperCase();
                            }
                            transitionalValue.splice(indexOfSpace, 1);
                            break;
                        case indexOfDash - indexOfSpace === 1:
                            if (indexOfDash !== transitionalValue.length - 1 && !isJobTitle) {
                                transitionalValue[indexOfDash + 1] = transitionalValue[indexOfDash + 1].toUpperCase();
                            }
                            transitionalValue.splice(indexOfSpace, 1);
                            break;
                        case indexOfSpace !== 0 && indexOfSpace !== transitionalValue.length - 1 && (indexOfDash - indexOfSpace !== -1) && (indexOfDash - indexOfSpace !== 1):
                            if (!isJobTitle) {
                                transitionalValue[indexOfSpace + 1] = transitionalValue[indexOfSpace + 1].toUpperCase();
                            }
                            if (indexOfDash !== transitionalValue.length - 1 && !isJobTitle) {
                                transitionalValue[indexOfDash + 1] = transitionalValue[indexOfDash + 1].toUpperCase();
                            }
                            break;
                    }
                    break;
                case countOfDashes > 1 || countOfSpaces > 1:
                    for (let i = 0; i < transitionalValue.length; i++) {
                        if (regexpDash.test(transitionalValue[i])) {
                            switch (true) {
                                case regexpSpace.test(transitionalValue[i + 1]):
                                    transitionalValue.splice(i + 1, 1);
                                    i--;
                                    break;
                                case !regexpSpace.test(transitionalValue[i + 1]) && noStartToEnd:
                                    needStartToEnd = true;
                                    noStartToEnd = false;
                                    i--;
                                    break;
                                case needStartToEnd && regexpSpace.test(transitionalValue[i - 1]):
                                    transitionalValue.splice(i - 1, 1);
                                    i -= 2;
                                    break;
                                case needStartToEnd && !regexpSpace.test(transitionalValue[i - 1]):
                                    needStartToEnd = false;
                                    noStartToEnd = true;
                                    break;
                            }
                        }
                    }
                    countOfSpaces = corStandartFunctions.countOfSpacesOrDashes(transitionalValue, 'space');
                    if (countOfSpaces > 0) {
                        transitionalValue = corGeneralFunctions.parseDashesAndSpaces(transitionalValue, 'space', isJobTitle);
                    }
                    transitionalValue = corGeneralFunctions.parseDashesAndSpaces(transitionalValue, 'dash', isJobTitle);
                    break;
            }
            if (typeof value === 'string') {
                transitionalValue = transitionalValue.join('');
            }
            return transitionalValue;
        } else {
            return 0;
        }
    },
}

// Функция исправления регистра в элементе
const correctionOfRegister = (element) => {
    let finalElement = element.toLowerCase();
    if (finalElement === 'кызы' || finalElement === 'оглы' || finalElement === 'углы' || finalElement === 'гызы') {
        return finalElement;
    } else {
        let currentRegexpAlternation = /директор|президент|правлени|губернатор|генерельн|врач|временно|исполняющ|обязанности|конкурсн|управляющ|начальник|инспекци|комитет|заместител|руководител|агентств|министр|ликвидатор|ликвидацион/;
        let isJobTitle = false;
        let finalElementArray = finalElement.split('');
        finalElementArray[0] = finalElementArray[0].toUpperCase();
        switch (true) {
            case finalElementArray[0] + finalElementArray[1] + finalElementArray[2] + finalElementArray[3] + finalElementArray[4] === "Врио ":
                finalElementArray[1] = finalElementArray[1].toUpperCase();
                finalElementArray[2] = finalElementArray[2].toUpperCase();
                finalElementArray[3] = finalElementArray[3].toUpperCase();
                isJobTitle = true;
                break;
            case finalElementArray[0] + finalElementArray[1] + finalElementArray[2] === "Ио ":
                finalElementArray[1] = finalElementArray[1].toUpperCase();
                isJobTitle = true;
                break;
            case currentRegexpAlternation.test(finalElement):
                isJobTitle = true;
                break;
        }
        let isHaveDash = regexpDash.test(finalElement);
        let isHaveSpace = regexpSpace.test(finalElement);
        switch (true) {
            case isHaveDash && !isHaveSpace:
                finalElementArray = corGeneralFunctions.parseDashesAndSpaces(finalElementArray, 'dash', isJobTitle);
                break;
            case !isHaveDash && isHaveSpace:
                finalElementArray = corGeneralFunctions.parseDashesAndSpaces(finalElementArray, 'space', isJobTitle);
                break;
            case isHaveDash && isHaveSpace:
                finalElementArray = corGeneralFunctions.parseDashesWithSpaces(finalElementArray, isJobTitle);
                break;
        }
        return finalElementArray.join('');
    }
}

// Функция для изъятия значений из элементов
const createValue = (currentIndex, lastIndex, keyWord, element, globalArray, isAddress) => {
    let value = 'Значение не определено';
    let currentRegExp = new RegExp(`${keyWord}`, 'gi');
    let elementArray = element.split(' ');
    let stringNumber = +elementArray[0];
    let indexPositionKeyWord = elementArray.findIndex((element, index) => {
        if (currentRegExp.test(element)) {
            return index;
        }
    }) || 0;
    let transitionalValue = elementArray.slice(indexPositionKeyWord + 1, elementArray.length).join(' ');
    elementArray = [transitionalValue];
    for (let i = currentIndex + 1; i < lastIndex; i++) {
        let stringKey = globalArray[i].split(' ')[0];
        if (+stringKey === stringNumber + 1 || regexpPage.test(stringKey) || regexpExtract.test(stringKey)) {
            i = lastIndex;
        } else {
            elementArray.push(globalArray[i]);
        }
    }
    if (isAddress) {
        for (let i = elementArray.length; i >= 0; i--) {
            switch (true) {
                case regexpDash.test(elementArray[i]) && regexpSpace.test(elementArray[i]) && elementArray[i].length <= 3:
                    let currentCounter = 0;
                    for (let j = 0; j <= elementArray[i].length; j++) {
                        switch (true) {
                            case regexpDash.test(elementArray[i][j]):
                                currentCounter++;
                                break;
                            case regexpSpace.test(elementArray[i][j]):
                                currentCounter++;
                                break;
                        }
                    }
                    if (currentCounter === elementArray[i].length) {
                        elementArray.splice(i, 1);
                    }
                    break;
                case regexpDash.test(elementArray[i]) && elementArray[i].length === 1:
                    elementArray.splice(i, 1);
                    break;
            }
        }
        value = elementArray.join(', ');
    } else {
        value = elementArray.join(' ');
    }
    return value;
}

// Функция для для удаления лишнего текста из готовых элементов
const deleteExcessText = (element, keyWord) => {
    let currentRegExp = new RegExp(`${keyWord}`, 'gi');
    let elementArray = element.split(' ');
    let indexPositionKeyWord = elementArray.findIndex((element, index) => {
        if (currentRegExp.test(element)) {
            return index;
        }
    }) || 0;
    return elementArray.slice(indexPositionKeyWord + 1, elementArray.length).join(' ');
}

const findTextValueHandler = (text) => {
    let valuesObject = {
        'недост': 0,
        'залог': 0,
        'обрем': 0,
        'огранич': 0,
        'запрещ': 0,
        'арест': 0,
        'ликвид': 0,
        'прекр': 0,
        'исключ': 0,
        'устав': 0,
        'банкр': 0,
        'доверит': 0,
    }
    let regExpFalseData = /недост|Недост|НЕДОСТ/gi;
    let regExpPledge = /залог|Залог|ЗАЛОГ/gi;
    let regExpEncumbrance = /обрем|Обрем|ОБРЕМ/gi;
    let regExpLimitation = /огранич|Огранич|ОГРАНИЧ/gi;
    let regExpProhibition = /запрещ|Запрещ|ЗАПРЕЩ/gi;
    let regExpArrest = /арест|Арест|АРЕСТ/gi;
    let regExpLiquidation = /ликвид|Ликвид|ЛИКВИД/gi;
    let refExpDelition = /исключ|Исключ|ИСКЛЮЧ/gi;
    let regExpTermination = /прекр|Прекр|ПРЕКР/gi;
    let regExpStatut = /устав|Устав|УСТАВ/gi;
    let regExpBankruptcy = /банкр|Банкр|БАНКР/gi;
    let regExpAttorneyManagment = /доверит|Доверит|ДОВЕРИТ/gi;

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

    valuesObject['недост'] = probableFalseData.length;
    valuesObject['залог'] = probablePledge.length;
    valuesObject['обрем'] = probableEncumbrance.length;
    valuesObject['огранич'] = probableLimitation.length;
    valuesObject['запрещ'] = probableProhibition.length;
    valuesObject['арест'] = probableArrest.length;
    valuesObject['ликвид'] = probableLiquidation.length;
    valuesObject['исключ'] = probableDelition.length;
    valuesObject['прекр'] = probableTermination.length;
    valuesObject['устав'] = probableStatut.length;
    valuesObject['банкр'] = probableBankruptcy.length;
    valuesObject['доверит'] = probableAttorneyManagment.length;

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
        return 'Введены некоректные данные.';
    }
}

const findDirector = (array) => {
    let firstIndex = array.findIndex((element, index) => {
        if (element.includes('Сведения о лице, имеющем право без доверенности действовать от имени')) {
            return index;
        }
    });
    if (firstIndex !== -1) {
        let typeOfChief = '';
        let lastIndex = -1;
        for (let i = firstIndex; i < array.length; i++) {
            switch (true) {
                case array[i].includes('Должность'):
                    typeOfChief = 'Единоличный исполнительный орган';
                    break;
                case array[i].includes('Полное наименование'):
                    typeOfChief = 'Управляющая компания';
                    break;
                // case array[i].includes('Полное наименование'):
                //     typeOfChief = 'Управляющий ИП';
                //     break;
            }
            switch (true) {
                case array[i].includes('Сведения об уставном капитале') || array[i].includes('Сведения об участниках') || array[i].includes('Сведения о держателе реестра акционеров акционерного общества') || array[i].includes('Сведения об учете в налоговом органе'):
                    lastIndex = i;
                    i = array.length;
                    break;
            }
        }
        if (lastIndex !== -1) {
            let director = {
                'Тип': 'Единоличный исполнительный орган',
                'Должность': 'Не определена',
                'ФИО': 'Не определены',
                'ИНН': 'Не определен',
            };
            let managingOrganization = {
                'Тип': 'Управляющая организация',
                'Полное наименование': 'Не определено',
                'ОГРН': 'Не определен',
                'ИНН': 'Не определен',
            };
            // let managingBusinessman = {

            // };
            let currentValue = 0;
            switch (typeOfChief) {
                case 'Единоличный исполнительный орган':
                    for (let i = firstIndex; i < lastIndex; i++) {
                        switch (true) {
                            case array[i].includes('Фамилия') && director['ФИО'] === 'Не определены':
                                currentValue = createValue(i, lastIndex, 'Фамилия', array[i], array, false);
                                currentValue = correctionOfRegister(deleteExcessText(currentValue, 'Отчество'));
                                director['ФИО'] = currentValue;
                                currentValue = 0;
                                break;
                            case array[i].includes('ИНН'):
                                currentValue = createValue(i, lastIndex, 'ИНН', array[i], array, false);
                                director['ИНН'] = currentValue;
                                currentValue = 0;
                                break;
                            case array[i].includes('Должность'):
                                currentValue = createValue(i, lastIndex, 'Должность', array[i], array, false);
                                currentValue = correctionOfRegister(currentValue);
                                director['Должность'] = currentValue;
                                currentValue = 0;
                                break;
                            case director['Должность'] !== 'Не определена' && director['ФИО'] !== 'Не определены' && director['ИНН'] !== 'Не определен':
                                i = lastIndex;
                                break;
                        }
                    }
                    return director;
                case 'Управляющая компания':
                    for (let i = firstIndex; i < lastIndex; i++) {
                        switch (true) {
                            case array[i].includes('Полное наименование'):
                                currentValue = createValue(i, lastIndex, 'наименование', array[i], array, false);
                                managingOrganization['Полное наименование'] = currentValue;
                                currentValue = 0;
                                break;
                            case array[i].includes('ОГРН'):
                                if (!regexpColonAndPoint.test(array[i])) {
                                    currentValue = createValue(i, lastIndex, 'ОГРН', array[i], array, false);
                                    managingOrganization['ОГРН'] = currentValue;
                                    currentValue = 0;
                                }
                                break;
                            case array[i].includes('ИНН'):
                                currentValue = createValue(i, lastIndex, 'ИНН', array[i], array, false);
                                managingOrganization['ИНН'] = currentValue;
                                currentValue = 0;
                                break;
                        }
                    }
                    return managingOrganization;
            }
        } else {
            return 'Руководитель, действующий от имени юридического лица без доверенности, не определен.'
        }
    } else {
        return 'Руководитель, действующий от имени юридического лица без доверенности, не определен.'
    }
}

const findStatut = (array) => {
    let reverseArray = array.slice().reverse();
    let finalStatutArray = [];
    let regexpStatut = /устав|Устав|УСТАВ/i;
    let regexpStatutChange = /изменени|Изменени|ИЗМЕНЕНИ/i;
    function StatutRecord() {
        this['Наименование документа'] = 'Не определено';
        this['ГРН документа'] = 'Не определен';
        this['Дата документа'] = 'Не определена';
        this['Регистрирующий орган'] = 'Не определен';
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ПОИСК ИНДЕКСОВ НУЖНЫХ ЭЛЕМЕНТОВ
    let indexStatutName = reverseArray.findIndex((element, index) => {
        if (element.includes('Наименование документа') && regexpStatut.test(element)) {
            return index;
        }
    });
    if (indexStatutName !== -1) {
        let indexStatutDateAndGRN = -1;
        for (let i = indexStatutName; i < reverseArray.length; i++) {
            if (reverseArray[i].includes('ГРН и дата')) {
                indexStatutDateAndGRN = i;
                i = reverseArray.length;
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // ФУНКЦИЯ ФОРМИРОВАНИЯ ЗАПИСИ ОБ УСТАВЕ
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
            ///////////////////////////////////////
            let registrationAuthorityArray = [];
            let isFindElement = false;
            for (let j = indexGRN - 1; j > 0; j--) {
                switch (true) {
                    case reverseArray[j].includes('Сведения о документах, представленных'):
                        isFindElement = false;
                        j = 0;
                        break;
                    case reverseArray[j].includes('Наименование регистрирующего органа'):
                        registrationAuthorityArray.push(reverseArray[j]);
                        isFindElement = true;
                        break;
                    case isFindElement:
                        if (!(regexpPage.test(reverseArray[j]) || regexpExtract.test(reverseArray[j]) || regexpTime.test(reverseArray[j]) || regexpOGRN.test(reverseArray[j]) || regexpDate.test(reverseArray[j]))) {
                            registrationAuthorityArray.push(reverseArray[j]);
                        }
                        break;
                }
            }
            statutRecord['Регистрирующий орган'] = registrationAuthorityArray.slice(2, registrationAuthorityArray.length).join(' ');

            return statutRecord;
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // ФОРМИРОВАНИЕ ЗАПИСИ(ЕЙ) ОБ УСТАВЕ
        if (indexStatutDateAndGRN !== -1) {
            if (reverseArray[indexStatutName].includes('Наименование документа') && regexpStatutChange.test(reverseArray[indexStatutName]) && regexpStatut.test(reverseArray[indexStatutName])) {
                finalStatutArray.push(makeStatutRecord(indexStatutName, indexStatutDateAndGRN));
                for (let i = indexStatutDateAndGRN + 1; i < reverseArray.length; i++) {
                    let currentIndexStatutName = 0;
                    let currentIndexStatutDateAndGRN = 0;
                    switch (true) {
                        case reverseArray[i].includes('Наименование документа') && regexpStatutChange.test(reverseArray[i]) && regexpStatut.test(reverseArray[i]):
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
                        case reverseArray[i].includes('Наименование документа') && regexpStatut.test(reverseArray[i]) && !regexpStatutChange.test(reverseArray[i]):
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
            return 'Сведения об уставе не обнаружены.'
        }
    } else {
        return 'Сведения об уставе не обнаружены.'
    }
}

const findAllChangeStatutRecordsHandler = (array) => {
    let currentRegexpAlternation = /КАПИТАЛ|ФОНД/i;
    let currentRegexpStatut = /устав|Устав|УСТАВ/i;
    let currentRegexpChange = /изменени|Изменени|ИЗМЕНЕНИ/i;
    let allChangeStatutRecords = [];
    for (let i = 0; i < array.length; i++) {
        if ((currentRegexpChange.test(array[i]) && currentRegexpStatut.test(array[i]) && !currentRegexpAlternation.test(array[i])) || (currentRegexpStatut.test(array[i]) && !currentRegexpAlternation.test(array[i]))) {
            if (isNaN(+array[i][0])) {
                let transitionalValue = `${array[i - 1]} ${array[i]}`
                allChangeStatutRecords.push(transitionalValue);
            } else {
                allChangeStatutRecords.push(array[i]);
            }
        }
    }
    return allChangeStatutRecords;
}

const findFounders = (array) => {
    // Определение начальных данных
    let finalFoundersArray = [];
    let firstIndex = array.findIndex((element, index) => {
        if (element.includes('Сведения об участниках') || element.includes('Сведения о держателе реестра акционеров акционерного общества')) {
            return index;
        }
    });
    if (firstIndex !== -1) {
        let lastIndex = -1;
        for (let i = firstIndex; i < array.length; i++) {
            switch (true) {
                case array[i].includes('Сведения об учете в налоговом органе') || (array[i].includes('Сведения о держателе реестра акционеров акционерного общества') && !array[firstIndex].includes('Сведения о держателе реестра акционеров акционерного общества')):
                    lastIndex = i;
                    i = array.length;
                    break;
            }
        }
        let isStockCompany = false; // Является ли ЮЛ акционерным обществом
        if (array[firstIndex].includes('Сведения о держателе реестра акционеров акционерного общества')) {
            isStockCompany = true;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        if (isStockCompany) {
            let stockRegister = {
                'Полное наименование': 'Не определено',
                'ОГРН': 'Не определен',
                'ИНН': 'Не определен',
            };
            for (let i = firstIndex; i < lastIndex; i++) {
                let currentValue = 0;
                switch (true) {
                    case array[i].includes('Полное наименование') && stockRegister['Полное наименование'] === 'Не определено':
                        currentValue = createValue(i, lastIndex, 'наименование', array[i], array, false);
                        stockRegister['Полное наименование'] = currentValue;

                        break;
                    case array[i].includes('ОГРН') && stockRegister['ОГРН'] === 'Не определен':
                        if (!regexpColonAndPoint.test(array[i])) {
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
            let isMoreThenOneFounder = false; // В ЮЛ больше одного участника
            switch (true) {
                case +array[firstIndex + 1] === 1:
                    isMoreThenOneFounder = true;
                    break;
                case regexpPage.test(firstIndex + 1):
                    if (+array[firstIndex + 4] === 1) {
                        isMoreThenOneFounder = true;
                    }
                    break;
            }
            if (+array[firstIndex + 1] === 1) {
                isMoreThenOneFounder = true;
            }
            // Конструкторы объектов записей
            function NaturalPersonRecord() {
                this['Участник (учредитель)'] = 'Физическое лицо';
                this['ФИО'] = 'Не определены';
                this['ИНН'] = 'Не определен';
                this['Размер доли'] = 'Не определен';
                this['Номинальная стоимость доли'] = 'Не определена';
                this['Сведения об обременении'] = 'Не обнаружены';
            };
            function LegalPersonRussianRecord() {
                this['Участник (учредитель)'] = 'Юридическое лицо';
                this['Полное наименование'] = 'Не определено';
                this['ОГРН'] = 'Не определен';
                this['ИНН'] = 'Не определен';
                this['Размер доли'] = 'Не определен';
                this['Номинальная стоимость доли'] = 'Не определена';
                this['Сведения об обременении'] = 'Не обнаружены';
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
            };

            // ФУНКЦИИ ФОРМИРОВАНИЯ ЗАПИСЕЙ

            // Функция для участника физического лица
            let detectNaturalPerson = (firstIndex, lastIndex) => {
                let naturalPersonRecord = new NaturalPersonRecord();
                for (let i = firstIndex; i < lastIndex; i++) {
                    let currentValue = 0;
                    switch (true) {
                        case array[i].includes('Фамилия') && naturalPersonRecord['ФИО'] === 'Не определены':
                            currentValue = createValue(i, lastIndex, 'Фамилия', array[i], array, false);
                            currentValue = correctionOfRegister(deleteExcessText(currentValue, 'Отчество'));
                            naturalPersonRecord['ФИО'] = currentValue;
                            break;
                        case array[i].includes('ИНН') && naturalPersonRecord['ИНН'] === 'Не определен':
                            currentValue = createValue(i, lastIndex, 'ИНН', array[i], array, false);
                            naturalPersonRecord['ИНН'] = currentValue;
                            break;
                        case array[i].includes('Размер доли') && naturalPersonRecord['Размер доли'] === 'Не определен':
                            let temporaryValueShare = 'процентах';
                            if (array[i].includes('дробях')) {
                                temporaryValueShare = 'дробях';
                            }
                            currentValue = createValue(i, lastIndex, temporaryValueShare, array[i], array, false);
                            naturalPersonRecord['Размер доли'] = currentValue;
                            break;
                        case array[i].includes('Номинальная стоимость') && naturalPersonRecord['Номинальная стоимость доли'] === 'Не определена':
                            currentValue = createValue(i, lastIndex, 'рублях', array[i], array, false);
                            naturalPersonRecord['Номинальная стоимость доли'] = currentValue;
                            break;
                        case array[i].includes('Сведения об обременении') && naturalPersonRecord['Сведения об обременении'] === 'Не обнаружены':
                            naturalPersonRecord['Сведения об обременении'] = 'ОБНАРУЖЕНО ОБРЕМЕНЕНИЕ';
                            break;
                    }
                }
                return naturalPersonRecord;
            }

            // Функция для участника юридического лица
            let detectLegalPersonRussian = (firstIndex, lastIndex) => {
                let legalPersonRussianRecord = new LegalPersonRussianRecord();
                for (let i = firstIndex; i < lastIndex; i++) {
                    let currentValue = 0;
                    switch (true) {
                        case array[i].includes('Полное наименование') && legalPersonRussianRecord['Полное наименование'] === 'Не определено':
                            currentValue = createValue(i, lastIndex, 'наименование', array[i], array, false);
                            legalPersonRussianRecord['Полное наименование'] = currentValue;
                            break;
                        case array[i].includes('ОГРН') && legalPersonRussianRecord['ОГРН'] === 'Не определен':
                            if (!regexpColonAndPoint.test(array[i])) {
                                currentValue = createValue(i, lastIndex, 'ОГРН', array[i], array, false);
                                legalPersonRussianRecord['ОГРН'] = currentValue;
                            }
                            break;
                        case array[i].includes('ИНН') && legalPersonRussianRecord['ИНН'] === 'Не определен':
                            currentValue = createValue(i, lastIndex, 'ИНН', array[i], array, false);
                            legalPersonRussianRecord['ИНН'] = currentValue;
                            break;
                        case array[i].includes('Размер доли') && legalPersonRussianRecord['Размер доли'] === 'Не определен':
                            let temporaryValueShare = 'процентах';
                            if (array[i].includes('дробях')) {
                                temporaryValueShare = 'дробях';
                            }
                            currentValue = createValue(i, lastIndex, temporaryValueShare, array[i], array, false);
                            legalPersonRussianRecord['Размер доли'] = currentValue;
                            break;
                        case array[i].includes('Номинальная стоимость') && legalPersonRussianRecord['Номинальная стоимость доли'] === 'Не определена':
                            currentValue = createValue(i, lastIndex, 'рублях', array[i], array, false);
                            legalPersonRussianRecord['Номинальная стоимость доли'] = currentValue;
                            break;
                        case array[i].includes('Сведения об обременении') && legalPersonRussianRecord['Сведения об обременении'] === 'Не обнаружены':
                            legalPersonRussianRecord['Сведения об обременении'] = 'ОБНАРУЖЕНО ОБРЕМЕНЕНИЕ';
                            break;
                    }
                }
                return legalPersonRussianRecord;
            }

            // Функция для участника иностранного юридического лица
            let detectLegalPersonForeign = (firstIndex, lastIndex) => {
                let legalPersonForeignRecord = new LegalPersonForeignRecord();
                for (let i = firstIndex; i < lastIndex; i++) {
                    let currentValue = 0;
                    switch (true) {
                        case array[i].includes('Полное наименование') && legalPersonForeignRecord['Полное наименование'] === 'Не определено':
                            currentValue = createValue(i, lastIndex, 'наименование', array[i], array, false);
                            legalPersonForeignRecord['Полное наименование'] = currentValue;
                            break;
                        case array[i].includes('Страна происхождения') && legalPersonForeignRecord['Страна происхождения'] === 'Не определена':
                            currentValue = createValue(i, lastIndex, 'происхождения', array[i], array, false);
                            legalPersonForeignRecord['Страна происхождения'] = currentValue;
                            break;
                        case array[i].includes('Дата регистрации') && legalPersonForeignRecord['Дата регистрации'] === 'Не определена':
                            currentValue = createValue(i, lastIndex, 'регистрации', array[i], array, false);
                            legalPersonForeignRecord['Дата регистрации'] = currentValue;
                            break;
                        case array[i].includes('Регистрационный номер') && legalPersonForeignRecord['Регистрационный номер'] === 'Не определен':
                            currentValue = createValue(i, lastIndex, 'номер', array[i], array, false);
                            legalPersonForeignRecord['Регистрационный номер'] = currentValue;
                            break;
                        case array[i].includes('Наименование регистрирующего органа') && legalPersonForeignRecord['Наименование регистрирующего органа'] === 'Не определено':
                            currentValue = createValue(i, lastIndex, 'органа', array[i], array, false);
                            legalPersonForeignRecord['Наименование регистрирующего органа'] = currentValue;
                            break;
                        case array[i].includes('Адрес (место нахождения) в стране') && legalPersonForeignRecord['Адрес (место нахождения) в стране происхождения'] === 'Не определен':
                            let temporaryValue = array[i];
                            let temporaryIndex = i;
                            if (array[i + 1].includes('происхождения')) {
                                temporaryValue = `${temporaryValue} ${array[i + 1]} ${array[i + 2]}`;
                                temporaryIndex += 2;
                            }
                            currentValue = createValue(temporaryIndex, lastIndex, 'происхождения', temporaryValue, array, false);
                            legalPersonForeignRecord['Адрес (место нахождения) в стране происхождения'] = currentValue;
                            break;
                        case array[i].includes('Размер доли') && legalPersonForeignRecord['Размер доли'] === 'Не определен':
                            let temporaryValueShare = 'процентах';
                            if (array[i].includes('дробях')) {
                                temporaryValueShare = 'дробях';
                            }
                            currentValue = createValue(i, lastIndex, temporaryValueShare, array[i], array, false);
                            legalPersonForeignRecord['Размер доли'] = currentValue;
                            break;
                        case array[i].includes('Номинальная стоимость') && legalPersonForeignRecord['Номинальная стоимость доли'] === 'Не определена':
                            currentValue = createValue(i, lastIndex, 'рублях', array[i], array, false);
                            legalPersonForeignRecord['Номинальная стоимость доли'] = currentValue;
                            break;
                        case array[i].includes('Сведения об обременении') && legalPersonForeignRecord['Сведения об обременении'] === 'Не обнаружены':
                            legalPersonForeignRecord['Сведения об обременении'] = 'ОБНАРУЖЕНО ОБРЕМЕНЕНИЕ';
                            break;
                    }
                }
                return legalPersonForeignRecord;
            }
            if (lastIndex !== -1) {
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
    } else {
        return 'Участники (учредители) не определены.';
    }
}

const makeAddress = (array) => {
    let address = '';
    let firstIndex = array.findIndex((element, index) => {
        if (element.includes('Место нахождения и адрес юридического лица')) {
            return index;
        }
    });
    if (firstIndex !== -1) {
        let lastIndex = -1;
        for (let i = firstIndex; i < array.length; i++) {
            switch (true) {
                case array[i].includes('Сведения о регистрации'):
                    lastIndex = i;
                    i = array.length;
                    break;
            }
        }
        if (lastIndex !== -1) {
            for (let i = firstIndex; i < lastIndex; i++) {
                let currentValue = 0;
                if (array[i].includes('Адрес юридического лица')) {
                    currentValue = createValue(i, lastIndex, 'лица', array[i], array, true);
                    address = currentValue;
                    i = lastIndex;
                }
            }
            return address;
        } else {
            return 'Адрес (место нахождения) не определен.'
        }
    } else {
        return 'Адрес (место нахождения) не определен.'
    }
}

const findBasicInformation = (array, step, object) => {
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
        let firstIndex = array.findIndex((element, index) => {
            switch (true) {
                case step === 1 && element.includes('Наименование') && !element.includes('показателя') && !element.includes('полное'):
                    return index;
                case step === 2 && element.includes('Сведения о регистрации'):
                    return index;
                case step === 3 && element.includes('Сведения об учете в налоговом органе'):
                    return index;
                case step === 4 && element.includes('Сведения об уставном капитале'):
                    return index;
            }
        });
        if (firstIndex !== -1) {
            let lastIndex = -1;
            for (let i = firstIndex; i < array.length; i++) {
                switch (true) {
                    case step === 1 && array[i].includes('Место нахождения и адрес юридического лица'):
                        lastIndex = i;
                        i = array.length;
                        break;
                    case step === 2 && array[i].includes('Сведения о регистрирующем органе по месту нахождения юридического лица'):
                        lastIndex = i;
                        i = array.length;
                        break;
                    case step === 3 && array[i].includes('Сведения о регистрации в качестве страхователя в территориальном органе'):
                        lastIndex = i;
                        i = array.length;
                        break;
                    case step === 4 && (array[i].includes('Сведения об участниках') || array[i].includes('Сведения о держателе реестра акционеров акционерного общества')):
                        lastIndex = i;
                        i = array.length;
                        break;
                }
            }
            if (lastIndex !== -1) {
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
                            if (!regexpColonAndPoint.test(array[i])) {
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
                return findBasicInformation(array, step + 1, basicInformation);
            } else {
                return findBasicInformation(array, step + 1, basicInformation);
            }
        } else {
            return findBasicInformation(array, step + 1, basicInformation);
        }
    }
}

const findTerminationRecord = (array) => {
    let firstIndex = array.findIndex((element, index) => {
        if (element.includes('Сведения о прекращении')) {
            return index;
        }
    });
    if (firstIndex !== -1) {
        let lastIndex = -1;
        for (let i = firstIndex; i < array.length; i++) {
            switch (true) {
                case array[i].includes('Сведения о лице, имеющем право без доверенности действовать') || array[i].includes('Сведения об учете в налоговом органе'):
                    lastIndex = i;
                    i = array.length;
                    break;
                case array[i].includes('о видах экономической деятельности'):
                    i = array.length;
                    break;
            }
        }
        if (lastIndex !== -1) {
            let terminationRecord = {
                'Способ прекращения': 'Не определен',
                'Дата прекращения': 'Не определена',
                'ГРН': 'Не определен',
            };
            for (let i = firstIndex; i < lastIndex; i++) {
                let currentValue = 0;
                switch (true) {
                    case array[i].includes('Способ прекращения'):
                        currentValue = createValue(i, lastIndex, 'прекращения', array[i], array, false);
                        terminationRecord['Способ прекращения'] = currentValue;
                        break;
                    case array[i].includes('Дата прекращения'):
                        currentValue = createValue(i, lastIndex, 'прекращения', array[i], array, false);
                        terminationRecord['Дата прекращения'] = currentValue;
                        break;
                    case array[i].includes('ГРН и дата внесения в ЕГРЮЛ'):
                        for (let j = i; j < lastIndex; j++) {
                            if (regexpOGRN.test(array[j])) {
                                terminationRecord['ГРН'] = array[j];
                            }
                        }
                        break;
                }
            }
            return terminationRecord;
        } else {
            return 'Сведения о прекращении деятельности юридического лица не обнаружены.'
        }
    } else {
        return 'Сведения о прекращении деятельности юридического лица не обнаружены.'
    }
}

const chechTextHandler = () => {
    let currentText = localText.value; // Входящий текст +++
    let newValuesObject = findTextValueHandler(currentText); // Объект с заданными совпадениями +++
    // Функция формирования списка с количеством совпадений
    let newTextArray = createArrayHandler(currentText); // Массив сформированный из текста (по переносу) +++
    let extract = makeExtract(newTextArray); // Текущая выписка +++
    let director = findDirector(newTextArray); // Руководитель +/---
    let statut = findStatut(newTextArray); // Актуальные записи об уставе +++
    let allStatutRecords = findAllChangeStatutRecordsHandler(newTextArray); // Общее количество записей об уставе +++
    let founders = findFounders(newTextArray); // Учредители (участники) +++
    let address = makeAddress(newTextArray); // Адресс ЮЛ +++
    let basicInformation = findBasicInformation(newTextArray, 1); // Основная информация о ЮЛ +++
    let terminationRecord = findTerminationRecord(newTextArray); // Запись о прекращении деятельности +++

    // console.log(newTextArray);
    console.log(newValuesObject);
    console.log(extract);
    console.log(director);
    console.log(allStatutRecords);
    console.log(statut);
    console.log(founders);
    console.log(address);
    console.log(basicInformation);
    console.log(terminationRecord);

    // console.log(correctionOfRegister(currentText));


}

button.addEventListener('click', chechTextHandler);