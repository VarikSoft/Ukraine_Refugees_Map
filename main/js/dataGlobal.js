var selectedDate = selectedDate || null;

document.addEventListener('DOMContentLoaded', function () {
    loadDataAndInitialize();
    const dropBtn = document.querySelector('.dropbtn');
    const dropContent = document.getElementById('date-list');
    const arrow = dropBtn.querySelector('.arrow');

    arrow.style.transform = 'rotate(45deg)';

    dropBtn.addEventListener('click', function () {
        dropContent.classList.toggle('show');
        if (dropContent.classList.contains('show')) {
            arrow.style.transform = 'rotate(-135deg)';
        } else {
            arrow.style.transform = 'rotate(45deg)';
        }
    });
});

async function loadDataAndInitialize() {
    const data = await loadRefugeesData();
    if (data) {
        const dates = getUniqueDates(data);
        createDateMenu(dates);
        selectedDate = getMinimumDate(dates);
        initializeDate();
    }
}

function initializeDate() {
    const selectedDateSpan = document.querySelector('.selected-date');
    selectedDateSpan.textContent = formatDate(selectedDate);
    const arrow = document.querySelector('.dropbtn .arrow');
    arrow.style.transform = 'rotate(45deg)';
}

async function loadRefugeesData() {
    try {
        const response = await fetch('data/refugees.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading the data/refugees data:', error);
    }
}

function getUniqueDates(data) {
    const dates = new Set();
    data.forEach(countryData => {
        Object.keys(countryData.refugees).forEach(date => {
            dates.add(date);
        });
    });
    return Array.from(dates).sort();
}

function createDateMenu(dates) {
    const dropdownDateListContent = document.getElementById('date-list');
    dropdownDateListContent.innerHTML = '';
    const selectedDateSpan = document.querySelector('.selected-date');
    dates.forEach(date => {
        const dateDiv = document.createElement('div');
        dateDiv.textContent = date;
        dateDiv.classList.add('date-item');
        dateDiv.onclick = async function () {
            selectedDate = date;
            selectedDateSpan.textContent = date;
            dropdownDateListContent.classList.remove('show');
            document.querySelector('.dropbtn .arrow').style.transform = 'rotate(45deg)';
            try {
                await initializeStatisticsList(date);
                await initializeMapData(date);
                await updateCountryInfo(selectedCountry);
            } catch (error) {
                console.error('Error during update:', error);
            }
        };
        dropdownDateListContent.appendChild(dateDiv);
    });
}

async function loadDataAndInitialize() {
    const data = await loadRefugeesData();
    const dates = getUniqueDates(data);
    selectedDate = getMinimumDate(dates);
    initializeDate();
}

function formatDate(date) {
    return `${date.substring(0, 7)}`;
}

function getMinimumDate(dates) {
    const sortedDates = dates.map(date => new Date(date)).sort((a, b) => a - b);
    return sortedDates.length > 0 ? sortedDates[0].toISOString().substring(0, 7) : null;
}

function handleDateSelection(date) {
    selectedDate = date;
    initializeDate();
}

function updateDateList(dates) {
    const listElement = document.getElementById('date-list');
    listElement.innerHTML = '';
    dates.forEach(date => {
        const listItem = document.createElement('div');
        listItem.textContent = formatDate(date);
        listItem.onclick = () => handleDateSelection(date);
        listElement.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', loadDataAndInitialize);