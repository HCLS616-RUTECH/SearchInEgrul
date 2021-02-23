'use strict';

// Конструктор для создания объекта с записью об уставе/изменении в устав
function StatutRecord() {
    this['Наименование документа'] = 'Не определено';
    this['ГРН документа'] = 'Не определен';
    this['Дата документа'] = 'Не определена';
    this['Регистрирующий орган'] = 'Не определен';
}

// ФУНКЦИЯ ФОРМИРОВАНИЯ ЗАПИСИ ОБ УСТАВЕ
const makeStatutRecord = (indexName, indexGRN, reverseArray) => {
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
                if (!(regexpMainMap.regexpPage.test(reverseArray[j]) || regexpMainMap.regexpExtract.test(reverseArray[j]) || regexpMainMap.regexpTime.test(reverseArray[j]) || regexpMainMap.regexpOGRN.test(reverseArray[j]) || regexpMainMap.regexpDate.test(reverseArray[j]))) {
                    registrationAuthorityArray.push(reverseArray[j]);
                }
                break;
        }
    }
    statutRecord['Регистрирующий орган'] = registrationAuthorityArray.slice(2, registrationAuthorityArray.length).join(' ');

    return statutRecord;
}

// Основная функция для поиска информации об уставе (изменениях устава)
const findStatut = (array) => {
    let reverseArray = array.slice().reverse();
    let finalStatutArray = [];
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ПОИСК ИНДЕКСОВ НУЖНЫХ ЭЛЕМЕНТОВ
    let indexStatutName = reverseArray.findIndex((element, index) => {
        if (element.includes('Наименование документа') && regexpMainMap.regexpStatut.test(element)) {
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
        // ФОРМИРОВАНИЕ ЗАПИСИ(ЕЙ) ОБ УСТАВЕ
        if (indexStatutDateAndGRN !== -1) {
            if (reverseArray[indexStatutName].includes('Наименование документа') && regexpMainMap.regexpStatutChange.test(reverseArray[indexStatutName]) && regexpMainMap.regexpStatut.test(reverseArray[indexStatutName])) {
                finalStatutArray.push(makeStatutRecord(indexStatutName, indexStatutDateAndGRN, reverseArray));
                for (let i = indexStatutDateAndGRN + 1; i < reverseArray.length; i++) {
                    let currentIndexStatutName = 0;
                    let currentIndexStatutDateAndGRN = 0;
                    switch (true) {
                        case reverseArray[i].includes('Наименование документа') && regexpMainMap.regexpStatutChange.test(reverseArray[i]) && regexpMainMap.regexpStatut.test(reverseArray[i]):
                            currentIndexStatutName = i;
                            for (let j = currentIndexStatutName; j < reverseArray.length; j++) {
                                if (reverseArray[j].includes('ГРН и дата')) {
                                    currentIndexStatutDateAndGRN = j;
                                    i = j + 1;
                                    j = reverseArray.length;
                                    finalStatutArray.push(makeStatutRecord(currentIndexStatutName, currentIndexStatutDateAndGRN, reverseArray));
                                }
                            }
                            break;
                        case reverseArray[i].includes('Наименование документа') && regexpMainMap.regexpStatut.test(reverseArray[i]) && !regexpMainMap.regexpStatutChange.test(reverseArray[i]):
                            currentIndexStatutName = i;
                            for (let j = currentIndexStatutName; j < reverseArray.length; j++) {
                                if (reverseArray[j].includes('ГРН и дата')) {
                                    currentIndexStatutDateAndGRN = j;
                                    j = reverseArray.length;
                                    i = reverseArray.length;
                                    finalStatutArray.push(makeStatutRecord(currentIndexStatutName, currentIndexStatutDateAndGRN, reverseArray));
                                }
                            }
                            break;
                    }
                }
                return finalStatutArray;
            } else {
                finalStatutArray.push(makeStatutRecord(indexStatutName, indexStatutDateAndGRN, reverseArray));
                return finalStatutArray;
            }
        } else {
            return 'Сведения об уставе не обнаружены.'
        }
    } else {
        return 'Сведения об уставе не обнаружены.'
    }
}