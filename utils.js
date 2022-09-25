// EasyDate类作为原生Date类的加强封装版本
// 需求能够完成向下兼容Date类，Date类的实例对象可以直接使用easyDate进行包装
// offset初始日期偏移量/日期
// options扩展的定制化功能

const DEFAULT_FORTMAT = 'yyyy-mm-dd';
const UNIT_TYPE = {
    'm': 'Month',
    'd': 'Day',
    'y': 'FullYear'
}
class EasyDate {
    constructor(offset, options) {
        let date = EasyDate.isDate(offset);

        if (date) {
            this.base = new Date();
        }
        if (offset instanceof Date) {

            this.base = new Date(offset);
        }

        this.format = options.format || DEFAULT_FORTMAT;
    }

    resetTime() {
        this.base.setHours(0);
        this.base.setMinutes(0);
        this.base.setSeconds(0);
        this.base.setMilliseconds(0);
    }

    static toDouble(num) {
        return String(num)[1] && String(num) || '0' + num;
    }

    static format(date = new Date(), format = DEFAULT_FORTMAT) {

        let regMap = {
            'y': date.getFullYear(),
            'm': EasyDate.toDouble(date.getMonth() + 1),
            'd': EasyDate.toDouble(date.getDate() + 1)
        }
        return Object.entries(regMap).reduce((acc, [reg, value]) => {
                return acc.replace(new RegExp(`${reg}+`, 'gi'), value)
            }, format)
            // return format.replace(/y+/gi, () => {
            //     return date.getFullYear();
            // }).replace(/m+/gi, () => {
            //     return EasyDate.toDouble(date.getMonth() + 1);
            // }).replace(/d+/gi, () => {
            //     return EasyDate.toDouble(date.getDate())
            // })
    }


    //  /(\d{4})[-|//\/\:](\d{2})[-|//\/\:](\d{2})/
    static isDate(dateStr, format = DEFAULT_FORTMAT) {
        if (!dateStr) {
            return EasyDate.format(new Date(), format)
        }

        if (dateStr instanceof EasyDate || dateStr instanceof Date) {
            return dateStr
        }
        let pos = [];
        let regExps = [/d+/gi, /y+/gi, /m+/gi, ];
        regExps.forEach(regExp => {
            format = format.replace(regExp, match => {
                return `(\\d{${match.length}})`
            })
        })

        //  2020-09-08  2020|09|08  2020/09/08    2020:09:08
        format = format.replace(/-/gi, "\[-|//\/\:\]");

        const regExp = new RegExp(`^${format}$`);
        return dateStr.replace(/[-|//\/\:]/gi, '-').replace(/(\d{2,4})-(\d{1,})-(\d{1,})/g, function(item, $1, $2, $3) {
            return `${$1.length==4&&$1||('20'+$1).substr(-4)}-${EasyDate.toDouble($2)}-${EasyDate.toDouble($3)}`
        })
    }


    isGreateOrEqual(date) {
        if (!date) {
            return false
        }

        date = date instanceof EasyDate ? date : new EasyDate(date, { format: DEFAULT_FORTMAT });
        return this.toString() >= date.toString();

    }

    toString() {
        return EasyDate.format(this.base, this.format)
    }

    setDate(date) {
        this.base.setDate(date)
    }

    getDate() {
        return this.date;
    }

    getDay() {
        return this.date.getDay();
    }

    getFirstDayOfThisMonth() {
        // 用当前日期EasyDate对象克隆副本
        let date = this.clone();
        date.setDate(1);

        return date.getDay()

    }

    clone() {
        return new EasyDate(this.base, {
            format: this.format
        })
    }

    isLeapYear(year) {
        if (!year || year <= 1900) {
            return false
        }

        if (year % 100 === 0) {
            return year % 400 === 0;
        }

        return year % 4 === 0;
    }
    static getDates(date, today = this, start = today, end = null, format = DEFAULT_FORTMAT) {
        let month = date.getMonth();

        today = (!(today instanceof EasyDate)) && new EasyDate(today);
        start = start && new EasyDate(start)
        date = end && new Date(end); //做一次日期对象拷贝
        date.setDate(1); //设置日期为当月第一天
        let dates = []; //存放每一天
        // 解决核心 date对象 setDate的值 如果超过了当月最后一天date会直接变成下个月的第n天
        // 例如 date 10.1
        //  date.setDate(34)=>date:11.3

        // date设置为当月1号
        // 循环条件(date.getMonth()===month)
        while (date.getMonth() === month) {
            let label = EasyDate.format(date, format);
            dates.push({
                date: label.substr(0, 10), //2020-10-10截取有效字符
                today: today && today.toString() === label, //对比格式化后字符串
                disabled: (start && label > start.toString()) && (end ? label < end.toString() : true)
            })

            date.setDate(date.getDate() + 1);
        }
    }
    toObject(today, start, end) {
        const month = this.base.getMonth();
        return {
            year: this.base.getFullYear(),
            month: EasyDate.toDouble(month + 1),
            empty: this.getFirstDayOfThisMonth(),
            days: EasyDate.getDates(this.base, today, start, end, this.format)
        }
    }


    transDate(offset) {
        offset = EasyDate.parse(offset);
        if (!offset) {
            return false;
        }


        for (let key in offset) {
            if (offset.hasOwnProperty(key)) {
                let type = UNIT_TYPE[key];
                this.base[`set${type}`](this.base[`get${type}`]() + offset[key])
            }
        }
    }

    //  "+1M","+1D,"+8d","-10m"
    static parse(offset) {
        if (!offset) {
            return false
        }

        offset = offset.toLowerCase();

        let result = {};

        offset.replace(/([+-]?\d+)(ymd)/g, (m, number, unit) => {
            result[unit] = Number(num)
        });

        return result;
    }

}