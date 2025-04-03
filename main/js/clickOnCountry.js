let selectedCountry = "ukraine";
let currentActiveCountry = null;
const svgRoot = document.getElementById('mapsection');

document.addEventListener('click', function(event) {
  const infoBox = document.getElementById('countryInformation');
  const excludeSelectors = ['.dropdownDateList', '.statisticsMenu', '.navigationMenu', '.legendMenu', '.dateSliderMenu', '.modal', 'navTog', '#mapsection', '#path'];

  function clickedOnExcludedElement(target) {
    return excludeSelectors.some(selector => target.closest(selector));
  }

  if (!infoBox.contains(event.target) && !clickedOnExcludedElement(event.target)) {
    infoBox.style.opacity = '0';
    infoBox.style.transform = 'translateX(-50%) translateY(0px)';
    setTimeout(function() {
      infoBox.classList.remove('show-info');
    }, 500);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const refugeesData = await loadRefugeesData();
  const countryElements = document.querySelectorAll('svg path');
  const uniqueDates = getUniqueDates(refugeesData);
  createDateMenu(uniqueDates);
  countryElements.forEach(element => {
    originalParentNode = element.parentNode;
    referenceNode = element.nextSibling;

    element.addEventListener('click', (event) => {
      selectedCountry = element.id.toLowerCase(); 
      svgRoot.appendChild(element);
      updateCountryInfo(selectedCountry);
      if (currentActiveCountry) {
        currentActiveCountry.classList.remove('active-country');
      }
      element.classList.add('active-country');
      currentActiveCountry = element;
    });
    element.addEventListener('mouseenter', (event) => {
      svgRoot.appendChild(element);
    });
    element.addEventListener('mouseleave', (event) => {
      if (currentActiveCountry !== element) {
        originalParentNode.insertBefore(element, referenceNode);
      }
    });
  });
});
function changeInfoText(infoBox, newText) {
  infoBox.style.opacity = '0';
  setTimeout(() => {
    infoBox.textContent = newText;
    infoBox.style.opacity = '1';
  }, 250);
}

async function updateCountryInfo(countryID) {
  const refugeesData = await loadRefugeesData(); 
  const countryData = refugeesData.find(data => data.country.toLowerCase() === countryID);
  const infoBox = document.getElementById('countryInformation');
  const countryName = countryID.charAt(0).toUpperCase() + countryID.slice(1);
  let newText;

  if (countryID.toLowerCase() === 'ukraine') {
    newText = `${countryName}: Motherland`;
    changeInfoText(infoBox, newText);
  } else if (countryData && countryData.refugees) {
    let refugeesCount;
    if (selectedDate === null) {
      const latestMonth = Object.keys(countryData.refugees).sort().pop();
      refugeesCount = countryData.refugees[latestMonth];
    } else {
      refugeesCount = countryData.refugees[selectedDate];
    }
    
    if (refugeesCount > 0) {
      newText = `${countryName}: ${refugeesCount.toLocaleString()}`;
      const chartData = {
        labels: Object.keys(countryData.refugees),
        datasets: [{
          label: 'Refugees',
          data: Object.values(countryData.refugees),
          fill: false,
          backgroundColor: 'rgb(255, 121, 121)',
          tension: 0.1
        }]
      };
      updateChart(chartData);
    } else {
      newText = `${countryName}: No data`;
      updateChart(null);
    }
  } else {
    newText = `${countryName}: No data`;
    updateChart(null);
  }

  changeInfoText(infoBox, newText);

  if (!infoBox.classList.contains('show-info')) {
    infoBox.classList.add('show-info');
  }
}