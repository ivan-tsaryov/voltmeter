/**
 * Скрипт, выполняющий различное отображение на устройстве
 */

var timer = -1;


function Device() {
    this.number = 0; // Число для отображения на дисплее
    this.avp = false; // Переменная, показывающая включен АВП или нет
    this.limit = 4; // Предел измерения [1-5]
    this.unit = 2; // Единицы измерения [1-3]
    this.measurement = "Udc"; // Род работы
    this.sign = "plus"; // Знак числа
    this.overflow = false; // Переменная, показывающая переполнен индикатор или нет
    this.numDisplayed = false; // Переменная, показывающая отображено число или  нет

    this.getMeasurement = function() {
      return this.measurement;
    };
    /**
     * Установка числа для отображения на дисплее
     * @param value - число, которое нужно установить
     */
    this.setNumber = function(value) {
        if (value >= 0 || isNaN(value)) {
            this.sign = "plus";
        } else {
            this.sign = "minus";
        }
        if (this.unit == 1) {
            value = value*1000;
        } else if (this.unit == 3) {
            if (this.measurement == "R") {
                value = value / 1000;
            } else {
                $("[id*=limit]").filter(":visible").invisible();
                $("[id*=unit]").filter(":visible").invisible();

                this.unit = 2;
                this.limit = 5;
                $("#limit_" + this.limit).visible();
                $("#unit_" + this.unit).visible();
            }
        }
        this.number = value;
    };
}

/**
 * Включение вольтметра. Отображение стандартных параметров (род работы - U постоянное; на дисплее все цифры - нули;
 * знак минус; предел измерения 2000V; единицы измерения - кОм, В, мА).
 * Установка числа (если существует) для отображения на дисплее в соответствии с родом работы.
 */
Device.prototype.switchOn = function() {
    $("#switcher").visible();
    $("#led_Udc").visible();
    $("#num_5_0").visible();
    $("#num_4_0").visible();
    $("#num_3_0").visible();
    $("#num_2_0").visible();
    $("#sign_plus").visible();
    $("#limit_4").visible();
    $("#unit_2").visible();

    if (mode == "emulator") {
        this.setNumber(findNumber(this.measurement));
        isReady(this.measurement);
    }
};

/**
 * Выключение вольтметра. Сброс параметров (число на дисплее, режим АВП, предел измерения, единицы
 * измерения, род работы, знак, перегрузки нет.
 * Очистка таймера, учавствующего в отображении перегрузки.
 */
Device.prototype.switchOff = function() {
    $(".controllers, .indicators").filter(":visible").invisible();

    this.number = 0;
    this.avp = false;
    this.limit = 4;
    this.unit = 2;
    this.measurement = "Udc";
    this.sign = "plus";
    this.overflow = false;

    clearInterval(timer);
};

/**
 * Проверка, включен ли вольтметр.
 * @returns {jQuery} Если переключатель отображен, возвращается true;
 */
Device.prototype.isEnabled = function() {
    return $("#switcher").isVisible();
};

/**
 * Уменьшение предела измерения и корректировка отображения числа на дисплее
 * в соответствии с новым пределом.
 */
Device.prototype.reduceLimit= function() {
    var $button = $("#button_left");
    var $led = $("#led_left");

    $button.visible();
    $led.visible();

    setTimeout(function () {
        $button.invisible();
        $led.invisible();
    }, 150);

    if (!this.avp) {
        if (!this.overflow) {
            var limit = this.limit;
            var capableOverflow = false;
            if (limit > 1) {
                $("[id*=limit]").filter(":visible").invisible();

                this.limit = limit - 1;

                $("#limit_" + this.limit).visible();
            } else {
                if (this.number > 0 && this.numDisplayed) {
                    capableOverflow = true;
                }
                if (this.unit > 1) {
                    this.limit = 5;
                    this.unit = this.unit - 1;
                    this.resetDisplay();
                }
            }
            if (isReady(this.measurement)) {
                this.resetDisplay();
                this.showNumber(capableOverflow);
            }
        }
    }
};

/**
 * Увеличение предела измерения и корректировка отображения числа на дисплее
 * в соответствии с новым пределом.
 */
