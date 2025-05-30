document.addEventListener('DOMContentLoaded', ()=> {
    filterChartData();
    document.getElementById('timeFilter').addEventListener('change', filterChartData);
    document.getElementById('dataFilter').addEventListener('change', filterChartData);
})

const filterChartData = async() => {
    const dataFilter = document.getElementById('dataFilter').value;
    const timeFilter = document.getElementById('timeFilter').value;

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/fee/get-chart', {timeFilter, dataFilter});

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const { labels, data } = await response.json();
        const label = dataFilter === 'fees' ? 'Fees Collected (in Ksh)' : 'Earnings (in Ksh)';
        const filteredData = { labels, data };

        drawChart(filteredData, label);
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

const chartOptions = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Days of the Week'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Fees Collected (in Ksh)'
                }
            }
        }
    }
};

let chartInstance;
const drawChart = (filteredData, label) => {
    const ctx = document.getElementById('feesCollectionChart').getContext('2d');
    const data = {
        labels: filteredData.labels,
        datasets: [{
            label: label,
            data: filteredData.data,
            backgroundColor: 'rgba(204, 204, 204, 0.5)',
            borderColor: '#273A84',
            borderWidth: 2,
            fill: true,
            tension: 0.3
        }]
    };

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        ...chartOptions,
        data: data
    });
};

const feeTable = async () => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/fee/view-all-detailed');

        if (response.ok) {
            const feeData = await response.json();
            const feeContainer = document.getElementById('feeTable');
            const searchInput = document.getElementById('searchInput'); 
            const paginationControls = document.getElementById('paginationControls');
            let currentPage = 1;
            const rowsPerPage = 5;

            const renderPage = (data, page = 1) => {
                feeContainer.innerHTML = '';
                const start = (page - 1) * rowsPerPage;
                const end = start + rowsPerPage;
                const paginatedData = data.slice(start, end);

                paginatedData.forEach(fee => {
                    const feeRow = document.createElement('tr');

                    const studentNameCell = document.createElement('td');
                    const studentIdCell = document.createElement('td');
                    const amountPaidCell = document.createElement('td');
                    const paymentModeCell = document.createElement('td');
                    const paymentDateCell = document.createElement('td');
                    const accountNameCell = document.createElement('td');
                    const termCell = document.createElement('td');
                    const yearCell = document.createElement('td');
                    const refCell = document.createElement('td');

                    studentNameCell.textContent = `${fee.Student.FirstName} ${fee.Student.LastName}`;
                    studentIdCell.textContent = fee.Student.StudentID;
                    amountPaidCell.textContent = fee.Fee.AmountPaid;
                    paymentModeCell.textContent = fee.Fee.PaymentMode;
                    paymentDateCell.textContent = fee.Fee.PaymentDate;
                    accountNameCell.textContent = fee.Account.accountName;
                    termCell.textContent = `Term ${fee.Term.value}`;
                    yearCell.textContent = fee.Year.yearName;
                    refCell.textContent = fee.Fee.Ref;

                    feeRow.appendChild(studentNameCell);
                    feeRow.appendChild(studentIdCell);
                    feeRow.appendChild(amountPaidCell);
                    feeRow.appendChild(paymentModeCell);
                    feeRow.appendChild(paymentDateCell);
                    feeRow.appendChild(accountNameCell);
                    feeRow.appendChild(termCell);
                    feeRow.appendChild(yearCell);
                    feeRow.appendChild(refCell);

                    feeContainer.appendChild(feeRow);
                });

                updatePaginationControls(data, page);
            };

            const updatePaginationControls = (data, page) => {
                paginationControls.innerHTML = '';
                const totalPages = Math.ceil(data.length / rowsPerPage);

                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement('button');
                    pageButton.textContent = i;
                    pageButton.disabled = i === page;
                    pageButton.addEventListener('click', () => {
                        currentPage = i;
                        renderPage(data, currentPage);
                    });
                    paginationControls.appendChild(pageButton);
                }
            };

            const filterData = (query) => {
                return feeData.filter(fee => {
                    const fullName = `${fee.Student.FirstName} ${fee.Student.LastName}`.toLowerCase();
                    return (
                        fullName.includes(query.toLowerCase()) ||
                        fee.Student.StudentID.toLowerCase().includes(query.toLowerCase()) ||
                        fee.Fee.PaymentMode.toLowerCase().includes(query.toLowerCase()) ||
                        fee.Account.accountName.toLowerCase().includes(query.toLowerCase())
                    );
                });
            };

            searchInput.addEventListener('input', (event) => {
                const query = event.target.value;
                const filteredData = filterData(query);
                currentPage = 1;
                renderPage(filteredData, currentPage);
            });

            renderPage(feeData, currentPage);
        } else {
            console.error('An error occurred.', error);
            alert('Failed to load Fees.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        alert('Failed to load Fees.');
    }
};

feeTable();

function animateCount(elementId, from, to, duration) {
    const startTime = performance.now();

    function animate() {
        const currentTime = performance.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const count = Math.floor(from + (to - from) * progress);

        document.getElementById(elementId).textContent = count.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            document.getElementById(elementId).textContent = to.toLocaleString();
        }
    }

    requestAnimationFrame(animate);
}

async function populateCounts() {
    try {
        const feeResponse = await fetchRequest('http://localhost:3000/api/simba-systems/fee/get-count');
        if (feeResponse.ok) {
            const feeData = await feeResponse.json();

            animateCount('totalFeesCollected', 0, feeData.totalFeesPaid || 0, 1500);
        }

        const notificationResponse = await fetchRequest('http://localhost:3000/api/simba-systems/event/get-count');
        if (notificationResponse.ok) {
            const notificationData = await notificationResponse.json();

            const totalNotifications= document.getElementById('totalNotifications');
            totalNotifications.textContent = notificationData.allEvents || 0;
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

populateCounts();

document.getElementById("notificationIcon").addEventListener("click", () => {
    window.location.href = "../../html/dashboard/notifications.html";
});
