'use strict';

// Словарь с элементами
const elementsMap = {
    textArea: document.querySelector('#tXt'),
    startButton: document.querySelector('#btn'),
    information: document.querySelector('#information'),
    bufferText: document.querySelector('#bufferText'),
    errorWindow: document.querySelector('#errorWindow'),
    infoWindow: document.querySelector('#infoWindow'),
    closeErrorButton: document.querySelector('#closeErrorButton'),
    closeInfoButton: document.querySelector('#closeInfoButton'),
    backdropPrimary: document.querySelector('#backdropPrimary'),
    backdropAlert: document.querySelector('#backdropAlert'),
    snackbar: document.querySelector('#snackbar'),
};
// Словарь с основными регулярными выражениями
const regexpMainMap = {
    regexpWithoutSpace: /\S/,
    regexpSpace: /\s/,
    regexpDash: /-|−|–|—/,
    regexpColonAndPoint: /:|\./gi,
    regexpPage: /cтраница|Страница|СТРАНИЦА/,
    regexpExtract: /выписка|Выписка|ВЫПИСКА/,
    regexpStatut: /устав|Устав|УСТАВ/,
    regexpStatutChange: /изменени|Изменени|ИЗМЕНЕНИ/,
    regexpFalseData: /недостоверн|Недостоверн|НЕДОСТОВЕРН/,
    notDefined: /Не определен/,
    regexpStockCompany: /акционерн/i,
    regexpTime: /\d\d:\d\d:\d\d/,
    regexpDate: /\d\d\.\d\d\.\d\d/,
    regexpOGRN: /\d\d\d\d\d\d\d\d\d\d\d\d\d/,
};
// Словарь с второстепенными регулярными выражениями
const regexpSupportMap = {
    regExpFalseData: /недост|Недост|НЕДОСТ/gi,
    regExpPledge: /залог|Залог|ЗАЛОГ/gi,
    regExpEncumbrance: /обрем|Обрем|ОБРЕМ/gi,
    regExpLimitation: /огранич|Огранич|ОГРАНИЧ/gi,
    regExpProhibition: /запрещ|Запрещ|ЗАПРЕЩ/gi,
    regExpArrest: /арест|Арест|АРЕСТ/gi,
    regExpLiquidation: /ликвид|Ликвид|ЛИКВИД/gi,
    refExpDelition: /исключ|Исключ|ИСКЛЮЧ/gi,
    regExpTermination: /прекр|Прекр|ПРЕКР/gi,
    regExpStatut: /устав|Устав|УСТАВ/gi,
    regExpBankruptcy: /банкр|Банкр|БАНКР/gi,
    regExpAttorneyManagment: /доверит|Доверит|ДОВЕРИТ/gi,
};
// Словарь со статичными строками для вывода информации
const finalInfoMap = {
    extract: document.querySelector('#extract'),
    fullName: document.querySelector('#fullName'),
    shortName: document.querySelector('#shortName'),
    typeStatutCapital: document.querySelector('#typeStatutCapital'),
    statutCapital: document.querySelector('#statutCapital'),
    ogrn: document.querySelector('#ogrn'),
    inn: document.querySelector('#inn'),
    kpp: document.querySelector('#kpp'),
    regDate: document.querySelector('#regDate'),
    address: document.querySelector('#address'),
};
// Словарь с нестатичными строками для вывода информации
const stringsMap = {
    pledgeAndLiquidationStrings: document.querySelector('#pledgeAndLiquidationStrings'),
    addressStrings: document.querySelector('#addressStrings'),
    listsStrings: document.querySelector('#listsStrings'),
    directorStrings: document.querySelector('#directorStrings'),
    foundersStrings: document.querySelector('#foundersStrings'),
    stockRegisterStrings: document.querySelector('#stockRegisterStrings'),
    statutStrings: document.querySelector('#statutStrings'),
    terminationRecordStrings: document.querySelector('#terminationRecordStrings'),
};
// Словарь с элементами для вывода количества совпадений по заданным словам (regexpSupportMap)
const coincidencesMap = {
    falseData: document.querySelector('#falseData'),
    pledge: document.querySelector('#pledge'),
    encumbrance: document.querySelector('#encumbrance'),
    limitation: document.querySelector('#limitation'),
    prohibition: document.querySelector('#prohibition'),
    arrest: document.querySelector('#arrest'),
    liquidationValue: document.querySelector('#liquidationValue'),
    delition: document.querySelector('#delition'),
    terminationValue: document.querySelector('#terminationValue'),
    statutValue: document.querySelector('#statutValue'),
    bankruptcy: document.querySelector('#bankruptcy'),
    attorneyManagment: document.querySelector('#attorneyManagment'),
};
// Словарь с шаблонами для передачи в строки с нестатичной информацией (stringsMap)
const templatesMap = {
    templateFalseData: document.querySelector('#templateFalseData').content,
    coincidenceLists: document.querySelector('#coincidenceLists').content,
    pledgeAndLiquidation: document.querySelector('#pledgeAndLiquidation').content,
    director: document.querySelector('#director').content,
    founders: document.querySelector('#founders').content,
    stockRegister: document.querySelector('#stockRegister').content,
    statut: document.querySelector('#statut').content,
    terminationRecord: document.querySelector('#terminationRecord').content,
};
// Словарь с контентом из templatesMap в виде объекта (не коллекции) для удобного вывода нестатичной информации
const templatesNodesMap = {
    templateFalseData: {},
    coincidenceLists: {},
    pledgeAndLiquidation: {},
    director: {},
    founders: {},
    stockRegister: {},
    statut: {},
    terminationRecord: {},
};
// Функция для перевода коллекций из templatesMap в словарь (templatesNodesMap)
(() => {
    for (let key in templatesMap) {
        for (let i = 0; i < templatesMap[key].children.length; i++) {
            let currentKey = templatesMap[key].children[i].dataset.title;
            templatesNodesMap[key][currentKey] = templatesMap[key].children[i];
        }
    }
})()