Device.prototype.increaseLimit = function() {
    var $button = $("#button_right");
    var $led = $("#led_right");

    $button.visible();
    $led.visible();

    setTimeout(function () {
        $button.invisible();
        $led.invisible();
    }, 150);

    if (!this.avp) {
        if (this.limit < 5) {
            $("[id*=limit]").filter(":visible").invisible();

            this.limit = this.limit + 1;

            $("#limit_" + this.limit).visible();
        } else {
            if (this.unit < 3) {
                if (this.unit == 2 && this.measurement != "R" && this.numDisplayed) {
                    return;
                }
                $("[id*=limit]").filter(":visible").invisible();
                $("[id*=unit]").filter(":visible").invisible();

                this.unit = this.unit + 1;
                this.number = this.number / 1000;

                if (Math.floor(this.number) == 1 || this.number == 0) {
                    this.limit = 1;
                } else {
                    this.limit = 2;
                }
                $("#limit_" + this.limit).visible();
                $("#unit_" + this.unit).visible();
            }
        }
        if (isReady(this.measurement)) {
            this.resetDisplay();
            this.showNumber2();
        }
    }
};

/**
 * Сброс дисплея прибора (отображение на дисплее 0000, отображения знака и предела в соответствии с текущими)
 */
Device.prototype.resetDisplay = function() {
    $("[id*=num]").filter(":visible").invisible();
    $("[id*=limit]").filter(":visible").invisible();
    $("[id*=sign]").filter(":visible").invisible();
    $("[id*=unit]").filter(":visible").invisible();

    $("#limit_"+this.limit).visible();
    if (this.measurement != "R") {
        $("#sign_" + this.sign).visible();
    }
    $("#unit_"+this.unit).visible();

    for (var i = 1; i <= 5; i++) {
        $("#num_"+i+"_0").visible();
    }
    this.numDisplayed = false;
};

/**
 * Переключение кнопки АВП
 */
Device.prototype.switchAVP = function() {
    var button = $("#button_avp");
    var led = $("#led_avp");

    button.visible();

    setTimeout(function() {
        button.invisible();
    }, 150);

    if (led.isVisible()) {
        led.invisible();
        this.avp = false;
    } else {
        led.visible();
        this.avp = true;
        if (isReady(this.measurement)) {
            this.autoLimitSelect();
            this.resetDisplay();
            this.showNumber(false);
        }
    }
};

/**
 * Переключение рода работы
 * @param measurement - род работы, который следует включить.
 */
Device.prototype.switchMeasure = function(measurement) {
    var button = $("#button_" + measurement);
    var led = $("#led_" + measurement);

    button.visible();

    setTimeout(function() {
        button.invisible();
    }, 150);

    var currentMeasurement = this.measurement;

    if (currentMeasurement != measurement) {
        $("#led_"+currentMeasurement).invisible();
        led.visible();

        this.resetDisplay();
        this.measurement = measurement;
        this.number = findNumber(this.measurement);
    }

    isReady(measurement);
};

/**
 * Подключение кабеля
 * @param name - кабель, который следует подключить.
 */
Device.prototype.plugWire = function(name) {
    var $element = $("#" + name);

    if ($element.isVisible()) {
        this.resetDisplay();
        $element.invisible();
    } else {
        if (name == "wire_UR") {
            if ($("#wire_I").isVisible()) {
                showWarning();
            } else {
                $element.visible();
            }
        } else if (name == "wire_I") {
            if ($("#wire_UR").isVisible()) {
                showWarning();
            } else {
                $element.visible();
            }
        } else {
            $element.visible();
        }
    }
    isReady(name);
};

/**
 * Показать на дисплее переполнение (мигающие нули)
 */
Device.prototype.showOverflow = function() {
    clearInterval(timer);
    timer = setInterval(function() {
        $("#num_2_0").imgToggle();
        $("#num_3_0").imgToggle();
        $("#num_4_0").imgToggle();
        $("#num_5_0").imgToggle();
    }, 100);
};

/**
 * Функция показывающая, уместиться ли данное число при данном пределе
 * @param number - число для проверки
 * @param limit - предел измерения
 * @returns {boolean} true, если умещается; false, если нет
 */
