import { getNextTuesdayAfterFirstMonday, formatDate, isNextTuesday, isHoliday, getAllDatesForYear } from './dateCalculator';

let isYearViewActive = false;

const monthNames = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

function updateMainDateDisplay() {
  const today = new Date();
  const currentDateElement = document.getElementById('current-date');

  if (currentDateElement) {
    currentDateElement.textContent = formatDate(today);
  }

  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = today.getFullYear();
  }

  const nextTuesday = getNextTuesdayAfterFirstMonday(today);
  const nextTuesdayElement = document.getElementById('next-tuesday-date');
  const nextTuesdayInfoElement = document.getElementById('next-tuesday-info');

  const originalTuesday = new Date(nextTuesday);
  originalTuesday.setDate(originalTuesday.getDate() - 7);
  const isHolidayShifted = isHoliday(originalTuesday);

  if (nextTuesdayElement) {
    let outputText = '';
    let infoText = '';

    if (isNextTuesday(nextTuesday, today)) {
      outputText = "Nächster Dienstag";
      const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      infoText = nextTuesday.toLocaleDateString('de-DE', dateOptions);
    } else {
      outputText = formatDate(nextTuesday);
    }

    if (isHolidayShifted) {
      infoText += isNextTuesday(nextTuesday, today) ?
        " (verschoben wegen Feiertag)" :
        "\nVerschoben wegen Feiertag";
    }

    nextTuesdayElement.textContent = outputText;
    if (nextTuesdayInfoElement) {
      nextTuesdayInfoElement.textContent = infoText;
    }
  }
}

function showUpcomingDates() {
  const today = new Date();
  const currentYear = today.getFullYear();

  const allDates = getAllDatesForYear(currentYear);

  const upcomingDates = allDates.filter(dateInfo => {
    const date = new Date(dateInfo.date);
    date.setHours(0, 0, 0, 0);
    const todayCopy = new Date(today);
    todayCopy.setHours(0, 0, 0, 0);
    return date >= todayCopy;
  });

  const nextDates = upcomingDates.slice(0, 3);

  const upcomingDatesContainer = document.getElementById('upcoming-dates');

  if (upcomingDatesContainer) {
    upcomingDatesContainer.innerHTML = '';

    if (nextDates.length === 0) {
      const noDateElement = document.createElement('div');
      noDateElement.className = 'col-span-full text-center text-gray-500 py-8';
      noDateElement.textContent = 'Keine weiteren Termine für dieses Jahr.';
      upcomingDatesContainer.appendChild(noDateElement);
      return;
    }

    nextDates.forEach((dateInfo, index) => {
      const dateCard = document.createElement('div');
      dateCard.className = 'bg-white rounded-lg shadow-card p-5 transition-all hover:shadow-card-hover upcoming-date-card';

      if (index === 0) {
        dateCard.classList.add('ring-2', 'ring-primary', 'ring-opacity-50');
      }

      if (dateInfo.isShifted) {
        dateCard.classList.add('border-l-4', 'border-warning');
      }

      const dateContainer = document.createElement('div');
      dateContainer.className = 'flex items-start mb-4';

      const dateCircle = document.createElement('div');
      dateCircle.className = 'flex-shrink-0 w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mr-4';

      const dateNumber = document.createElement('span');
      dateNumber.className = 'text-xl font-bold text-indigo-700';
      dateNumber.textContent = dateInfo.date.getDate();

      dateCircle.appendChild(dateNumber);
      dateContainer.appendChild(dateCircle);

      const dateTextContainer = document.createElement('div');
      dateTextContainer.className = 'flex-grow';

      const monthYearSpan = document.createElement('div');
      monthYearSpan.className = 'text-lg font-medium text-gray-900';
      monthYearSpan.textContent = `${monthNames[dateInfo.month]} ${dateInfo.date.getFullYear()}`;

      const weekdaySpan = document.createElement('div');
      weekdaySpan.className = 'text-sm text-gray-600';
      const weekdayOptions = { weekday: 'long' };
      weekdaySpan.textContent = dateInfo.date.toLocaleDateString('de-DE', weekdayOptions);

      dateTextContainer.appendChild(monthYearSpan);
      dateTextContainer.appendChild(weekdaySpan);

      dateContainer.appendChild(dateTextContainer);
      dateCard.appendChild(dateContainer);

      if (dateInfo.isShifted) {
        const noteElement = document.createElement('div');
        noteElement.className = 'mt-3 p-2 bg-yellow-50 text-yellow-800 text-sm rounded holiday-shifted-indicator';

        const noteBadge = document.createElement('span');
        noteBadge.className = 'inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full mb-1';
        noteBadge.textContent = 'Verschoben';

        const noteText = document.createElement('p');
        noteText.className = 'text-xs';
        noteText.textContent = `Wegen Feiertag: ${dateInfo.note}`;

        noteElement.appendChild(noteBadge);
        noteElement.appendChild(noteText);
        dateCard.appendChild(noteElement);
      }

      upcomingDatesContainer.appendChild(dateCard);
    });
  }
}

