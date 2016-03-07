/**
 * Скрипт, который содержит функции для работы с режимами
 */

var mode = "emulator"; // Переменная, содержащая текущий включенный режим

/**
 * Функция, обрабатывающая нажатие по выбору режима
 */
function modeController () {
    var name = $(this).attr("data-name");
    var $map = $("#map");
    var $header = $("#mode_header");
    var $exercises = $("#exercises");
    var $exercises_header = $('#exercises_header');
    var $setValues = $("#setValues");

    switch (name) {
        case "emulator":
            resetMode(mode);
            mode = name;

            $map.find("area").off("click").on("click", emulatorController);
            $header.find("span").text("Текущий режим: Режим эмулятора");
            break;
        case "help":
            resetMode(mode);
            mode = name;

            $map.find("area").off("click").on("click", helpController);
            $map.find("area").off("click").on("click", helpController);

            $header.find("span").text("Текущий режим: Режим справки");

            $("#help").show();
            $("#help_header").show();
            $('#docs_header').show();
            $("#device").maphilight({
                alwaysOn: true
            });
            break;
        case "training":
            resetMode(mode);
            mode = name;

            $exercises.find("button").on("click", initExercise);
            $header.find("span").text("Текущий режим: Режим обучения");

            $setValues.button("disable");
            $exercises_header.show();
            break;
        case "control":
            resetMode(mode);
            mode = name;

            $exercises.find("button").on("click", initExercise);
            $header.find("span").text("Текущий режим: Режим контроля");
            $setValues.button("disable");

            $exercises_header.show();
            break;
    }
}

/**
 * Функция сброса режима
 * @param mode - режим, который нужно сбросить
 */
function resetMode (mode) {
    var $header = $( "#exercises_header");
    var $ex_header = $("#selected_exercise_header");
    var $device = $("#device");
    var $setValues = $("#setValues");

    switch(mode) {
        case "emulator":
            if (device != null)
                device.switchOff();
            break;
        case "help":
            $("#help").hide();
            $("#help_header").hide();
            $('#docs_header').hide();
            removeTips(getState());

            $device.maphilight({ neverOn: true });
            break;
        case "training":
            if (device.isEnabled()) {
                device.switchOff();
            }
            $ex_header.hide();
            $header.hide();
            $header.find("span").text("Упражнения");

            $setValues.button("enable");

            $device.maphilight({ neverOn: true });
            $("area").on("mouseout").on("mouseover");
            break;
        case "control":
            if (device.isEnabled()) {
                device.switchOff();
            }
            $ex_header.hide();
            $header.hide();
            $header.find("span").text("Упражнения");
            $setValues.button("enable");
            break;
    }
}