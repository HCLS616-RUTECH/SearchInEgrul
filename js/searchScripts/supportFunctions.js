'use strict';

// Поиск всех индексов
const findAllIndexes = (array) => {
    let indexes = {
        name: {
            firstIndex: -1,
            lastIndex: -1,
        },
        registration: {
            firstIndex: -1,
            lastIndex: -1,
        },
        tax: {
            firstIndex: -1,
            lastIndex: -1,
        },
        address: {
            firstIndex: -1,
            lastIndex: -1,
        },
        statutCapital: {
            firstIndex: -1,
            lastIndex: -1,
        },
        director: {
            firstIndex: -1,
            lastIndex: -1,
        },
        founders: {
            firstIndex: -1,
            lastIndex: -1,
        },
        legalPersonShare: {
            firstIndex: -1,
            lastIndex: -1,
        },
        stockRegister: {
            firstIndex: -1,
            lastIndex: -1,
        },
        termination: {
            firstIndex: -1,
            lastIndex: -1,
        },
    };
    for (let i = 0; i < array.length; i++) {
        switch (true) {
            // Наименование (Firstindex)
            case indexes.name.firstIndex === -1 && array[i].includes('Наименование') && !array[i].includes('показателя') && !array[i].includes('полное'):
                indexes.name.firstIndex = i;
                break;
            // Наименование (Lastindex) // Адресс (Firstindex)
            case array[i].includes('Место нахождения и адрес юридического лица'):
                if (indexes.name.firstIndex !== -1 && indexes.name.lastIndex === -1) {
                    indexes.name.lastIndex = i;
                }
                if (indexes.address.firstIndex === -1) {
                    indexes.address.firstIndex = i;
                }
                break;
            // Адресс (Lastindex) // Регистрация (Firstindex) // Налоговый учет (Lastindex)
            case array[i].includes('Сведения о регистрации'):
                if (indexes.registration.firstIndex === -1) {
                    indexes.registration.firstIndex = i;
                }
                if (indexes.address.firstIndex !== -1 && indexes.address.lastIndex === -1) {
                    indexes.address.lastIndex = i;
                }
                if (indexes.tax.firstIndex !== -1 && indexes.tax.lastIndex === -1 && array[i].includes('Сведения о регистрации в качестве страхователя')) {
                    indexes.tax.lastIndex = i;
                }
                break;
            // Регистрация (Lastindex)
            case indexes.registration.firstIndex !== -1 && indexes.registration.lastIndex === -1 && array[i].includes('Сведения о регистрирующем органе по месту нахождения юридического лица'):
                indexes.registration.lastIndex = i;
                break;
            // Прекращение (Firstindex)
            case indexes.termination.firstIndex === -1 && (array[i].includes('Сведения о прекращении') || array[i].includes('Сведения о состоянии юридического')):
                indexes.termination.firstIndex = i;
                break;
            // Прекращение (Lastindex) // Директор (Firstindex)
            case array[i].includes('Сведения о лице, имеющем право без доверенности действовать'):
                if (indexes.termination.firstIndex !== -1 && indexes.termination.lastIndex === -1) {
                    indexes.termination.lastIndex = i;
                }
                if (indexes.director.firstIndex === -1) {
                    indexes.director.firstIndex = i;
                }
                break;
            // Директор (Lastindex) // Уставный капитал (Firstindex)
            case array[i].includes('Сведения об уставном капитале'):
                if (indexes.director.firstIndex !== -1 && indexes.director.lastIndex === -1) {
                    indexes.director.lastIndex = i;
                }
                if (indexes.statutCapital.firstIndex === -1) {
                    indexes.statutCapital.firstIndex = i;
                }
                break;
            // Директор (Lastindex) // Уставный капитал (Lastindex) // Участники/Учредители (Firstindex)
            case array[i].includes('Сведения об участниках'):
                if (indexes.director.firstIndex !== -1 && indexes.director.lastIndex === -1) {
                    indexes.director.lastIndex = i;
                }
                if (indexes.statutCapital.firstIndex !== -1 && indexes.statutCapital.lastIndex === -1) {
                    indexes.statutCapital.lastIndex = i;
                }
                if (indexes.founders.firstIndex === -1) {
                    indexes.founders.firstIndex = i;
                }
                break;
            // Доля принадлежащая обществу (Firstindex)
            case indexes.legalPersonShare.firstIndex === -1 && array[i].includes('Сведения о доле в уставном капитале общества с ограниченной ответственностью,'):
                indexes.legalPersonShare.firstIndex = i;
                break;
            // Директор (Lastindex) // Уставный капитал (Lastindex) // Держатель акций (Firstindex)
            case array[i].includes('Сведения о держателе реестра акционеров акционерного общества'):
                if (indexes.director.firstIndex !== -1 && indexes.director.lastIndex === -1) {
                    indexes.director.lastIndex = i;
                }
                if (indexes.statutCapital.firstIndex !== -1 && indexes.statutCapital.lastIndex === -1) {
                    indexes.statutCapital.lastIndex = i;
                }
                if (indexes.stockRegister.firstIndex === -1) {
                    indexes.stockRegister.firstIndex = i;
                }
                break;
            // Прекращение (Lastindex) // Директор (Lastindex) // Участники/Учредители (Lastindex) // Держатель акций (Lastindex) // Налоговый учет (Firstindex)
            case array[i].includes('Сведения об учете в налоговом органе'):
                if (indexes.termination.firstIndex !== -1 && indexes.termination.lastIndex === -1) {
                    indexes.termination.lastIndex = i;
                }
                if (indexes.director.firstIndex !== -1 && indexes.director.lastIndex === -1) {
                    indexes.director.lastIndex = i;
                }
                if (indexes.founders.firstIndex !== -1 && indexes.founders.lastIndex === -1) {
                    indexes.founders.lastIndex = i;
                }
                if (indexes.legalPersonShare.firstIndex !== -1 && indexes.legalPersonShare.lastIndex === -1) {
                    indexes.legalPersonShare.lastIndex = i;
                }
                if (indexes.stockRegister.firstIndex !== -1 && indexes.stockRegister.lastIndex === -1) {
                    indexes.stockRegister.lastIndex = i;
                }
                if (indexes.tax.firstIndex === -1) {
                    indexes.tax.firstIndex = i;
                }
                break;
            // Налоговый учет (Lastindex)
            case indexes.tax.firstIndex !== -1 && indexes.tax.lastIndex === -1 && array[i].includes('Сведения о видах экономической деятельности по Общероссийскому'):
                indexes.tax.lastIndex = i;
                break;
            // Налоговый учет (Lastindex)
            case indexes.tax.firstIndex !== -1 && indexes.tax.lastIndex === -1 && array[i].includes('Сведения о записях, внесенных в Единый государственный реестр юридических лиц'):
                indexes.tax.lastIndex = i;
                break;
        }
    }
    return indexes;
}

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
                    if (regexpMainMap.regexpDash.test(transitionalValue[i])) {
                        index = i;
                        i = transitionalValue.length;
                    }
                }
                break;
            case isRelevantValue && element === 'space':
                for (let i = 0; i < transitionalValue.length; i++) {
                    if (regexpMainMap.regexpSpace.test(transitionalValue[i])) {
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
            if ((index + 3 === array.length - 1) || regexpMainMap.regexpSpace.test(array[index + 4])) {
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
                        if (regexpMainMap.regexpDash.test(transitionalValue[i])) {
                            switch (true) {
                                case i === transitionalValue.length - 1:
                                    counter++;
                                    break;
                                case regexpMainMap.regexpDash.test(transitionalValue[i + 1]):
                                    elementsToDelete.unshift(i);
                                    counter++;
                                    break;
                                case !regexpMainMap.regexpDash.test(transitionalValue[i + 1]):
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
                        if (regexpMainMap.regexpSpace.test(transitionalValue[i])) {
                            switch (true) {
                                case i === 0 && !regexpMainMap.regexpSpace.test(transitionalValue[i + 1]):
                                    transitionalValue[i + 1] = transitionalValue[i + 1].toUpperCase();
                                    elementsToDelete.unshift(i);
                                    counter++;
                                    break;
                                case i > 0 && i <= 4 && !regexpMainMap.regexpSpace.test(transitionalValue[i + 1]) && regexpMainMap.regexpSpace.test(transitionalValue[i - 1]):
                                    if (currentRegexp.test(transitionalValue[i + 1])) {
                                        transitionalValue[i + 1] = corStandartFunctions.checkAzerbPatronymic(i + 1, transitionalValue);
                                    } else {
                                        transitionalValue[i + 1] = transitionalValue[i + 1].toUpperCase();
                                    }
                                    counter++;
                                    let isElementToDelete = true;
                                    for (j = i; j >= 0; j--) {
                                        if (!regexpMainMap.regexpSpace.test(transitionalValue[j])) {
                                            isElementToDelete = false;
                                        }
                                    }
                                    if (isElementToDelete) {
                                        elementsToDelete.unshift(i);
                                    }
                                    break;
                                case i === transitionalValue.length - 1 || regexpMainMap.regexpSpace.test(transitionalValue[i + 1]):
                                    elementsToDelete.unshift(i);
                                    counter++;
                                    break;
                                case i !== transitionalValue.length - 1 && i !== 0 && !regexpMainMap.regexpSpace.test(transitionalValue[i + 1]):
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
                        if (regexpMainMap.regexpDash.test(transitionalValue[i])) {
                            switch (true) {
                                case regexpMainMap.regexpSpace.test(transitionalValue[i + 1]):
                                    transitionalValue.splice(i + 1, 1);
                                    i--;
                                    break;
                                case !regexpMainMap.regexpSpace.test(transitionalValue[i + 1]) && noStartToEnd:
                                    needStartToEnd = true;
                                    noStartToEnd = false;
                                    i--;
                                    break;
                                case needStartToEnd && regexpMainMap.regexpSpace.test(transitionalValue[i - 1]):
                                    transitionalValue.splice(i - 1, 1);
                                    i -= 2;
                                    break;
                                case needStartToEnd && !regexpMainMap.regexpSpace.test(transitionalValue[i - 1]):
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
        let isHaveDash = regexpMainMap.regexpDash.test(finalElement);
        let isHaveSpace = regexpMainMap.regexpSpace.test(finalElement);
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
    let currentRegExp = new RegExp(`${keyWord}`, 'i');
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
        if (+stringKey === stringNumber + 1 || regexpMainMap.regexpPage.test(stringKey) || regexpMainMap.regexpExtract.test(stringKey)) {
            i = lastIndex;
        } else {
            elementArray.push(globalArray[i]);
        }
    }
    if (isAddress) {
        for (let i = elementArray.length; i >= 0; i--) {
            switch (true) {
                case regexpMainMap.regexpDash.test(elementArray[i]) && regexpMainMap.regexpSpace.test(elementArray[i]) && elementArray[i].length <= 3:
                    let currentCounter = 0;
                    for (let j = 0; j <= elementArray[i].length; j++) {
                        switch (true) {
                            case regexpMainMap.regexpDash.test(elementArray[i][j]):
                                currentCounter++;
                                break;
                            case regexpMainMap.regexpSpace.test(elementArray[i][j]):
                                currentCounter++;
                                break;
                        }
                    }
                    if (currentCounter === elementArray[i].length) {
                        elementArray.splice(i, 1);
                    }
                    break;
                case regexpMainMap.regexpDash.test(elementArray[i]) && elementArray[i].length === 1:
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
    let currentRegExp = new RegExp(`${keyWord}`, 'i');
    let elementArray = element.split(' ');
    let indexPositionKeyWord = elementArray.findIndex((element, index) => {
        if (currentRegExp.test(element)) {
            return index;
        }
    }) || 0;
    return elementArray.slice(indexPositionKeyWord + 1, elementArray.length).join(' ');
}