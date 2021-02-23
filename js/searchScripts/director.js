'use strict';


// Конструктор для создания объекта с записью директоре или ином руководителе (включая управляющего - ИП)
function DirectorRecord() {
    this['Тип'] = 'Единоличный исполнительный орган';
    this['Должность'] = 'Не определена';
    this['ФИО'] = 'Не определены';
    this['ИНН'] = 'Не определен';
    this['Сведения о недостоверности'] = 'Не обнаружены';
};
// Конструктор для создания объекта с записью об управляющей организации
function ManagingOrganizationRecord() {
    this['Тип'] = 'Управляющая организация';
    this['Полное наименование'] = 'Не определено';
    this['ОГРН'] = 'Не определен';
    this['ИНН'] = 'Не определен';
    this['Сведения о недостоверности'] = 'Не обнаружены';
};


// Функция создания записи о руководителе
let detectDirector = (firstIndex, lastIndex, typeOfChief, array) => {
    let curentDirectorRecord = 0;
    switch (typeOfChief) {
        case 'Единоличный исполнительный орган':
            curentDirectorRecord = new DirectorRecord();
            break;
        case 'Управляющая компания':
            curentDirectorRecord = new ManagingOrganizationRecord();
            break;
    }
    for (let i = firstIndex; i < lastIndex; i++) {
        let currentValue = 0;
        switch (true) {
            // Кейсы для единоличного исполнительного органа
            case typeOfChief === 'Единоличный исполнительный орган' && array[i].includes('Фамилия') && curentDirectorRecord['ФИО'] === 'Не определены':
                currentValue = createValue(i, lastIndex, 'Фамилия', array[i], array, false);
                currentValue = correctionOfRegister(deleteExcessText(currentValue, 'Отчество'));
                curentDirectorRecord['ФИО'] = currentValue;
                currentValue = 0;
                break;
            case typeOfChief === 'Единоличный исполнительный орган' && array[i].includes('Должность'):
                currentValue = createValue(i, lastIndex, 'Должность', array[i], array, false);
                currentValue = correctionOfRegister(currentValue);
                curentDirectorRecord['Должность'] = currentValue;
                currentValue = 0;
                break;
            // Кейсы для управляющей компании
            case typeOfChief === 'Управляющая компания' && array[i].includes('Полное наименование'):
                currentValue = createValue(i, lastIndex, 'наименование', array[i], array, false);
                curentDirectorRecord['Полное наименование'] = currentValue;
                currentValue = 0;
                break;
            case typeOfChief === 'Управляющая компания' && array[i].includes('ОГРН'):
                if (!regexpMainMap.regexpColonAndPoint.test(array[i])) {
                    currentValue = createValue(i, lastIndex, 'ОГРН', array[i], array, false);
                    curentDirectorRecord['ОГРН'] = currentValue;
                    currentValue = 0;
                }
                break;
            // Общие кейсы
            case array[i].includes('ИНН'):
                currentValue = createValue(i, lastIndex, 'ИНН', array[i], array, false);
                curentDirectorRecord['ИНН'] = currentValue;
                currentValue = 0;
                break;
            case array[i].includes('сведения') && regexpMainMap.regexpFalseData.test(array[i]):
                currentValue = createValue(i, lastIndex, 'сведения', array[i], array, false);
                curentDirectorRecord['Сведения о недостоверности'] = `ОБНАРУЖЕНА НЕДОСТОВЕРНОСТЬ: ${currentValue}`;
                currentValue = 0;
                break;
        }
    }
    return curentDirectorRecord;
}


// Основная функция определения руководителя(ей) в юридическом лице
const findDirector = (array, indexes) => {
    let finalDirectorsArray = [];
    let firstIndex = indexes.director.firstIndex;
    let lastIndex = indexes.director.lastIndex;
    if (firstIndex !== -1 && lastIndex !== -1) {
        let isMoreThenOneDirector = false; // Зарегистрировано больше одного руководителя
        switch (true) {
            case +array[firstIndex + 2] === 1:
                isMoreThenOneDirector = true;
                break;
            case regexpMainMap.regexpPage.test(firstIndex + 2):
                if (+array[firstIndex + 5] === 1) {
                    isMoreThenOneDirector = true;
                }
                break;
        }
        let counterOfTheDirectors = 1;
        let firstIndexCurrentDirector = firstIndex;
        if (isMoreThenOneDirector) {
            firstIndexCurrentDirector = firstIndex + 2;
        }
        let lastIndexCurrentDirector = 0;
        if (!isMoreThenOneDirector) {
            lastIndexCurrentDirector = lastIndex;
        }
        let isDirector = false;
        let isManagingOrganization = false;
        for (let i = firstIndexCurrentDirector; i < lastIndex; i++) {
            switch (true) {
                case lastIndexCurrentDirector === 0 && i === lastIndex - 1 && isMoreThenOneDirector:
                    lastIndexCurrentDirector = i;
                    break;
                case +array[i] === counterOfTheDirectors + 1 && isMoreThenOneDirector:
                    counterOfTheDirectors++;
                    lastIndexCurrentDirector = i;
                    break;
                case !isManagingOrganization && array[i].includes('Фамилия') && isMoreThenOneDirector:
                    isDirector = true;
                    break;
                case !isManagingOrganization && array[i].includes('Фамилия') && !isMoreThenOneDirector && finalDirectorsArray.length === 0:
                    isDirector = true;
                    break;
                case !isDirector && array[i].includes('Полное наименование') && isMoreThenOneDirector:
                    isManagingOrganization = true;
                    break;
                case !isDirector && array[i].includes('Полное наименование') && !isMoreThenOneDirector && finalDirectorsArray.length === 0:
                    isManagingOrganization = true;
                    break;
            }
            switch (true) {
                case lastIndexCurrentDirector !== 0 && isDirector:
                    finalDirectorsArray.push(detectDirector(firstIndexCurrentDirector, lastIndexCurrentDirector, 'Единоличный исполнительный орган', array));
                    firstIndexCurrentDirector = lastIndexCurrentDirector;
                    lastIndexCurrentDirector = 0;
                    isDirector = false;
                    break;
                case lastIndexCurrentDirector !== 0 && isManagingOrganization:
                    finalDirectorsArray.push(detectDirector(firstIndexCurrentDirector, lastIndexCurrentDirector, 'Управляющая компания', array));
                    firstIndexCurrentDirector = lastIndexCurrentDirector;
                    lastIndexCurrentDirector = 0;
                    isManagingOrganization = false;
                    break;
            }
        }
        return finalDirectorsArray;
    } else {
        return 'Руководитель, действующий от имени юридического лица без доверенности, не определен.'
    }
}