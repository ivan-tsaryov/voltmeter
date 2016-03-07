/**
 * ������, ���������� ������ ��� ��������� jQuery
 */

/**
 * ������� ������������ ������� jQuery
 * @returns {*}
 */
jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

/**
 * ������� ���������� ������� jQuery
 * @returns {*}
 */
jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};

/**
 * ������� �����������, ��������� �� ������� jQuery
 * @returns {*}
 */
jQuery.fn.isVisible = function() {
    return this.css('visibility') == 'visible';
};

/**
 * ������� �������, ���� ����� �������, �� ���������� ���,
 * � ���� ��������� - ��������.
 */
jQuery.fn.imgToggle = function() {
    if (this.css('visibility') == 'visible')
        this.css('visibility', 'hidden');
    else
        this.css('visibility', 'visible');
};

/**
 * ������� ��������� ������ ������� li � ����������
 * @param index - ������, ����������� ��������
 */
jQuery.fn.highlightStep = function(index) {
    if (mode == "training") {
        this.css('font-weight', 'normal');
        this.eq(index).css('font-weight', 'bold');
    }
};