const colorPalette = ['#FAE6C3', '#F0CD91', '#ECB95F', '#E6A532', '#DC8C2D', '#D76E2D'];

function generateLogarithmicRefugeesRanges(data, selectedDate, rangeCount) {
  const filteredData = data.filter(countryData => countryData.country !== 'overall');
  const refugeess = filteredData
    .map(countryData => {
      const refugees = countryData.refugees[selectedDate];
      return refugees > 0 ? refugees : 1;
    })
    .filter(refugees => refugees != null)
    .sort((a, b) => a - b);
  if (refugeess.some(isNaN)) {
    console.error('NaN detected in refugeess array for date ' + selectedDate);
  }
  const minLog = Math.log(refugeess[0]);
  const maxLog = Math.log(refugeess[refugeess.length - 1]);
  const logRange = maxLog - minLog;
  const logIntervalSize = logRange / rangeCount;
  const refugeesRanges = [];
  for (let i = 0; i < rangeCount; i++) {
    const startLog = minLog + i * logIntervalSize;
    const endLog = startLog + logIntervalSize;
    const minRange = Math.exp(startLog);
    const maxRange = i === rangeCount - 1 ? refugeess[refugeess.length - 1] : Math.exp(endLog);
    refugeesRanges.push({
      min: Math.round(minRange),
      max: Math.round(maxRange)
    });
  }
  refugeesRanges[refugeesRanges.length - 1].max = refugeess[refugeess.length - 1];
  return refugeesRanges;
}

function getColorForRefugees(refugees, refugeesRanges) {
  for (let i = 0; i < refugeesRanges.length; i++) {
    if (refugees >= refugeesRanges[i].min && refugees < refugeesRanges[i].max) {
      return colorPalette[i];
    }
  }
  return colorPalette[colorPalette.length - 1];
}

function updateCountryColors(selectedDate, data, refugeesRanges) {
  data.forEach(countryData => {
    const countryId = countryData.country.toLowerCase();
    const countryElement = document.getElementById(countryId);
    if (countryElement) {
      const refugees = countryData.refugees[selectedDate];
      if (refugees != null && !isNaN(refugees) && refugees > 0) {
        const color = getColorForRefugees(refugees, refugeesRanges);
        countryElement.style.fill = color;
      } else {
        countryElement.style.fill = "#cccccc";
      }
    }
  });
}

function createLegend(refugeesRanges, colorPalette) {
  const legendContainer = document.querySelector('.legendMenu');
  legendContainer.innerHTML = '';
  const legendTitle = document.createElement('div');
  legendTitle.classList.add('legend-title');
  legendTitle.textContent = 'Legend';
  legendContainer.appendChild(legendTitle);

  refugeesRanges.forEach((range, index) => {
    const legendItem = document.createElement('div');
    legendItem.classList.add('legend-item');
    const colorBox = document.createElement('div');
    colorBox.classList.add('color-box');
    colorBox.style.backgroundColor = colorPalette[index];
    const label = document.createElement('div');
    label.classList.add('label');
    let labelText = `≥ ${formatNumber(range.min)} to ${formatNumber(range.max)}`;
    if (index === 0) {
      labelText = `≥ ${formatNumber(range.min)} to ${formatNumber(refugeesRanges[index + 1].max)}`;
    }
    labelText = labelText.replace(/(\d+[\d\s,]*)/g, '<span class="semi-bold">$1</span>');
    label.innerHTML = labelText;
    legendItem.appendChild(colorBox);
    legendItem.appendChild(label);
    legendContainer.appendChild(legendItem);
  });
  const noDataItem = document.createElement('div');
  noDataItem.classList.add('legend-item', 'no-data');
  const noDataColorBox = document.createElement('div');
  noDataColorBox.classList.add('color-box');
  const noDataLabel = document.createElement('div');
  noDataLabel.classList.add('label');
  noDataLabel.textContent = 'Data not available';
  noDataItem.appendChild(noDataColorBox);
  noDataItem.appendChild(noDataLabel);
  legendContainer.appendChild(noDataItem);
}

async function initializeMapData(selectedDate) {
  if (!selectedDate) {
    const data = await loadRefugeesData();
    const dates = getUniqueDates(data);
    selectedDate = getMinimumDate(dates);
  }
  const refugeesData = await loadRefugeesData();
  const rangeCount = colorPalette.length;
  if (refugeesData && selectedDate) {
    const refugeesRanges = generateLogarithmicRefugeesRanges(refugeesData, selectedDate, rangeCount);
    updateCountryColors(selectedDate, refugeesData, refugeesRanges);
    createLegend(refugeesRanges, colorPalette);
  } else {
    console.error('Data or Selected Date is not available');
  }
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

document.addEventListener('DOMContentLoaded', async function () {
  await initializeMapData();
});