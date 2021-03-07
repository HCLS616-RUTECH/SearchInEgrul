'use strict';

// Словарь с элементами
const elementsMap = {
    textArea: document.querySelector('#tXt'),
    startButton: document.querySelector('#btn'),
    demonstrationButton: document.querySelector('#btnDemonstration'),
    information: document.querySelector('#information'),
    bufferText: document.querySelector('#bufferText'),
    errorWindow: document.querySelector('#errorWindow'),
    infoWindow: document.querySelector('#infoWindow'),
    demonstrationWindow: document.querySelector('#demonstrationWindow'),
    backdropPrimary: document.querySelector('#backdropPrimary'),
    snackbar: document.querySelector('#snackbar'),
    image: document.querySelector('#image'),
    textBlock: document.querySelector('#textBlock'),
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
// Текст для демонстрации работы
const demonstration = {
    1: {
        alt: 'Условия для работы приложения.',
        text: '1. Для работы приложения потребуется Выписка из Единого государственного реестра юридических лиц (ЕГРЮЛ). Выписку можно бесплатно получить с официального сайта Федеральной налоговой службы (ФНС) по следующему адресу: https://egrul.nalog.ru/index.html. Также, для удобства, ссылка на указанный сайт размещена на основной странице приложения.',
    },
    2: {
        alt: 'Возможность заказать Выписку из ЕГРЮЛ.',
        text: '2. После ввода в поисковую строку на указанном сайте ОГРН, ИНН или наименования юридического лица (рекомендуется вводить ОГРН или ИНН), появляется возможность заказать  Выписку из ЕГРЮЛ в отношении этого юридического лица.',
    },
    3: {
        alt: 'Выписка из ЕГРЮЛ и возможность ее открыть.',
        text: '3. Выписка из ЕГРЮЛ предоставляется в виде файла с расширением "pdf" (файл также содержит вшитую электронную подпись). Указанный файл можно открыть посредству специальных программ или некоторых браузеров (Adobe Acrobat Reader DC, Google Chrome и т.д.).',
    },
    4: {
        alt: 'Копирование текста в Выписке из ЕГРЮЛ.',
        text: '4. Для анализа данных потребуется выделить весь текст в Выписке (рекомендуется это делать сочетанием клавиш: "Ctrl + A") и скопировать.',
    },
    5: {
        alt: 'Перенос текста из Выписки из ЕГРЮЛ.',
        text: '5. Скопированный текст необходимо вставить в "поле ввода" на основной странице приложения.',
    },
    6: {
        alt: 'Нажатие на кнопку "АНАЛИЗ".',
        text: '6. После вставки текста в "поле ввода" необходимо нажать на кнопку "АНАЛИЗ".',
    },
    7: {
        alt: 'Открытие найденной информации.',
        text: '7. После нажатия на кнопку "АНАЛИЗ" открывается окно со всей найденной после обработки информацией',
    },
    8: {
        alt: 'Копирование текста.',
        text: '8. Для удобства работы с найденной информацией была встроена некоторая функциональность.  В частности: сведения, которые подсвечиваются синим цветом (после наведения на них курсора), копируются после нажатия (клика) по ним.',
    },
    9: {
        alt: 'Сворачивание и разворачивание текста.',
        text: '9. Для удобства работы также добавлена возможность сворачивания и разворачивания текста в отдельных блоках. Это осуществляется по средству нажатия (клика) по соответствующему заголовку.',
    },
    10: {
        alt: 'Основные данные.',
        text: '10. Блок "Основные данные" содержит все главные реквизиты юридического лица',
    },
    11: {
        alt: 'Количество совпадений по поиску слова.',
        text: '11. Блок "Количество совпадений по поиску слова" содержит количество всех совпадений по искомым словам.  Для поиска по заданному слову РЕГИСТР НЕ ВАЖЕН! В случае если искомым словом является, например, "Устав", приложение найдет все совпадения с указанным словом, будь-то: Устав, устав, УСТАВ, уСТАВ, УсТаВ и т.д. Список искомых слов: 1) Для "Недостоверность" – "недост"; 2) Для "Залог" – "залог"; 3) Для "Обременение" – "обрем"; 4) Для "Ограничение" – "огранич"; 5) Для "Запрещение" – "запрещ"; 6) Для "Арест" – "арест"; 7) Для "Ликвидация" – "ликвид"; 8) Для "Исключение" – "исключ"; 9) Для "Прекращение" – "прекр"; 10) Для "Устав" – "устав"; 11) Для "Банкротство" – "банкр"; 12) Для "Доверительное управление" – "доверит".',
    },
    12: {
        alt: 'Списки строк с совпадениями по слову.',
        text: '12. Блок "Списки строк с совпадениями по слову" содержит все строки выписки, в которых найдены искомые слова, указанные ранее. В некоторых случаях количество строк не совпадает с количеством найденных слов. Это объясняется тем, что одна строка может (и вероятнее всего) содержит сразу несколько искомых слов. В таком случае появляется об этом уведомление',
    },
    13: {
        alt: 'Руководители.',
        text: '13. Блок "Руководитель(и) юридического лица, действующий без доверенности" содержит количество зарегистрированных в ЕГРЮЛ руководителей юридического лица и все имеющиеся о них сведения. В случае если в ФНС было подано заявление о "Недостоверности сведений" о руководителе, приложение выведет об этом сообщение, которое также будет включать в себя имеющуюся об этом в ЕГРЮЛ информацию.',
    },
    14: {
        alt: 'Участники (учредители).',
        text: '14. Блок "Участники (учредители)" содержит количество зарегистрированных участников (учредителей) и все имеющиеся о них сведения. В случае если в ФНС было подано заявление о "Недостоверности сведений" об участнике (учредителе), приложение выведет об этом сообщение, которое также будет включать в себя имеющуюся об этом в ЕГРЮЛ информацию. В случае если в ЕГРЮЛ содержатся сведения об обременении доли в уставном капитале юридического лица, принадлежащей соответствующему участнику, приложение выведет об этом сообщение.',
    },
    15: {
        alt: 'Держатель реестра акционеров.',
        text: '15. В случае если юридическое лицо является акционерным обществом, то добавится блок "Держатель реестра акционеров акционерного общества", содержащий соответствующую информацию (если в ЕГРЮЛ имеются об этом сведения).',
    },
    16: {
        alt: 'Устав.',
        text: '16. Блок "Устав" содержит информацию о последней редакции устава юридического лица, сформированной на основе последней записи об уставе, содержащейся в выписке. В случае если последней записью об уставе являются сведения об изменениях в устав (имеется ввиду изменения в устав, зарегистрированные в качестве отдельного документа, дополнения к действующему уставу), приложение зафиксирует информацию обо всех изменениях вплоть до действующей редакции устава и покажет все найденные сведения в указанном блоке (т.е. покажет сведения и об изменениях и об уставе одновременно). В некоторых случаях ФНС регистрирует изменения в устав (являющиеся отдельным, дополнительным, документом) в качестве устава, т.е. не отображает информацию о том, что документ в реальности является дополнением, а не основным документом. В таком случае определить, что сведения в реальности являются информацией об изменениях, а не об уставе не представляется возможным и приложение выведет эти сведения в виде последней редакции устава.',
    },
    17: {
        alt: 'Недостоверность в адресе.',
        text: '17. В случае если в адресе имеются сведения о "недостоверности" приложение выведет об этом сообщение, которое также будет включать в себя имеющуюся об этом в ЕГРЮЛ информацию.',
    },
    18: {
        alt: 'Прекращение деятельности в заголовке.',
        text: '18. В случае если выписка содержит сведения о прекращении деятельности юридического лица (сюда включаются сведения и о процессе прекращения и полном прекращении деятельности) информация об этом выводится в заголовок.',
    },
    19: {
        alt: 'Прекращение деятельности в блоке.',
        text: '19. Также в случае если выписка содержит сведения о прекращении деятельности юридического лица, то добавится блок "Сведения о прекращении деятельности", в котором будет отображена вся имеющаяся в ЕГРЮЛ по этому поводу информация.',
    },
    20: {
        alt: 'Обременение доли участника.',
        text: '20. Как писалось ранее, в случае если в ЕГРЮЛ содержатся сведения об обременении доли в уставном капитале юридического лица, принадлежащей соответствующему участнику, приложение выведет об этом сообщение, а также отобразит это в виде заголовка.',
    },
    21: {
        alt: 'Заключение.',
        text: '21. В заключение стоит указать, что приложение работает крайне стабильно и хорошо. На момент написания настоящего текста протестировано более двухсот выписок, а также приложение активно используется на текущей работе.',
    },
};