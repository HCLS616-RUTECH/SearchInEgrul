'use strict';
// Функция для выделения неопределнной информации
const parseNotDefinedInfo = (typeOfParse) => {
    let currentCollection = finalInfoMap.fullName.closest('.grid-container-st').children;
    for (let i = 0; i < currentCollection.length; i++) {
        switch (typeOfParse) {
            case 'добавление':
                if (regexpMainMap.notDefined.test(currentCollection[i].textContent)) {
                    currentCollection[i].classList.add('alert-text');
                }
                break;
            case 'очистка':
                if (currentCollection[i].classList.contains('alert-text')) {
                    currentCollection[i].classList.remove('alert-text');
                }
                break;
        }
    }
}
// Функция для вывода основной информации
const showStaticInfo = () => {
    // Вывод основной информации
    finalInfoMap.extract.textContent = window.resultInformation.extract;
    finalInfoMap.fullName.textContent = window.resultInformation.basicInformation['Полное наименование'];
    finalInfoMap.shortName.textContent = window.resultInformation.basicInformation['Сокращенное наименование'];
    finalInfoMap.typeStatutCapital.textContent = window.resultInformation.basicInformation['Вид уставного капитала'];
    finalInfoMap.statutCapital.textContent = window.resultInformation.basicInformation['Размер уставного капитала'];
    finalInfoMap.ogrn.textContent = window.resultInformation.basicInformation['ОГРН'];
    finalInfoMap.inn.textContent = window.resultInformation.basicInformation['ИНН'];
    finalInfoMap.kpp.textContent = window.resultInformation.basicInformation['КПП'];
    finalInfoMap.regDate.textContent = window.resultInformation.basicInformation['Дата регистрации'];
    finalInfoMap.address.textContent = window.resultInformation.address['Адрес'];
    // Вывод недостоверности в адресе
    if (window.resultInformation.address['Сведения о недостоверности'] !== 'Не обнаружены') {
        let addressFalseData = templatesNodesMap.templateFalseData['Недостоверность'].cloneNode(true);
        addressFalseData.textContent = window.resultInformation.address['Сведения о недостоверности'];
        stringsMap.addressStrings.appendChild(addressFalseData);
    }
    // Выделение неопределнной информации
    parseNotDefinedInfo('добавление');
}
// Функция для выделения совпавпадений по поиску слова
const parseCoincidences = (typeOfParse) => {
    let currentCollection = coincidencesMap.falseData.closest('.grid-container-st').children;
    for (let i = 0; i < currentCollection.length; i++) {
        for (let j = 0; j < currentCollection[i].children.length; j++) {
            let currentElement = currentCollection[i].children[j];
            let currentValue = +currentElement.querySelector('span').textContent;
            switch (typeOfParse) {
                case 'добавление':
                    if (currentValue > 0) {
                        currentElement.classList.add('alert-text');
                    }
                    break;
                case 'очистка':
                    if (currentElement.classList.contains('alert-text')) {
                        currentElement.classList.remove('alert-text');
                    }
                    break;
            }
        }
    }
}
// Функция для вывода совпадений по слову
const showCoincidences = () => {
    coincidencesMap.falseData.textContent = window.resultInformation.newValuesObject['недост'];
    coincidencesMap.pledge.textContent = window.resultInformation.newValuesObject['залог'];
    coincidencesMap.encumbrance.textContent = window.resultInformation.newValuesObject['обрем'];
    coincidencesMap.limitation.textContent = window.resultInformation.newValuesObject['огранич'];
    coincidencesMap.prohibition.textContent = window.resultInformation.newValuesObject['запрещ'];
    coincidencesMap.arrest.textContent = window.resultInformation.newValuesObject['арест'];
    coincidencesMap.liquidationValue.textContent = window.resultInformation.newValuesObject['ликвид'];
    coincidencesMap.delition.textContent = window.resultInformation.newValuesObject['исключ'];
    coincidencesMap.terminationValue.textContent = window.resultInformation.newValuesObject['прекр'];
    coincidencesMap.statutValue.textContent = window.resultInformation.newValuesObject['устав'];
    coincidencesMap.bankruptcy.textContent = window.resultInformation.newValuesObject['банкр'];
    coincidencesMap.attorneyManagment.textContent = window.resultInformation.newValuesObject['доверит'];
    parseCoincidences('добавление');
}
// Функция для очистки статичной информации
const clearStaticInfo = () => {
    if (finalInfoMap.extract.classList.contains('header')) {
        finalInfoMap.extract.classList.remove('header');
        finalInfoMap.extract.classList.add('header-extract');
    }
    // Основная информация
    finalInfoMap.extract.textContent = '';
    finalInfoMap.fullName.textContent = '';
    finalInfoMap.shortName.textContent = '';
    finalInfoMap.typeStatutCapital.textContent = '';
    finalInfoMap.statutCapital.textContent = '';
    finalInfoMap.ogrn.textContent = '';
    finalInfoMap.inn.textContent = '';
    finalInfoMap.kpp.textContent = '';
    finalInfoMap.regDate.textContent = '';
    finalInfoMap.address.textContent = '';
    parseNotDefinedInfo('очистка');
    // Совпадения по слову
    coincidencesMap.falseData.textContent = 0;
    coincidencesMap.pledge.textContent = 0;
    coincidencesMap.encumbrance.textContent = 0;
    coincidencesMap.limitation.textContent = 0;
    coincidencesMap.prohibition.textContent = 0;
    coincidencesMap.arrest.textContent = 0;
    coincidencesMap.liquidationValue.textContent = 0;
    coincidencesMap.delition.textContent = 0;
    coincidencesMap.terminationValue.textContent = 0;
    coincidencesMap.statutValue.textContent = 0;
    coincidencesMap.bankruptcy.textContent = 0;
    coincidencesMap.attorneyManagment.textContent = 0;
    parseCoincidences('очистка');
}