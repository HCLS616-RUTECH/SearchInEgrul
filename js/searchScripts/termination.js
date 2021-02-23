'use strict';

const findTerminationRecord = (array, indexes) => {
    let firstIndex = indexes.termination.firstIndex;
    let lastIndex = indexes.termination.lastIndex;
    let record = 0;
    if (firstIndex !== -1 && lastIndex !== -1) {
        switch (true) {
            case array[firstIndex].includes('Сведения о прекращении'):
                record = {
                    'Статус': 'Ликвидировано',
                    'Способ прекращения': 'Не определен',
                    'Дата прекращения': 'Не определена',
                    'ГРН': 'Не определен',
                };
                break;
            case array[firstIndex].includes('Сведения о состоянии юридического'):
                record = {
                    'Статус': 'В процессе ликвидации',
                    'Состояние': 'Не определено',
                    'Номер и дата решения': 'Не определены',
                    'Сведения о публикации': 'Не определены',
                    'ГРН': 'Не определен',
                };
                break;
        }
        for (let i = firstIndex; i < lastIndex; i++) {
            let currentValue = 0;
            switch (true) {
                case record['Статус'] === 'Ликвидировано' && array[i].includes('Способ прекращения'):
                    currentValue = createValue(i, lastIndex, 'прекращения', array[i], array, false);
                    record['Способ прекращения'] = currentValue;
                    break;
                case record['Статус'] === 'Ликвидировано' && array[i].includes('Дата прекращения'):
                    currentValue = createValue(i, lastIndex, 'прекращения', array[i], array, false);
                    record['Дата прекращения'] = currentValue;
                    break;
                case record['Статус'] === 'В процессе ликвидации' && array[i].includes('Состояние'):
                    currentValue = createValue(i, lastIndex, 'Состояние', array[i], array, false);
                    record['Состояние'] = currentValue;
                    break;
                case record['Статус'] === 'В процессе ликвидации' && array[i].includes('Номер и дата решения'):
                    currentValue = createValue(i + 1, lastIndex, 'ЕГРЮЛ', array[i] + array[i + 1], array, false);
                    if (currentValue[0] === ' ') {
                        currentValue = currentValue.slice(1);
                    }
                    record['Номер и дата решения'] = currentValue;
                    break;
                case record['Статус'] === 'В процессе ликвидации' && array[i].includes('Сведения о публикации'):
                    currentValue = createValue(i + 2, lastIndex, 'ЕГРЮЛ', array[i] + array[i + 1] + array[i + 2], array, false);
                    if (currentValue[0] === ' ') {
                        currentValue = currentValue.slice(1);
                    }
                    record['Сведения о публикации'] = currentValue;
                    break;
                case array[i].includes('ГРН и дата внесения в ЕГРЮЛ'):
                    if (!regexpMainMap.regexpColonAndPoint.test(array[i])) {
                        currentValue = createValue(i + 1, lastIndex, 'сведения', array[i + 1], array, false).match(regexpMainMap.regexpOGRN).join('');
                        record['ГРН'] = currentValue;
                    }
                    break;
            }
        }
        return record;
    } else {
        return 'Сведения о прекращении деятельности юридического лица не обнаружены.';
    }
}