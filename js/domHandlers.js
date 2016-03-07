/**
 * Скрипт, который содержит обработчиков кликов по html-элементам
 */

/**
 * Функция, которая устанавливает значения, введенные в таблице во вкладке "Входные сигналы"
 */
function setValues() {
    var $tr = $(this).parent().find("input:checked").closest("tr");
    var classname = $tr.prop("class");

    if (classname == "fields") {
        var $input_field = $tr.find("input");
        Udc = $input_field.eq(1).val();
        Uac = $input_field.eq(2).val();
        R = $input_field.eq(3).val();
        Idc = $input_field.eq(4).val();
        Iac = $input_field.eq(5).val();
    } else {
        var $input_td = $tr.find("td");
        Udc = $input_td.eq(1).text();
        Uac = $input_td.eq(2).text();
        R = $input_td.eq(3).text();
        Idc = $input_td.eq(4).text();
        Iac = $input_td.eq(5).text();
    }
    if ([Udc, Uac, R, Idc, Iac].allValuesIsEmpty()) {
        $(this).qtip({
            show: { ready: true },
            content: { text: 'Задайте хотя бы один параметр!' },
            hide: { fixed: true, delay: 2000 },
            position: { my: 'left center', at: 'right center' },
            style: { classes: "qtip-bootstrap", tip: { corner: "left center" } }
        });

        setTimeout(function() {
            $('.qtip').qtip('destroy', true);
        }, 2000);
    } else {
        $(this).qtip({
            show: { ready: true },
            content: { text: 'Значения заданы' },
            hide: { fixed: true, delay: 2000 },
            position: { my: 'left center', at: 'right center' },
            style: { classes: "qtip-bootstrap", tip: { corner: "left center" } }
        });

        if (device.isEnabled() && isReady(device.getMeasurement())) {
            device.setNumber(findNumber(device.getMeasurement()));
            device.showNumber(false);
        }

        setTimeout(function() {
            $('.qtip').qtip('destroy', true);
        }, 2000);
    }
}

/**
 * Функция, которая устанавливает значения, введенные в режимах обучения и контроля и переходит к следующему шагу
 */
function nextStep() {
    var $tr = $(this).parent().find("input:checked").closest("tr");
    var classname = $tr.prop("class");

    if (classname == "fields") {
        var $input_field = $tr.find("input");
        Udc = $input_field.eq(1).val();
        Uac = $input_field.eq(2).val();
        R = $input_field.eq(3).val();
        Idc = $input_field.eq(4).val();
        Iac = $input_field.eq(5).val();
    } else {
        var $input_td = $tr.find("td");
        Udc = $input_td.eq(1).text();
        Uac = $input_td.eq(2).text();
        R = $input_td.eq(3).text();
        Idc = $input_td.eq(4).text();
        Iac = $input_td.eq(5).text();
    }
    if (!isNeededExist(training.getCurrent())) {
        $(this).qtip({
            show: { ready: true },
            content: { text: 'Задайте измеряемую величину!' },
            hide: { fixed: true, delay: 2000 },
            position: { my: 'left center', at: 'right center' },
            style: { classes: "qtip-bootstrap", tip: { corner: "left center" } }
        });

        setTimeout(function() {
            $('.qtip').qtip('destroy', true);
        }, 2000);
    } else {
        $(this).button("disable");
        training.setState(1);
        training.setValue();

        $("html, body").animate({ scrollTop: 0 }, 500);

        training.nextState();
    }
}

/**
 * Функция инициализирующая упражнение (отображение заголовков, выбор состояний)
 */
function initExercise() {
    training = new Training($(this).attr("id"));
    var current = training.getCurrent();
    var $exercises_header = $("#exercises_header");
    var $next_step = $(".nextStep");

    var array = [["table", "switcher", "button_Udc", "wire_UR", "wire_0"],
        ["table", "switcher", "button_Uac", "wire_UR", "wire_0"],
        ["table", "switcher", "button_R", "wire_UR", "wire_0"],
        ["table", "switcher", "button_Idc", "wire_I", "wire_0"],
        ["table", "switcher", "button_Iac", "wire_I", "wire_0"]
    ];

    if (mode == "training") {
        $("#map").find("area").off("click").on("click", trainingController);
    } else if (mode == "control") {
        $("#map").find("area").off("click").on("click", oversightController);
    }

    if (device.isEnabled())
        device.switchOff();

    $exercises_header.click();
    $exercises_header.find("span").text("Выбранное упражнение: "+current);

    $exercises_header = $("#selected_exercise_header");
    training.setName($(this).text());
    $exercises_header.find("span").text($(this).text());
    $exercises_header.show();
    $exercises_header.click();

    $("#tab-1").find(".ex_content").hide();
    $("[data-name="+current+"]").show();

    $next_step.button("enable");
    $next_step.off('click').on('click', nextStep);

    training.setStates(getRow(array,current-1));
    training.nextState();
}

/**
 * Выбор состояний в соответствии с упражнением
 * @param matrix - массив массивов состояний
 * @param col - номер упражнения
 * @returns {Array} - массив состояний
 */
function getRow(matrix, col){
    var column = [];
    for(var i = 0; i < matrix.length; i++){
        column.push(matrix[col][i]);
    }
    return column;
}

/**
 * Функция, проверяюшая пуст ли ПОЛНОСТЬЮ массив
 * @returns {boolean} true, если пуст; false, если нет
 */
Array.prototype.allValuesIsEmpty = function () {
    for (var i = 0; i < this.length; i++) {
        if (this[i] != "") return false;
    }
    return true;
}

/**
 * Функция, проверяющая заполнено ли нужное поле в соответствии с упражнением
 * @param needed - id упражнения
 * @returns {boolean} true, если заполнено; false, если нет
 */
function isNeededExist(needed) {
    switch (needed) {
        case "1":
            if (Udc != 0) {
                return true;
            }
            return false;
        case "2":
            if (Uac != 0) {
                return true;
            }
            return false;
        case "3":
            if (R != 0) {
                return true;
            }
            return false;
        case "4":
            if (Idc != 0) {
                return true;
            }
            return false;
        case "5":
            if (Iac != 0) {
                return true;
            }
            return false;
    }
}