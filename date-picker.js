class DatePicker {
    constructor(target, wrap, options, callback) {
        if (!target) {
            return this.showError();
        }
        this.wrap = $(wrap) || $('.date-picker-wrap');
        this.options = options;
        this.target = $(target);
        this.tempPicker = "picker";
        this.tempCalendar = "calendar";
        this.init()
        this.createPickerPage();
    }

    eventAgent() {
        this.target.on('focus', (e) => {
            //input聚焦的时候，如果页面焦点切换，重新切回页面的时候，就会重复触发input的focus聚焦的时候，主动失去焦点,此时必须加e.target.blur()
            e.target.blur();
            this.initPickerView();
        })
    }

    addLastMonth() {
        this.current.transDate('-1m');
        this.prependToContainer(this.createMonthElement());
    }

    initPickerView() {
        this.today = new EasyDate();
        this.start = this.options.start ? new EasyDate(this.options.start) : this.today;
        this.end = this.options.end ? new EasyDate(this.options.end) : null;

        this.current = this.today.clone();

        this.current.setDate(1);
        this.createPickerPage();
        this.createMonthElement();
        this.current.transDate('+1m');
        this.appendToContainer(this.createMonthElement());
        this.showPicker();
    }


    init() {
        this.initWrap();
        this.eventAgent();


    }
    createPickerPage() {
        let $pickerHtml = $(this.getTemplate(this.tempPicker, {}));
        this.$container = $pickerHtml.find('.dp-conatiner');
        this.wrap.append($pickerHtml);

    }

    appendToContainer(calendarHtml) {
        this.$container.append(calendarHtml)
    }
    prependToContainer(calendarHtml) {
        this.$container.prepend(calendarHtml)
    }




    showPicker() {
        this.wrap.addClass('show')
    }

    hidePicker() {
        this.wrap.removeClass('show')
    }


    createMonthObject(current, today, start, end) {
        return current.toObject(today, start, end)
    }
    createMonthElement() {
        let month = this.createMonthObject(this.current, this.today, this.start, this.end);

        let calendarHtml = this.getTemplate(this.tempCalendar, {
            month
        });

        return calendarHtml
    }

    getTemplate(templateId, date) {
        return template(templateId, date) //根据模版渲染相关的内容
    }


    showError() {
        return '请传参设置目标日期input'
    }

    initWrap() {
        let $wrap = $(this.wrap);
        let isWrap = $wrap.hasClass('date-picker-wrap');
        isWrap || $wrap.addClass('date-picker-wrap')
    }
}