Device.prototype.isShowable = function(number, limit) {
    var number = Math.abs(number);

    if (number > 0.19999*Math.pow(10, limit) || (number < 1 && limit == 1)) {
        return false;
    } else {
        return true;
    }

};

/**
 * Функция для подготовки и проверки отображения числа ПОСЛЕ нажатия увеличения предела
 */
Device.prototype.showNumber2 = function() {
    $("[id*=sign]").filter(":visible").invisible();

    if (this.sign == "plus") {
        $("#sign_plus").visible();
    } else {
        $("#sign_minus").visible();
    }
    var limit = this.limit;
    var number = Math.abs(this.number);

    if (number > 0.19999*Math.pow(10,limit) || (number <= 1 && limit == 1 && number != 0)) {
        this.resetDisplay();
        clearInterval(timer);
        this.overflow = true;
        this.showOverflow();
    } else {
        this.overflow = false;
        clearInterval(timer);
        this.resetDisplay();
        this.indicateNumber(number);
    }
};

/**
 * Функция для подготовки и проверки отображения числа
 * @param capableOverflow - переменная, указывающая возможно ли переполнение
 */
Device.prototype.showNumber = function(capableOverflow) {
    $("[id*=sign]").filter(":visible").invisible();

    if (this.avp) {
        this.autoLimitSelect();
    }

    var number = this.number;

    if (this.sign == "plus") {
        $("#sign_plus").visible();
    } else {
        $("#sign_minus").visible();
    }

    var limit = this.limit;

    number = Math.abs(number);
    if (number > 0.19999*Math.pow(10,limit) || (number <= 1 && limit == 1 && number != 0) || capableOverflow) {
        if (this.unit > 1) {
            if (this.isShowable(number*1000, 5)) {
                $("[id*=unit]").filter(":visible").invisible();
                this.unit = this.unit - 1;
                $("#unit_"+this.unit).visible();

                $("[id*=limit]").filter(":visible").invisible();
                this.limit = 5;
                $("#limit_"+this.limit).visible();

                this.number = this.number*1000;
                this.overflow = false;
                clearInterval(timer);
                this.resetDisplay();
                this.indicateNumber(this.number);
            } else {
                this.resetDisplay();
                this.overflow = true;
                this.showOverflow();
            }
        } else {
            this.resetDisplay();
            this.overflow = true;
            this.showOverflow();
        }
    } else {
        this.overflow = false;
        clearInterval(timer);
        this.resetDisplay();
        this.indicateNumber(number);
    }
};

/**
 * Функция, отображающаяя число
 * @param number - число, которое следует отобразить
 */
Device.prototype.indicateNumber = function(number) {
    if (!isNaN(number)) {
        var number = number.toString();

        number = (number[0] == "-") ? number.replace("-", "") : number;

        var integer = number.split(/[,.]/)[0];
        var fractional = number.split(/[,.]/)[1];

        if (fractional === undefined)
            fractional = "";

        var index = this.limit - integer.length + 1;

        for (var i = 0; i < integer.length; i++) {
            $("[id*=num_" + index + "]").filter(":visible").invisible();
            $("#num_" + index + "_" + integer[i]).visible();
            index++;
        }
        index = this.limit + 1;
        for (var j = 0; j < 5 - this.limit; j++) {
            $("[id*=num_" + index + "]").filter(":visible").invisible();

            if (fractional[j] === undefined || fractional === undefined) {
                $("#num_" + index + "_" + 0).visible();
            } else {
                $("#num_" + index + "_" + fractional[j]).visible();
            }
            index++;
        }
        this.numDisplayed = true;
    }
};

/**
 * Функция, которая ищет значение в соответствии с установленным родом работы
 * @param measurement - род работы
 * @returns {*} Вовзращается значение
 */
function findNumber(measurement) {
    switch (measurement) {
        case "Udc":
            return parseFloat(Udc);
        case "Uac":
            return parseFloat(Uac);
        case "R":
            return parseFloat(R/1000);
        case "Idc":
            return parseFloat(Idc)*1000;
        case "Iac":
            return parseFloat(Iac)*1000;
    }
}

