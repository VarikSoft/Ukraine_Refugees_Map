let isSliderMenuActive = false;
let animationInterval = null;

async function loadSliderRefugeesData() {
  try {
    const response = await fetch('data/refugees.json');
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0 && data[0].refugees) {
      return data[0].refugees;
    } else {
      console.error('Refugees data is not found in the JSON response:', data);
      return null;
    }
  } catch (error) {
    console.error('Error loading the refugees data for slider:', error);
    return null;
  }
}

async function initializeSlider() {
  const refugeesData = await loadSliderRefugeesData();

  if (!refugeesData) {
    console.error('No refugees data to initialize the slider with.');
    return;
  }

  const dates = Object.keys(refugeesData);
  const slider = document.getElementById('slider');
  const sliderRange = document.getElementById('slider-range');

  sliderRange.max = dates.length - 1;
  sliderRange.value = 0;

  slider.innerHTML = '';

  dates.forEach((date, index) => {
    const point = document.createElement('div');
    point.classList.add('slider-point');
    point.dataset.date = date;
    point.dataset.index = index;
    point.addEventListener('click', () => selectDate(date, index));
    slider.appendChild(point);
  });

  if (dates.length > 0) {
    selectDate(dates[0], 0);
  }
}

async function selectDate(date, index) {
  const points = document.querySelectorAll('.slider-point');
  const sliderRange = document.getElementById('slider-range');
  sliderRange.value = index;
  selectedDate = date;

  await initializeStatisticsList(date);
  await initializeMapData(date);
  await updateCountryInfo(selectedCountry);
  initializeDate();

  sliderRange.value = index;

  points.forEach(point => point.classList.remove('active'));

  points[index].classList.add('active');

  updateArrowPosition(index);
}

function updateArrowPosition(index) {
  const arrow = document.querySelector('.slider-arrow');
  const points = document.querySelectorAll('.slider-point');
  if (points[index]) {
    const sliderContainer = document.getElementById('dateSliderMenu');
    const sliderContainerRect = sliderContainer.getBoundingClientRect();
    const pointRect = points[index].getBoundingClientRect();
    const arrowLeft = pointRect.left - sliderContainerRect.left + (pointRect.width / 2) - (arrow.offsetWidth / 2) - 1;
    const arrowTop = pointRect.top - sliderContainerRect.top - arrow.offsetHeight - 5;
    arrow.style.left = `${arrowLeft}px`;
    arrow.style.top = `${arrowTop}px`;
  }
}

function toggleAnimation(dates) {
  const startButton = document.getElementById('start-button');

  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
    startButton.textContent = 'START';
  } else {
    startButton.textContent = 'STOP';
    let index = dates.indexOf(selectedDate);

    index = (index + 1) % dates.length;

    animationInterval = setInterval(() => {
      if (index < dates.length) {
        selectDate(dates[index], index);
        index++;
      } else {
        clearInterval(animationInterval);
        animationInterval = null;
        startButton.textContent = 'START';
      }
    }, 1000);
  }
}

function getComputedStyleRightValue(element) {
  const computedStyle = window.getComputedStyle(element);
  return computedStyle.right === 'auto' ? 0 : parseInt(computedStyle.right, 10);
}

function setSliderPositionRelativeToSideMenu() {
  if (typeof isSliderMenuActive === 'undefined') {
    console.error('isSliderMenuActive is not defined');
    return;
  }

  if (!isSliderMenuActive) {
    return;
  }
  setTimeout(() => {
    const sliderMenu = document.getElementById('dateSliderMenu');
    const sideMenu = document.getElementById('statisticsMenu');
    if (!sliderMenu || !sideMenu) {
      console.error('Slider menu or side menu is missing from the DOM.');
      return;
    }

    const isSideMenuOpen = sideMenu.classList.contains('active');

    if (isSideMenuOpen) {
      sliderMenu.style.right = '300px';
    } else {
      sliderMenu.style.right = '10px';
    }
  }, 0);
}

function toggleSlider() {
  const sliderMenu = document.getElementById('dateSliderMenu');

  if (!sliderMenu) {
    console.error('Slider menu is missing from the DOM.');
    return;
  }

  sliderMenu.classList.toggle('active');

  isSliderMenuActive = sliderMenu.classList.contains('active');

  if (isChartModalOpen && isSliderMenuActive) {
    closeChartModal();
  }

  if (isSliderMenuActive) {
    setSliderPositionRelativeToSideMenu();
  } else {
    sliderMenu.style.right = '-100%';
  }
}

function closeSlider() {
  isSliderMenuActive = false;
  const sliderContainer = document.getElementById('dateSliderMenu');
  sliderContainer.classList.remove('active');
  sliderContainer.style.right = '-100%';
}

function toggleSideMenu() {
  const sideMenu = document.getElementById('statisticsMenu');
  sideMenu.classList.toggle('active');
  setSliderPositionRelativeToSideMenu();
}

document.getElementById('dateSliderButton').addEventListener('click', toggleSlider);
document.getElementById('dateSLiderMenuCloseButton').addEventListener('click', closeSlider);

document.getElementById('start-button').addEventListener('click', () => {
  const points = document.querySelectorAll('.slider-point');
  const dates = Array.from(points).map(point => point.dataset.date);
  toggleAnimation(dates);
});

document.getElementById('slider-range').addEventListener('input', (e) => {
  const index = e.target.value;
  const points = document.querySelectorAll('.slider-point');
  if (points[index]) {
    const selectedDate = points[index].dataset.date;
    selectDate(selectedDate, index);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await initializeSlider();
  const firstSquare = document.querySelector('.slider-point');
  if (firstSquare) {
    firstSquare.classList.add('active');
  }
  setSliderPositionRelativeToSideMenu();
});