function showYearOverview() {
  const currentYear = new Date().getFullYear();

  const allDates = getAllDatesForYear(currentYear);

  const tableBody = document.querySelector('#year-dates tbody');

  if (tableBody) {
    tableBody.innerHTML = ''; // Leere die Tabelle

    allDates.forEach(dateInfo => {
      const row = document.createElement('tr');

      row.className = 'hover:bg-gray-50 transition-colors';

      if (dateInfo.isShifted) {
        row.classList.add('bg-yellow-50');
      }

      const monthCell = document.createElement('td');
      monthCell.className = 'px-4 sm:px-6 py-3 text-sm';
      monthCell.textContent = monthNames[dateInfo.month];
      row.appendChild(monthCell);

      const dateCell = document.createElement('td');
      dateCell.className = 'px-4 sm:px-6 py-3 text-sm';

      const mobileDateFormat = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      };

      const desktopDate = document.createElement('span');
      desktopDate.className = 'hidden sm:inline';
      desktopDate.textContent = formatDate(dateInfo.date);

      const mobileDate = document.createElement('span');
      mobileDate.className = 'sm:hidden';
      mobileDate.textContent = dateInfo.date.toLocaleDateString('de-DE', mobileDateFormat);

      dateCell.appendChild(mobileDate);
      dateCell.appendChild(desktopDate);
      row.appendChild(dateCell);

      tableBody.appendChild(row);
    });
  }
}

function toggleYearView() {
  isYearViewActive = !isYearViewActive;

  const yearOverviewSection = document.getElementById('year-overview');
  const toggleButton = document.getElementById('toggle-year-view');

  if (isYearViewActive) {
    yearOverviewSection.classList.remove('hidden');
    toggleButton.textContent = 'Jahresübersicht ausblenden';
    toggleButton.classList.remove('bg-gray-200', 'hover:bg-gray-300');
    toggleButton.classList.add('bg-primary', 'text-white', 'hover:bg-indigo-600');
  } else {
    yearOverviewSection.classList.add('hidden');
    toggleButton.textContent = 'Alle Termine anzeigen';
    toggleButton.classList.remove('bg-primary', 'text-white', 'hover:bg-indigo-600');
    toggleButton.classList.add('bg-gray-200', 'hover:bg-gray-300');
  }
}

function isMobileDevice() {
  return window.matchMedia('(max-width: 640px)').matches;
}


function init() {
  updateMainDateDisplay();
  showUpcomingDates();
  showYearOverview();
  handleResponsiveLayout();

  const toggleButton = document.getElementById('toggle-year-view');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleYearView);
  }

  window.addEventListener('resize', handleResponsiveLayout);

  scheduleNextUpdate();
}

function scheduleNextUpdate() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const timeUntilMidnight = tomorrow - now;

  setTimeout(() => {
    updateMainDateDisplay();
    showUpcomingDates();
    if (isYearViewActive) {
      showYearOverview();
    }
    scheduleNextUpdate();
  }, timeUntilMidnight);
}

document.addEventListener('DOMContentLoaded', init);

