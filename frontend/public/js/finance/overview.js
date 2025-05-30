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
       const payrollResponse = await fetchRequest('http://localhost:3000/api/simba-systems/payroll/get-count');
        if (payrollResponse.ok) {
            const payrollData = await payrollResponse.json();

           animateCount('staffPayroll', 0, payrollData.totalNetPay || 0, 1500);
        }

        const accountResponse = await fetchRequest('http://localhost:3000/api/simba-systems/account/get-count');
        if (accountResponse.ok) {
            const accountData = await accountResponse.json();

           animateCount('bankBalance', 0, accountData.totalAmount || 0, 1500);
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

populateCounts();

