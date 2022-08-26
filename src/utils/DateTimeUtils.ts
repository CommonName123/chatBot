/**
 * Вывести всю строку формата "Вы отслеживаете канал уже AA лет BB месяцев CC дней DD часов EE минут"
 * @param startFollowDate - дата, когда человек нажал Follow
 * @returns {string}
 */
function calculatePeriod(startFollowDate: Date) {
    const newDate = new Date();
    const timeZoneOffset = newDate.getTimezoneOffset();
    const difference = newDate.getTime() - startFollowDate.getTime();

    const offsetInMs = timeZoneOffset * 60 * 1000;
    const dateFrom70 = new Date(difference + offsetInMs);


    let result = 'Вы отслеживаете канал уже ';
    const year = dateFrom70.getFullYear() - 1970;
    if (year > 0) {
        result += year + calculateYear(year);
    }

    const month = dateFrom70.getMonth();
    if (month > 0) {
        result += month + calculateMonth(month);
    }

    const date = dateFrom70.getDate();
    if (date > 1) {
        result += date + calculateDay(date);
    }
    const hours = dateFrom70.getHours();
    if (hours > 0) {
        result += hours + calculateHours(hours);
    }
    const minutes = dateFrom70.getMinutes();
    if (minutes > 0) {
        result += minutes + calculateMinutes(minutes);
    }

    return result;
}


/**
 * Вычислить правильное слово для вывода количества отслеживаемых лет
 * @param year - количество лет
 * @returns {string}
 */
function calculateYear(year: number) {
    return calculateFrom(year, ' год ', ' года ', ' лет ');
}

/**
 * Вычислить правильное слово для вывода количества отслеживаемых месяцев
 * @param month - количество месяцев
 * @returns {string}
 */
function calculateMonth(month: number) {
    if (month === 1) {
        return ' месяц '
    } else if (month === 2 || month === 3 || month === 4) {
        return ' месяца '
    } else {
        return ' месяцев '
    }
}

/**
 * Вычислить правильное слово для вывода количества отслеживаемых дней
 * @param day - количество дней
 * @returns {string}
 */
function calculateDay(day: number) {
    return calculateFrom(day, ' день ', ' дня ', ' дней ');
}

/**
 * Вычислить правильное слово для вывода количества отслеживаемых часов
 * @param hours - количество часов
 * @returns {string}
 */
function calculateHours(hours: number) {
    return calculateFrom(hours, ' час ', ' часа ', ' часов ');
}

/**
 * Вычислить правильное слово для вывода количества отслеживаемых минут
 * @param minutes - количество часов
 * @returns {string}
 */
function calculateMinutes(minutes: number) {
    return calculateFrom(minutes, ' минута ', ' минуты ', ' минут ');
}

/**
 * Обобщённый метод для выбора правильных форм слова при заданных количествах
 * @param count - количество
 * @param form1 - 1ая форма
 * @param form2 - 2ая форма
 * @param form3 - 3я форма
 * @returns {*}
 */
function calculateFrom(count: number, form1: string, form2: string, form3: string) {
    const countString = count.toString();
    const lastSymbol = parseInt(countString[countString.length - 1]);
    if (count >= 5 && count <= 20) {
        return form3;
    } else {
        if (lastSymbol === 1) {
            return form1;
        } else if (lastSymbol === 2 || lastSymbol === 3 || lastSymbol === 4) {
            return form2;
        } else {
            return form3;
        }
    }
}

export default {calculatePeriod};