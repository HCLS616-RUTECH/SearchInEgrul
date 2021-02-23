'use strict';
// Создание массива из текста (по переносу)
const createArrayHandler = (text) => {
    let currentTextArray = text.split('\n');
    return currentTextArray;
}
// Центральная функция для обработки информации в тексте
const checkTextHandler = () => {
    let resultInformation = {
        extract: 'Введены некорректные данные.',
        newValuesObject: 'Совпадений не имеется.',
        director: 'Руководитель, действующий от имени юридического лица без доверенности, не определен.',
        statut: 'Сведения об уставе не обнаружены.',
        founders: 'Участники (учредители) не определены.',
        address: 'Адрес (место нахождения) не определен.',
        basicInformation: 'Основная информация о юридическом лице не определена.',
        terminationRecord: 'Сведения о прекращении деятельности юридического лица не обнаружены.',
        allIndexes: {},
    };
    let currentText = elementsMap.textArea.value; // Входящий текст
    let newTextArray = createArrayHandler(currentText); // Массив сформированный из текста (по переносу)
    resultInformation.extract = makeExtract(newTextArray); // Текущая выписка
    if (resultInformation.extract === 'Введены некорректные данные.') {
        window.resultInformation = resultInformation;
    } else {
        resultInformation.allIndexes = findAllIndexes(newTextArray);
        resultInformation.newValuesObject = findTextValueHandler(currentText); // Объект с результатами поиска по слову +++
        resultInformation.coincidenceLists = makeCoincidenceLists(resultInformation.newValuesObject, newTextArray); // Объекст с найденными строками по результатам поиска по слову
        resultInformation.basicInformation = findBasicInformation(newTextArray, resultInformation.allIndexes, 1); // Основная информация о ЮЛ +++
        resultInformation.address = makeAddress(newTextArray, resultInformation.allIndexes); // Адресс ЮЛ +++
        resultInformation.statut = findStatut(newTextArray); // Актуальные записи об уставе +++
        resultInformation.director = findDirector(newTextArray, resultInformation.allIndexes); // Руководитель +++
        resultInformation.founders = findFounders(newTextArray, resultInformation.allIndexes); // Учредители (участники) +++
        if (resultInformation.allIndexes.legalPersonShare.firstIndex !== -1 && resultInformation.allIndexes.legalPersonShare.lastIndex !== -1) { // Определение доли принадлежащей обществу +++
            resultInformation.legalPersonShare = findLegalPersonShare(newTextArray, resultInformation.allIndexes);
        }
        if (resultInformation.allIndexes.stockRegister.firstIndex !== -1 && resultInformation.allIndexes.stockRegister.lastIndex !== -1) { // Поиск держателя акционеров, в случае если ЮЛ - это акционерное общество
            resultInformation.stockRegister = findStockRegister(newTextArray, resultInformation.allIndexes);
        }
        resultInformation.terminationRecord = findTerminationRecord(newTextArray, resultInformation.allIndexes); // Запись о прекращении деятельности +++
        window.resultInformation = resultInformation;
    }
    // console.log(window.resultInformation);
    // console.log(newTextArray);
}
// Центральная функция для вывода найденной информации
const showInformationHandler = () => {
    if (window.resultInformation.extract === 'Введены некорректные данные.') {
        if (elementsMap.errorWindow.classList.contains('visually-hidden')) {
            elementsMap.errorWindow.classList.remove('visually-hidden');
            elementsMap.backdropPrimary.classList.remove('visually-hidden');
        }
    } else {
        showStaticInfo();
        showCoincidences();
        showCoincidenceLists();
        showNotStaticInfo('Руководители');
        showNotStaticInfo('Участники');
        if (window.resultInformation.stockRegister) {
            showNotStaticInfo('Держатель акций');
        }
        showNotStaticInfo('Устав');
        if (window.resultInformation.terminationRecord !== 'Сведения о прекращении деятельности юридического лица не обнаружены.') {
            showNotStaticInfo('Прекращение');
            showPledgeAndLiquidation('ликвид');
        }
        if (elementsMap.infoWindow.classList.contains('visually-hidden')) {
            elementsMap.infoWindow.classList.remove('visually-hidden');
            elementsMap.backdropPrimary.classList.remove('visually-hidden');
        }
    }
}
// Основные обработчики событий
elementsMap.startButton.addEventListener('click', checkTextHandler);
elementsMap.startButton.addEventListener('click', showInformationHandler);
// Второстепенные обработчики событий
elementsMap.bufferText.addEventListener('focus', copyBuferText);
document.addEventListener('click', copyText);
document.addEventListener('click', toRollText);
document.addEventListener('click', closeWindowsHandler);