'use strict';

// Функция поиска по слову
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

    let probableFalseData = text.match(regexpSupportMap.regExpFalseData) || [];
    let probablePledge = text.match(regexpSupportMap.regExpPledge) || [];
    let probableEncumbrance = text.match(regexpSupportMap.regExpEncumbrance) || [];
    let probableLimitation = text.match(regexpSupportMap.regExpLimitation) || [];
    let probableProhibition = text.match(regexpSupportMap.regExpProhibition) || [];
    let probableArrest = text.match(regexpSupportMap.regExpArrest) || [];
    let probableLiquidation = text.match(regexpSupportMap.regExpLiquidation) || [];
    let probableDelition = text.match(regexpSupportMap.refExpDelition) || [];
    let probableTermination = text.match(regexpSupportMap.regExpTermination) || [];
    let probableStatut = text.match(regexpSupportMap.regExpStatut) || [];
    let probableBankruptcy = text.match(regexpSupportMap.regExpBankruptcy) || [];
    let probableAttorneyManagment = text.match(regexpSupportMap.regExpAttorneyManagment) || [];

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

// Функции формирования массивов из строк с найденными словами
// Функция формирования строки
const makeCoincidenceValue = (index, array) => {
    let currentValue = [];
    switch (true) {
        case index < 20:
            let element = `${array[index]} (значение взято с первой страницы выписки)`;
            currentValue.push(element);
            break;
        case index >= 20:
            for (let i = index; i >= 0; i--) {
                if (isNaN(+array[i][0])) {
                    currentValue.unshift(array[i]);
                } else {
                    currentValue.unshift(array[i]);
                    i = 0;
                }
            }
            for (let j = index + 1; j < array.length; j++) {
                if (isNaN(+array[j][0])) {
                    currentValue.push(array[j]);
                } else {
                    j = array.length;
                }
            }
            break;
    }
    return currentValue.join(' ');
}
// Функция поиска совпадений
const makeCoincidenceLists = (valuesObject, array) => {
    let finalObject = {
    };
    let coincidences = [];
    for (let key in valuesObject) {
        if (valuesObject[key] > 0) {
            finalObject[key] = [];
            let currentRegExp = new RegExp(`${key}`, 'i');
            coincidences.push(currentRegExp);
        }
    }
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < coincidences.length; j++) {
            if (coincidences[j].test(array[i])) {
                let currentValue = makeCoincidenceValue(i, array);
                finalObject[coincidences[j].source].push(currentValue);
            }
        }
    }
    return finalObject;
}