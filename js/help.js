/**
 * Скрипт, содержащий функции для работы в режиме справки
 */

var state = -1;

/**
 * Функция, которая возвращает значение текущего состояния
 */
function getState() {
    return this.state;
}

/**
 * Функция установки состояния
 * @param state
 */
function setState(state) {
    this.state = state;
}

/**
 * Функция, которая отображает подсказки в соответствии с состоянием
 * @param state - текущее состояние
 */
function guide  (state) {
    var $area = $("#map").find("area");

    switch (state) {
        case 0:
            setState(0);
            $('#help_info').show();
            showTip($area.eq(state), "Тумблер \"СЕТЬ\"",
                "Тумблер \"СЕТЬ\" предназначен для включения и выключения прибора");
            break;
        case 1:
            setState(1);
            showTip($area.eq(state), "Индикаторная панель",
                "Данная индикаторная панель предназначена для отображения измеряемой величины. " +
                "При переполнении на индикаторной панели отображаются мигающие нули");
            break;
        case 2:
            setState(2);
            showTip($area.eq(state), "Уменьшение предела",
                "Данная кнопка предназначена для ручной установки предела, если измерения проводятся в основном на одном пределе");
            break;
        case 3:
            setState(3);
            showTip($area.eq(state), "Автоматический выбор предела",
                "Данная кнопка предназначена для включения и выключения режима автоматического выбора предела, " +
                "если значение измеряемой величины неизвестно");
            break;
        case 4:
            setState(4);
            showTip($area.eq(state), "Увеличение предела",
                "Данная кнопка предназначена для ручной установки предела, если измерения проводятся в основном на одном пределе");
            break;
        case 5:
            setState(5);
            showTip($area.eq(state), "Измерение постоянного напряжения",
                "Данная кнопка предназначена для включения режима измерения постоянного напряжения");
            break;
        case 6:
            setState(6);
            showTip($area.eq(state), "Измерение переменного напряжения",
                "Данная кнопка предназначена для включения режима измерения переменного напряжения");
            break;
        case 7:
            setState(7);
            showTip($area.eq(state), "Измерение сопротивления",
                "Данная кнопка предназначена для включения режима измерения сопротивления");
            break;
        case 8:
            setState(8);
            showTip($area.eq(state), "Измерение постоянного тока",
                "Данная кнопка предназначена для включения режима измерения постоянного тока");
            break;
        case 9:
            setState(9);
            showTip($area.eq(state),  "Измерение переменного тока",
                "Данная кнопка предназначена для включения режима измерения переменного тока");
            break;
        case 10:
            setState(10);
            showTip($area.eq(state), "Входное гнездо измерения напряжения и сопротивления",
                "Данное входное гнездо используется при измерении напряжения и сопротивления");
            break;
        case 11:
            setState(11);
            showTip($area.eq(state), "Входное гнездо общего провода",
                "Данное входное гнездо используется при любом измерении");
            break;
        case 12:
            setState(12);
            showTip($area.eq(state), "Входное гнездо измерения токов",
                "Данное входное гнездо используется при измерении токов");
            break;
    }
}

/**
 * Функция удаления всплывающей подсказки у элементов
 */
function removeTips() {
    var $area = $("#map").find("area");
    $area.qtip('destroy', true);
}

/**
 * Функция, показывающая предыдущую подсказку
 */
function previousTip() {
    var state = 0;
    var current = getState();
    if (current > 0)
        state = current - 1;
    removeTips();
    guide(state);
}

/**
 * Функция, показывающая следующую подсказку
 */
function nextTip() {
    var state = 12;
    var current = getState();
    if (current < 12)
        state = current + 1;
    removeTips();
    guide(state);
}

/**
 * Функция показывает подсказку
 * @param $element - область, у которой должна всплыть подсказки
 * @param title - заголовок подсказки
 * @param text - текст подсказки
 */
function showTip($element, title, text) {
    if (title.indexOf("гнездо") != -1) {
        $element.qtip({
            show: { ready: true, solo: true },
            hide: false,
            content: { title: title, text: text },
            position: { my: 'left center', at: 'right center' },
            style: { classes: "qtip-bootstrap", tip: { corner: "left center" } }
        });
    } else {
        $element.qtip({
            show: { ready: true, solo: true },
            hide: false,
            content: { title: title, text: text },
            position: { my: 'top center', at: 'bottom center' },
            style: { classes: "qtip-bootstrap", tip: { corner: "top center" } }
        });
    }
}