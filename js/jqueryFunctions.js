/**
 * Скрипт, содержащий фнкции для элементов jQuery
 */

/**
 * Функция отображающая элемент jQuery
 * @returns {*}
 */
jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

/**
 * Функция скрывающая элемент jQuery
 * @returns {*}
 */
jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};

/**
 * Функция проверяющая, отображен ли элемент jQuery
 * @returns {*}
 */
jQuery.fn.isVisible = function() {
    return this.css('visibility') == 'visible';
};

/**
 * Функция которая, если скрыт элемент, то отображает его,
 * а если отображен - скрывает.
 */
jQuery.fn.imgToggle = function() {
    if (this.css('visibility') == 'visible')
        this.css('visibility', 'hidden');
    else
        this.css('visibility', 'visible');
};

/**
 * Функция выделяюая жирным элемент li в упражнении
 * @param index - индекс, выделяемого элемента
 */
jQuery.fn.highlightStep = function(index) {
    if (mode == "training") {
        this.css('font-weight', 'normal');
        this.eq(index).css('font-weight', 'bold');
    }
};