/**
 * Скрипт, который содержит в себе обработчиков разных режимов
 */

var tipTimer;

/**
 * Функция, обрабатывающая нажатие по прибору в режиме эмулятора
 */
function emulatorController() {
    var name = $(this).attr("data-name");

    if (name == "switcher") {
        if (device.isEnabled())
            device.switchOff();
        else
            device.switchOn();
    } else if (name.indexOf("left") != -1) {
        device.reduceLimit();
    } else if (name.indexOf("right") != -1) {
        device.increaseLimit();
    } else if (name.indexOf("avp") != -1) {
        device.switchAVP();
    } else if (name.indexOf("button") != -1) {
        device.switchMeasure(name.replace("button_", ""));
    } else if (name.indexOf("wire") != -1) {
        device.plugWire(name);
    }
}

/**
 * Функция, обрабатывающая нажатия по прибору в режиме справки
 */
function helpController() {
    var index = $("#map").find("area").index($(this));

    removeTips();
    setState(index);
    guide(index);
}

/**
 * Функция, обрабатывающая нажатия по прибору в режиме обучения
 */
function trainingController() {
    var element = $(this).attr("data-name");

    var states = training.getStates();

    var index = states.indexOf(element);
    var state = training.getState();

    if (index == state) {
        if (element == "switcher")
            device.switchOn();
        else if (element.indexOf("button") != -1) {
            device.switchMeasure(states[2].replace("button_", ""));
        }
        else
            $("#"+element).visible();

        training.setState(state+1);
        training.nextState();
    } else if (index == -1 || index > state) {
        $("[data-name="+element+"]").qtip({
            show: { ready: true },
            content: { text: 'Вы ошиблись. Будьте внимательны' },
            hide: { fixed: true, delay: 2000 },
            position: { my: 'top center', at: 'bottom center' },
            style: { classes: "qtip-bootstrap", tip: { corner: "top center" } }
        });
        setTimeout(function() {
            $("[data-name="+element+"]").qtip('destroy', true);
        }, 2000);
    } else if (index < state) {
        var $element = $("#"+element);
        if ($element.isVisible()) {
            if (element == "switcher") {
                device.switchOff();
            } else {
                $element.invisible();
            }
            training.setState(states.indexOf(element));

            for (var i = index; i < states.length; i++)
                $("#"+states[i]).invisible();

            training.nextState();
        }
    }
}

/**
 * Функция, обрабатывающая нажатия по прибору в режиме контроля
 */
function oversightController() {
    var controller = $(this).attr("data-name");
    var $controller = $("#"+controller);

    var states = training.getStates();

    var index = states.indexOf(controller);
    var state = training.getState();

    if (index == state) {
        if (controller == "switcher")
            device.switchOn();
        else if (controller.indexOf("button") != -1) {
            device.switchMeasure(states[2].replace("button_", ""));
        }
        else
            $controller.visible();

        training.setState(state+1);
        training.nextState();
    } else if (index == -1 || index > state) {
        var message;
        training.reduceAttemptsCount();

        if (training.getAttemptsCount() > 0) {
            message = 'Вы ошиблись. Будьте внимательны. Осталось попыток: ' + training.getAttemptsCount();
        } else {
            training.setState(5);
            training.nextState();
        }

        clearTimeout(tipTimer);
        $("#device").qtip('destroy', true).qtip(
            {
                show: { ready: true },
                content: { text: message },
                hide: { fixed: true, delay: 2000 },
                position: { my: 'top center', at: 'center center' },
                style: { classes: "qtip-bootstrap", tip: false }
            });
        tipTimer = setTimeout(function() {
            $("#device").qtip('destroy', true);
        }, 2000);
    } else if (index < state) {
        if ($controller.isVisible()) {
            if (controller == "switcher") {
                device.switchOff();
            } else {
                $controller.invisible();
            }
            training.setState(states.indexOf(controller));

            for (var i = index; i < states.length; i++)
                $("#"+states[i]).invisible();

            training.nextState();
        }
    }
}