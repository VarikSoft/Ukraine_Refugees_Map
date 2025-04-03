let isChartModalOpen = false;

document.getElementById('chartMenuButton').addEventListener('click', async () => {
    if (isChartModalOpen) {
        closeChartModal();
    } else {
        const selectedCountryData = await loadRefugeesData();
        const countryData = selectedCountryData.find(country => country.country === selectedCountry);
        if (countryData && countryData.refugees) {
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
            showChartModal(chartData);
        } else {
            showChartModal(null);
        }
    }
});

function showChartModal(chartData) {
    const modal = document.getElementById('chartMenu');
    const noDataContainer = document.getElementById('no-data-container');
    if (window.refugeesChart && typeof window.refugeesChart.destroy === 'function') {
        window.refugeesChart.destroy();
    }
    if (chartData) {
        if (noDataContainer) {
            noDataContainer.style.display = 'none';
        }
        const ctx = document.getElementById('refugeesChart').getContext('2d');
        window.refugeesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Refugees',
                    data: chartData.datasets[0].data,
                    fill: false,
                    backgroundColor: 'rgb(255, 121, 121)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        if (noDataContainer) {
            noDataContainer.style.display = 'block';
            noDataContainer.style.position = 'absolute';
            noDataContainer.style.top = '50%';
            noDataContainer.style.left = '50%';
            noDataContainer.style.transform = 'translate(-50%, -50%)';
            noDataContainer.style.fontSize = '20px';
            noDataContainer.style.fontWeight = 600;
            noDataContainer.style.color = '#555555';
            noDataContainer.style.fontFamily = '"Open Sans", sans-serif';
        }
    }
    isChartModalOpen = true;
    modal.classList.add('modal-open');
    modal.classList.remove('modal-close');
    modal.style.display = 'block';
}
function closeChartModal() {
    const modal = document.getElementById('chartMenu');
    isChartModalOpen = false;
    modal.classList.add('modal-close');
    modal.classList.remove('modal-open');
    modal.addEventListener('transitionend', function handler() {
        modal.style.display = 'none';
        modal.removeEventListener('transitionend', handler);
    });
}

function updateChart(newChartData) {
    const noDataContainer = document.getElementById('no-data-container');
    if (newChartData === null) {
        if (window.refugeesChart && typeof window.refugeesChart.destroy === 'function') {
            window.refugeesChart.destroy();
            window.refugeesChart = null;
        }
        if (noDataContainer) {
            noDataContainer.style.display = 'block';
        }
    } else {
        if (noDataContainer) {
            noDataContainer.style.display = 'none';
        }
        if (window.refugeesChart && typeof window.refugeesChart.update === 'function') {
            window.refugeesChart.data.labels = newChartData.labels;
            window.refugeesChart.data.datasets[0].data = newChartData.datasets[0].data;
            window.refugeesChart.update();
        } else {
            const ctx = document.getElementById('refugeesChart').getContext('2d');
            window.refugeesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: newChartData.labels,
                    datasets: [{
                        label: 'Refugees',
                        data: newChartData.datasets[0].data,
                        fill: false,
                        backgroundColor: 'rgb(255, 121, 121)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.chart-close');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            closeChartModal();
        });
    }
});