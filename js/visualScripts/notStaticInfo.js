'use strict';
// Функция для вывода в заголовок информации о залоге или прекращении деятельности
const showPledgeAndLiquidation = (value) => {
    let currentNode = templatesNodesMap.pledgeAndLiquidation[value].cloneNode(true);
    stringsMap.pledgeAndLiquidationStrings.appendChild(currentNode);
}
// Создание списка строк с совпадениями по слову
const createList = (currentString, list) => {
    for (let i = 0; i < list.length; i++) {
        let currentValue = templatesNodesMap.coincidenceLists['Строка'].cloneNode(true);
        currentValue.textContent = list[i];
        currentString.children[1].appendChild(currentValue);
        currentString.children[0].querySelector('span').textContent = list.length;
    }
    return currentString;
}
// Функция вывода списков строк с совпадениями по слову
const showCoincidenceLists = () => {
    for (let key in window.resultInformation.coincidenceLists) {
        let list = 0;
        if (window.resultInformation.coincidenceLists[key].length > 0) {
            list = createList(templatesNodesMap.coincidenceLists[key].cloneNode(true), window.resultInformation.coincidenceLists[key]);
            if (window.resultInformation.coincidenceLists[key].length !== window.resultInformation.newValuesObject[key]) {
                let attention = templatesNodesMap.coincidenceLists['Внимание'].cloneNode(true);
                list.children[0].append(attention);
            }
            stringsMap.listsStrings.appendChild(list);
        }
    }
    stringsMap.listsStrings.classList.add('visually-hidden');
    let arrow = stringsMap.listsStrings.closest('div[container-flag]').querySelector('.arrow');
    arrow.classList.add('arrow-rotate');
    let header = stringsMap.listsStrings.closest('div[container-flag]').querySelector('.header');
    header.classList.add('header-roll');
}
// Обработка текущей информации
const makeCurrentInfo = (template, info) => {
    // Формирования таблички с текущей информацией
    for (let i = 0; i < template.children.length; i++) {
        if (template.children[i].hasAttribute('data-title')) {
            let currentKey = template.children[i].dataset.title;
            template.children[i].textContent = info[currentKey];
            if (regexpMainMap.notDefined.test(info[currentKey])) {
                template.children[i].classList.add('alert-text');
            }
        }
    }
    // Добавление строки с обнаруженным залогом + вывод строки об этом в заголовок
    if (info['Участник (учредитель)'] && info['Сведения об обременении'] !== 'Не обнаружены') {
        let pledge = templatesNodesMap.templateFalseData['Недостоверность'].cloneNode(true);
        pledge.textContent = info['Сведения об обременении'];
        template.appendChild(pledge);
        showPledgeAndLiquidation('залог');
        if (finalInfoMap.extract.classList.contains('header-extract')) {
            finalInfoMap.extract.classList.remove('header-extract');
            finalInfoMap.extract.classList.add('header');
        }
    }
    // Добавление строки с обнаруженной недостоверностью
    if ((info['Тип'] || info['Участник (учредитель)']) && info['Сведения о недостоверности'] !== 'Не обнаружены') {
        let falseData = templatesNodesMap.templateFalseData['Недостоверность'].cloneNode(true);
        falseData.textContent = info['Сведения о недостоверности'];
        template.appendChild(falseData);
    }
    return template;
}
// Вывод строк с нестатичной информацией
const showNotStaticInfo = (value) => {
    let notFoundedValue = '';
    let valuesArray = [];
    let objectsMainKey = '';
    let objectsSubKey = '';
    let currentString = 0;
    let subheaderString = '';
    switch (value) {
        case 'Руководители':
            notFoundedValue = 'Руководитель, действующий от имени юридического лица без доверенности, не определен.';
            valuesArray = window.resultInformation.director;
            objectsMainKey = 'director';
            objectsSubKey = 'Тип';
            currentString = stringsMap.directorStrings;
            subheaderString = 'Руководитель №';
            break;
        case 'Участники':
            notFoundedValue = 'Участники (учредители) не определены.';
            valuesArray = window.resultInformation.founders;
            objectsMainKey = 'founders';
            objectsSubKey = 'Участник (учредитель)';
            currentString = stringsMap.foundersStrings;
            subheaderString = 'Участник (учредитель) №';
            break;
        case 'Держатель акций':
            notFoundedValue = 'Держатель реестра акционеров не определен.';
            if (window.resultInformation.stockRegister === 'Держатель реестра акционеров не определен.') {
                valuesArray = window.resultInformation.stockRegister;
            } else {
                valuesArray.push(window.resultInformation.stockRegister);
            }
            objectsMainKey = 'stockRegister';
            objectsSubKey = 'Держатель акций';
            currentString = stringsMap.stockRegisterStrings;
            break;
        case 'Устав':
            notFoundedValue = 'Сведения об уставе не обнаружены.';
            valuesArray = window.resultInformation.statut;
            objectsMainKey = 'statut';
            objectsSubKey = 'Устав';
            currentString = stringsMap.statutStrings;
            subheaderString = 'Документ №';
            break;
        case 'Прекращение':
            notFoundedValue = 'Сведения о прекращении деятельности юридического лица не обнаружены.';
            if (window.resultInformation.terminationRecord === 'Сведения о прекращении деятельности юридического лица не обнаружены.') {
                valuesArray = window.resultInformation.terminationRecord;
            } else {
                valuesArray.push(window.resultInformation.terminationRecord);
            }
            objectsMainKey = 'terminationRecord';
            objectsSubKey = 'Статус';
            currentString = stringsMap.terminationRecordStrings;
            break;
    }

    if (valuesArray !== notFoundedValue) {
        if (valuesArray.length > 0) {
            for (let i = 0; i < valuesArray.length; i++) {
                let currentValue = 0;
                let currentType = valuesArray[i][objectsSubKey];
                switch (value) {
                    case 'Держатель акций':
                        currentType = 'Держатель акций';
                        break;
                    case 'Устав':
                        currentType = 'Устав';
                        break;
                }
                currentValue = makeCurrentInfo(templatesNodesMap[objectsMainKey][currentType].cloneNode(true), valuesArray[i]);
                if (valuesArray.length > 1) {
                    let subheader = templatesNodesMap[objectsMainKey]['Подзаголовок'].cloneNode(true);
                    subheader.textContent = `${subheaderString} ${i + 1}:`;
                    currentValue.prepend(subheader);
                }
                currentString.appendChild(currentValue);
            }
            // Вывод остаточной информации
            switch (true) {
                // Вовыд в заголовок количества Руководителей, Участников, Уставов
                case value === 'Руководители' || value === 'Участники' || value === 'Устав':
                    let currentParent = currentString.closest('div[container-flag]');
                    let currentCount = currentParent.children[0].querySelector('span');
                    currentCount.textContent = valuesArray.length;
                    // Вывод блока с долей принадлежащей общейству, в случае ее наличия
                    if (value === 'Участники' && resultInformation.allIndexes.legalPersonShare.firstIndex !== -1 && resultInformation.allIndexes.legalPersonShare.lastIndex !== -1) {
                        let currentValue = makeCurrentInfo(templatesNodesMap[objectsMainKey]['Доля общества'].cloneNode(true), window.resultInformation.legalPersonShare);
                        currentString.appendChild(currentValue);
                    }
                    break;
                // Добавление заголовка для блоков с Прекращением и/или Держателем акций
                case value === 'Прекращение' || value === 'Держатель акций':
                    let termHeader = templatesNodesMap[objectsMainKey]['Заголовок'].cloneNode(true);
                    currentString.prepend(termHeader);
                    // Смена класса у блока с выпиской (для того, чтобы отодвинуть от заголовка с прекращением в самом верху)
                    if (value === 'Прекращение' && finalInfoMap.extract.classList.contains('header-extract')) {
                        finalInfoMap.extract.classList.remove('header-extract');
                        finalInfoMap.extract.classList.add('header');
                    }
                    break;
            }
        } else {
            notFoundedValue = templatesNodesMap[objectsMainKey]['Неопределены'].cloneNode(true);
            currentString.appendChild(notFoundedValue);
        }
    } else {
        notFoundedValue = templatesNodesMap[objectsMainKey]['Неопределены'].cloneNode(true);
        currentString.appendChild(notFoundedValue);
    }
}
// Очистка высех элементов от visually-hidden и arrow-rotate
const deleteExcessClasses = (collection) => {
    for (let i = 0; i < collection.length; i++) {
        switch (true) {
            case collection[i].classList.contains('arrow-rotate'):
                collection[i].classList.remove('arrow-rotate');
                break;
            case collection[i].classList.contains('arrow-rotate-alert'):
                collection[i].classList.remove('arrow-rotate-alert');
                break;
            case collection[i].classList.contains('header-roll'):
                collection[i].classList.remove('header-roll');
                break;
            case collection[i].hasAttribute('grid-flag') && collection[i].classList.contains('visually-hidden'):
                collection[i].classList.remove('visually-hidden');
                collection[i].classList.add('grid-container-st');
                break;
            case !collection[i].hasAttribute('grid-flag') && collection[i].classList.contains('visually-hidden'):
                collection[i].classList.remove('visually-hidden');
                break;
        }
        if (collection[i].children.length > 0) {
            deleteExcessClasses(collection[i].children);
        }
    }
}
// Вспомогательна функция для очистки строк с нестатичной информацией
const clearNotStaticInfoSupport = (collection) => {
    for (let i = collection.length - 1; i >= 0; i--) {
        switch (true) {
            case collection[i].hasAttribute('to-change-flag'):
                collection[i].querySelector('span').textContent = 0;
                break;
            case !collection[i].hasAttribute('not-delete-flag') && !collection[i].hasAttribute('delete-flag'):
                collection[i].remove();
                break;
            case collection[i].hasAttribute('delete-flag'):
                clearNotStaticInfoSupport(collection[i].children);
                break;
        }
    }
}
// Очистка от строк с нестатичной информацией
const clearNotStaticInfo = (collection) => {
    deleteExcessClasses(collection);
    for (let i = 0; i < collection.length; i++) {
        if (collection[i].hasAttribute('delete-flag')) {
            clearNotStaticInfoSupport(collection[i].children);
        }

    }
}