/**
 * Функция, которая содержит функции для работы в режиме обучения и контроля
 */

var Udc = 0, Uac = 0, R = 0, Idc= 0, Iac = 0; // Измеряемые значения

function Training(exercise_num) {
    this.state = 0; // Текущее состояние упражнения
    this.current = exercise_num; // Текущее упражнение
    this.states = null; // Массив состояний
    this.value = 0; // Измеряемое значение
    this.attempts = 5; // Количество попыток
    this.name = ""; // Имя упражнения

    this.setStates = function (array) {
        this.states = array;
    };
    this.getStates = function () {
      return this.states;
    };
    this.getState = function () {
        return this.state;
    };
    this.setState = function (value) {
        this.state = value;
    };
    this.setName = function (value) {
        this.name = value;
    };
    this.getCurrent = function () {
        return this.current;
    };
    this.getAttemptsCount = function () {
      return this.attempts;
    };
    /**
     * Функция устанавливает значение в соответствии с выбранным упражнением
     */
    this.setValue = function() {
        var num = this.current;
        switch (num) {
            case "1":
                this.value = Udc;
                break;
            case "2":
                this.value = Uac;
                break;
            case "3":
                this.value = R/1000;
                break;
            case "4":
                this.value = Idc * 1000;
                break;
            case "5":
                this.value = Iac * 1000;
                break;
        }
    };
}

/**
 * Функция, уменьшающая количество попыток
 */
Training.prototype.reduceAttemptsCount = function() {
    this.attempts = this.attempts - 1;
};

/**
 * Функция перехода к следующему состоянию упражнения
 */
Training.prototype.nextState = function() {
    var $content = $("#tab-1").find("[data-name="+this.current+"]").find("li");
    var $area = $("area");
    var element = this.states[this.state];
    var text;

    $area.on("mouseout").on("mouseover");

    // Подсвечивание зоны карты изображения цветом
    if (mode == "training" && element != "table") {
        $("#device").maphilight();
        $area.not("[data-name="+element+"]").mouseout();
        $("[data-name="+element+"]").mouseover();
        $area.off("mouseout").off("mouseover");
    }
    switch (this.state) {
        case 0:
            $content.highlightStep(0);
            break;
        case 1:
            $content.highlightStep(1);
            text = $content.eq(1).find("span").text();
            this.showChallenge(text);

            if (mode == "control") {
                $("body").qtip(
                    {
                        show: {ready: true},
                        hide: false,
                        content: {title: this.name, text: "Выполните необходимые действия. Обратите внимание, " +
                        "что количество попыток ограничено."},
                        position: {my: 'top center', at: 'top center'},
                        style: {classes: "qtip-bootstrap", tip: false}
                    });
            }
            break;
        case 2:
            text = $content.eq(2).find("span").text();
            this.showChallenge(text);
            $content.highlightStep(2);
            break;
        case 3:
            text = $content.eq(3).find("span").text();
            this.showChallenge(text);
            $content.highlightStep(3);
            break;
        case 4:
            text = $content.eq(4).find("span").text();
            this.showChallenge(text);
            $content.highlightStep(4);
            break;
        case 5:
            var message = null;

            if (mode == "training") {
                message = 'Обучение пройдено успешно! Если требуется, скорректируйте предел измерения.';
            } else if (mode == "control") {
                message = 'Упражнение выполнено успешно! Если требуется, скорректируйте предел измерения.';
            }
            if (training.getAttemptsCount() == 0) {
                message = 'Попытки закончились, задание провалено!';
                $area.off('click');
                if (device.isEnabled()) {
                    device.switchOff();
                }
            } else {
                $area.off('click').on("click", emulatorController);
                device.setNumber(this.value);
                device.showNumber(false);
            }
            $content.eq(4).css('font-weight', 'normal');

            $("#container").qtip('destroy', true).qtip(
                {
                    show: { solo: true, ready: true },
                    content: { text: message },
                    hide: { fixed: true, delay: 2000 },
                    position: { my: 'top center', at: 'center center' },
                    style: { classes: "qtip-bootstrap", tip: false }
                });
            setTimeout(function () {
                $(".qtip").qtip('destroy', true);
            }, 2000);
            break;
    }
};

/**
 * Функция, показывающая подсказку (что нужно сделать)
 * @param text - что нужно сделать
 */
Training.prototype.showChallenge = function(text) {
    if (mode == "training") {
        $("body").qtip("destroy", true).qtip(
            {
                show: {ready: true},
                hide: false,
                content: {title: this.name, text: text},
                position: {my: 'top center', at: 'top center'},
                style: {classes: "qtip-bootstrap", tip: false}
            });
    }
};
