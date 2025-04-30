export function getFirstMondayOfMonth(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);

  const dayOfWeek = firstDayOfMonth.getDay();

  const daysToAdd = dayOfWeek === 1 ? 0 : (8 - dayOfWeek) % 7;

  const firstMonday = new Date(year, month, 1 + daysToAdd);

  return firstMonday;
}

function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-11 für JavaScript Date
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, easterMonth, easterDay);
}

export function isHoliday(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  function isSameMonthDay(d1, d2) {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth();
  }

  // Neujahr (1. Januar)
  if (month === 0 && day === 1) return true;

  // Tag der Arbeit (1. Mai)
  if (month === 4 && day === 1) return true;

  // Tag der Deutschen Einheit (3. Oktober)
  if (month === 9 && day === 3) return true;

  // Allerheiligen (1. November)
  if (month === 10 && day === 1) return true;

  // 1. Weihnachtstag (25. Dezember)
  if (month === 11 && day === 25) return true;

  // 2. Weihnachtstag (26. Dezember)
  if (month === 11 && day === 26) return true;

  // Bewegliche Feiertage (abhängig vom Osterdatum)
  const easter = calculateEaster(year);

  // Karfreitag (Ostersonntag - 2 Tage)
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  if (isSameMonthDay(date, goodFriday)) return true;

  // Ostermontag (Ostersonntag + 1 Tag)
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  if (isSameMonthDay(date, easterMonday)) return true;

  // Christi Himmelfahrt (Ostersonntag + 39 Tage)
  const ascensionDay = new Date(easter);
  ascensionDay.setDate(easter.getDate() + 39);
  if (isSameMonthDay(date, ascensionDay)) return true;

  // Pfingstmontag (Ostersonntag + 50 Tage)
  const whitMonday = new Date(easter);
  whitMonday.setDate(easter.getDate() + 50);
  if (isSameMonthDay(date, whitMonday)) return true;

  // Fronleichnam (Ostersonntag + 60 Tage)
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  if (isSameMonthDay(date, corpusChristi)) return true;

  return false;
}

export function getNextTuesdayAfterFirstMonday(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const firstMonday = getFirstMondayOfMonth(year, month);

  let tuesday = new Date(firstMonday);
  tuesday.setDate(firstMonday.getDate() + 1);

  if (referenceDate > tuesday) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    const nextFirstMonday = getFirstMondayOfMonth(nextYear, nextMonth);
    tuesday = new Date(nextFirstMonday);
    tuesday.setDate(nextFirstMonday.getDate() + 1);
  }

  if (isHoliday(tuesday)) {
    tuesday.setDate(tuesday.getDate() + 7);
  }

  return tuesday;
}

export function formatDate(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return date.toLocaleDateString('de-DE', options);
}

export function isNextTuesday(dateToCheck, referenceDate = new Date()) {
  const refDate = new Date(referenceDate);

  const dayOfWeek = refDate.getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
  const daysUntilNextTuesday = (2 - dayOfWeek + 7) % 7;
  const daysToAdd = daysUntilNextTuesday === 0 ? 7 : daysUntilNextTuesday;

  refDate.setDate(refDate.getDate() + daysToAdd);

  refDate.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateToCheck);
  checkDate.setHours(0, 0, 0, 0);

  return refDate.getTime() === checkDate.getTime();
}

export function getAllDatesForYear(year) {
  const dates = [];

  for (let month = 0; month < 12; month++) {
    const firstMonday = getFirstMondayOfMonth(year, month);

    const tuesday = new Date(firstMonday);
    tuesday.setDate(firstMonday.getDate() + 1);

    const isTuesdayHoliday = isHoliday(tuesday);

    const finalDate = new Date(tuesday);
    let isShifted = false;

    if (isTuesdayHoliday) {
      finalDate.setDate(tuesday.getDate() + 7);
      isShifted = true;
    }

    dates.push({
      date: finalDate,
      month: month,
      isShifted: isShifted,
      note: isShifted ? getHolidayName(tuesday) : ""
    });
  }

  return dates;
}

function getHolidayName(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  function isSameMonthDay(d1, d2) {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth();
  }

  // Feste Feiertage
  if (month === 0 && day === 1) return "Neujahr";
  if (month === 4 && day === 1) return "Tag der Arbeit";
  if (month === 9 && day === 3) return "Tag der Deutschen Einheit";
  if (month === 10 && day === 1) return "Allerheiligen";
  if (month === 11 && day === 25) return "1. Weihnachtstag";
  if (month === 11 && day === 26) return "2. Weihnachtstag";

  // Bewegliche Feiertage
  const easter = calculateEaster(year);

  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  if (isSameMonthDay(date, goodFriday)) return "Karfreitag";

  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  if (isSameMonthDay(date, easterMonday)) return "Ostermontag";

  const ascensionDay = new Date(easter);
  ascensionDay.setDate(easter.getDate() + 39);
  if (isSameMonthDay(date, ascensionDay)) return "Christi Himmelfahrt";

  const whitMonday = new Date(easter);
  whitMonday.setDate(easter.getDate() + 50);
  if (isSameMonthDay(date, whitMonday)) return "Pfingstmontag";

  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  if (isSameMonthDay(date, corpusChristi)) return "Fronleichnam";

  return "";
}
