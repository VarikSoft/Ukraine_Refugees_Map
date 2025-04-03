async function generateSortedStatisticsList() {
    const data = await loadRefugeesData();
    if (!data) {
        console.error('No data returned from loadRefugeesData');
        return;
    }
    const statisticsListElement = document.querySelector('.statistics-list');
    statisticsListElement.innerHTML = ''; 
    const overallData = data.find(countryData => countryData.country.toLowerCase() === 'overall');
    const overallRefugees = overallData ? overallData.refugees[selectedDate] || 0 : 0;
    const overallValueElement = document.querySelector('.overall-value');
    overallValueElement.textContent = overallRefugees.toLocaleString();
    const sortedData = data
        .filter(countryData => countryData.country.toLowerCase() !== 'overall') 
        .map(countryData => ({
            name: capitalizeFirstLetter(countryData.country),
            refugees: countryData.refugees[selectedDate] || 0
        }))
        .filter(countryData => countryData.refugees > 0)
        .sort((a, b) => b.refugees - a.refugees);
        sortedData.forEach(countryData => {
            const listItem = document.createElement('li');
            const countryNameSpan = document.createElement('span');
            countryNameSpan.textContent = `${capitalizeFirstLetter(countryData.name)}:`;
            countryNameSpan.classList.add('country-name');
            const refugeesSpan = document.createElement('span');
            refugeesSpan.textContent = countryData.refugees.toLocaleString();
            refugeesSpan.classList.add('refugees-count');
            listItem.appendChild(countryNameSpan);
            listItem.appendChild(refugeesSpan);
            statisticsListElement.appendChild(listItem);
        });
}

function capitalizeFirstLetter(string) {
    if (typeof string !== 'string') {
        console.error('capitalizeFirstLetter function expected a string, but got:', string);
        return '';
    }
    return string.replace(/\b(\w)/g, s => s.toUpperCase());
}

async function initializeStatisticsList(date) {
    selectedDate = date;
    await generateSortedStatisticsList();
}

document.addEventListener('DOMContentLoaded', initializeStatisticsList);