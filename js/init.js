/**
 * Скрипт, который содержит функции, выполняющиеся при загрузке и после загрузки страницы
 */

var device = null, training = null;

$(document).ready(function() {
    // Создание вкладок с помощью JQueryUI
    $('#tabs').tabs({ heightStyle: "auto" });

    // Создание меню "аккордеон" у блоков
    $("#tab-1, #tab-2, #docs").accordion({
        heightStyle: "content",
        collapsible: true,
        active: false,
        animate: 300,
        icons: { "header": "ui-icon-triangle-1-e", "activeHeader": "ui-icon-triangle-1-s" }
    });
    $("#tab-1, #tab-2").accordion({ active: 0});

    $("body").find("button").button();

    // Задание слушателей для элементов
    $("#map").find("area").on("click", emulatorController);
    $("#mode_list").find('input').on("click", modeController);
    $("#previous").on("click", previousTip);
    $("#next").on("click", nextTip);
    $("#setValues").on("click", setValues);
    $("#setValues").button("enable");

    // Фильтр вводимых значений в поля ввода значений (разрешаются только числа и точка)
    $('.fields').find("input").keyup(function(){
        var val = $(this).val();
        if(isNaN(val)){
            val = val.replace(/[^0-9\.-]/g,'');
            if(val.split('.').length > 2)
                val = val.replace(/\.+$/,"");
        }
        $(this).val(val);
    });
    device = new Device();
});

$(window).load(function() {
    // Коррекция координат контроллеров прибора в соответствии с разрешением экрана (разрешением уменьшенного изображения)
    $('#map').find('area').each(function() {
        var $img = $("#device");
        var height = $img.height();

        var orig_coords = $(this).attr('orig-coords');
        if (!orig_coords) {
            orig_coords = $(this).attr('coords');
            $(this).attr('orig-coords', orig_coords);
        }
        var scale = height / 456;
        $(this).attr('coords', orig_coords.split(',').map(function(x) {
            return Math.round(x * scale)
        }).join(','));
    });

    // Загрузка документации в блок документации"
    $("#part1").load("docs/Назначение.htm");
    $("#part2").load("docs/Комплект%20поставки.htm");
    $("#part3").load("docs/Технические%20данные.htm");
    $("#part4").load("docs/Общие%20указания%20по%20эксплуатации.htm");
    $("#part5").load("docs/Меры%20предосторожности.htm");
    $("#part6").load("docs/Подготовка%20к%20работе.htm");
    $("#part7").load("docs/Порядок%20работы%20.htm");
});