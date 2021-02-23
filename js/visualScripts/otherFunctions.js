'use strict';
// Функция для закрытия всплывающих окон
const closeWindowsHandler = (evt) => {
    switch (true) {
        case evt.target.hasAttribute('close-button') || evt.target.closest('button[close-button]'):
            if (evt.target.closest('.info-window')) {
                clearNotStaticInfo(elementsMap.information.children);
                clearStaticInfo();
                window.resultInformation = {
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
            }
            let closeWindow = evt.target.closest('div[close-flag]');
            if (!closeWindow.classList.contains('visually-hidden')) {
                closeWindow.classList.add('visually-hidden');
                elementsMap.backdropPrimary.classList.add('visually-hidden');
            }
            break;
        case !(evt.target.hasAttribute('close-flag') || evt.target.closest('div[close-flag]')) && evt.target.getAttribute('id') !== 'btn':
            switch (true) {
                case !elementsMap.errorWindow.classList.contains('visually-hidden'):
                    elementsMap.errorWindow.classList.add('visually-hidden');
                    elementsMap.backdropPrimary.classList.add('visually-hidden');
                    break;
                case !elementsMap.infoWindow.classList.contains('visually-hidden'):
                    clearNotStaticInfo(elementsMap.information.children);
                    clearStaticInfo();
                    elementsMap.infoWindow.classList.add('visually-hidden');
                    elementsMap.backdropPrimary.classList.add('visually-hidden');
                    break;
            }
            break;
    }
}
// 3 Функции копирования текста
const showSnackbar = () => {
    elementsMap.snackbar.classList.add('show');
    setTimeout(() => {
        elementsMap.snackbar.classList.remove('show');
    }, 1200);
}
const copyBuferText = (evt) => {
    evt.target.select();
    document.execCommand('copy');
    evt.target.value = '';
}
const copyText = (evt) => {
    if (evt.target.hasAttribute('copy-text-flag')) {
        elementsMap.bufferText.value = evt.target.textContent;
        elementsMap.bufferText.focus();
        showSnackbar();
    }
}
// Сворачивание абзацев
const toRollText = (evt) => {
    if (evt.target.hasAttribute('roll-flag') || evt.target.closest('div[roll-flag]')) {
        let currentContainer = evt.target.closest('div[container-flag]').children;
        for (let i = 0; i < currentContainer.length; i++) {
            switch (true) {
                case !currentContainer[i].hasAttribute('roll-flag') && currentContainer[i].hasAttribute('grid-flag') && currentContainer[i].classList.contains('visually-hidden'):
                    currentContainer[i].classList.remove('visually-hidden');
                    currentContainer[i].classList.add('grid-container-st');
                    break;
                case !currentContainer[i].hasAttribute('roll-flag') && !currentContainer[i].hasAttribute('grid-flag') && currentContainer[i].classList.contains('visually-hidden'):
                    currentContainer[i].classList.remove('visually-hidden');
                    break;
                case !currentContainer[i].hasAttribute('roll-flag') && !currentContainer[i].classList.contains('visually-hidden'):
                    currentContainer[i].classList.remove('grid-container-st');
                    currentContainer[i].classList.add('visually-hidden');
                    break;
            }
        }
        // Вращение стрелки
        let arrow = 0;

        switch (true) {
            case evt.target.hasAttribute('roll-flag'):
                arrow = evt.target.querySelector('.arrow') || evt.target.querySelector('.arrow-alert');
                break;
            case evt.target.classList.contains('arrow') || evt.target.classList.contains('arrow-alert'):
                arrow = evt.target;
                break;
            case evt.target.classList.contains('weight-text'):
                arrow = evt.target.closest('div[roll-flag]').querySelector('.arrow') || evt.target.closest('div[roll-flag]').querySelector('.arrow-alert');
                break;
        }
        switch (true) {
            case arrow.classList.contains('arrow') && !arrow.classList.contains('arrow-rotate'):
                arrow.classList.add('arrow-rotate');
                break;
            case arrow.classList.contains('arrow') && arrow.classList.contains('arrow-rotate'):
                arrow.classList.remove('arrow-rotate');
                break;
            case arrow.classList.contains('arrow-alert') && !arrow.classList.contains('arrow-rotate-alert'):
                arrow.classList.add('arrow-rotate-alert');
                break;
            case arrow.classList.contains('arrow-alert') && arrow.classList.contains('arrow-rotate-alert'):
                arrow.classList.remove('arrow-rotate-alert');
                break;
        }

        let header = evt.target.closest('div[container-flag]').querySelector('.header') || evt.target.closest('div[container-flag]').querySelector('.header-alert');
        switch (true) {
            case header.classList.contains('header') && !header.classList.contains('header-alert') && !header.classList.contains('header-roll'):
                header.classList.add('header-roll');
                break;
            case !header.classList.contains('header') && header.classList.contains('header-alert') && !header.classList.contains('header-alert-roll'):
                header.classList.add('header-alert-roll');
                break;
            case header.classList.contains('header') && !header.classList.contains('header-alert') && header.classList.contains('header-roll'):
                header.classList.remove('header-roll');
                break;
            case !header.classList.contains('header') && header.classList.contains('header-alert') && header.classList.contains('header-alert-roll'):
                header.classList.remove('header-alert-roll');
                break;
        }
    }
}