/**
 * Функция, проверяющая готов ли прибор (отображены ли элементы) к показанию числа на приборе.
 * Т.е. при измерении напряжения должны быть отображены (#led_Udc, #wire_Ur, #wire_0)
 * @param name Переменная, которая показывающая элемент, который был последнжим отображенным на данный момент.
 * @returns {boolean} - true, если прибор готов отобразить число; false, если не готов.
 */
function isReady(name) {
    if (["Udc", "wire_UR", "wire_0"].indexOf(name) != -1) {
        var $measurement = $("#led_Udc");
        var $wire_UR = $("#wire_UR");
        var $wire_0 = $("#wire_0");

        if ($measurement.isVisible() && $wire_UR.isVisible() && $wire_0.isVisible()) {
            device.setNumber(parseFloat(Udc));
            device.resetDisplay();
            device.showNumber(false);
            return true;
        }
    }
    if (["Uac", "wire_UR", "wire_0"].indexOf(name) != -1) {
        var $measurement = $("#led_Uac");
        var $wire_UR = $("#wire_UR");
        var $wire_0 = $("#wire_0");

        if ($measurement.isVisible() && $wire_UR.isVisible() && $wire_0.isVisible()) {
            device.setNumber(parseFloat(Uac));
            device.resetDisplay();
            device.showNumber(false);
            return true;
        }
    }
    if (["R", "wire_UR", "wire_0"].indexOf(name) != -1) {
        var $measurement = $("#led_R");
        var $wire_UR = $("#wire_UR");
        var $wire_0 = $("#wire_0");

        if ($measurement.isVisible() && $wire_UR.isVisible() && $wire_0.isVisible()) {
            device.setNumber(parseFloat(R)/1000);
            device.resetDisplay();
            device.showNumber(false);
            return true;
        }
    }
    if (["Idc", "wire_I", "wire_0"].indexOf(name) != -1) {
        var $measurement = $("#led_Idc");
        var $wire_I = $("#wire_I");
        var $wire_0 = $("#wire_0");

        if ($measurement.isVisible() && $wire_I.isVisible() && $wire_0.isVisible()) {
            device.setNumber(parseFloat(Idc)*1000);
            device.resetDisplay();
            device.showNumber(false);
            return true;
        }
    }
    if (["Iac", "wire_I", "wire_0"].indexOf(name) != -1) {
        var $measurement = $("#led_Iac");
        var $wire_I = $("#wire_I");
        var $wire_0 = $("#wire_0");

        if ($measurement.isVisible() && $wire_I.isVisible() && $wire_0.isVisible()) {
            device.setNumber(parseFloat(Iac)*1000);
            device.resetDisplay();
            device.showNumber(false);
            return true;
        }
    }
    return false;
}

/**
 * Функция автоматического выбора пределов
 */
Device.prototype.autoLimitSelect = function() {
    var number = this.number;

    if (this.unit == 1) {
        number = number/1000;
    } else if (this.unit == 3) {
        number = number*1000;
    }

    for (var i = 1; i <= 5; i++) {
        if (this.isShowable(number*1000, i)) {
            this.limit = i;
            this.unit = 1;
            this.setNumber(number);
            return;
        }
    }

    for (var i = 1; i <= 5; i++) {
        if (this.isShowable(number, i)) {
            this.limit = i;
            this.unit = 2;
            this.setNumber(number);
            return;
        }
    }
    if (this.measurement == "R") {
        for (var i = 1; i <= 5; i++) {
            if (this.isShowable(number/1000, i)) {
                this.limit = i;
                this.unit = 3;
                this.setNumber(number);
                return;
            }
        }
    }
};

/**
 * Функция, показывающая предупреждение при подключении одновременно проводов U,R и I
 */
function showWarning() {
    $("#device").qtip({
        show: { ready: true },
        content: { text: 'Провода для измерения напряжений' +
        ' и для измерения токов не должны быть одновременно подключены!' },
        hide: { fixed: true, delay: 3000 },
        position: { my: 'center center', at: 'center center' },
        style: { classes: "qtip-bootstrap", tip: false }
    });

    setTimeout(function() {
        $('.qtip').qtip('destroy', true);
    }, 3000);
}