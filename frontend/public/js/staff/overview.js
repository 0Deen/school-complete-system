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
        const employeeResponse = await fetchRequest('http://localhost:3000/api/simba-systems/employee/get-count');
        if (employeeResponse.ok) {
            const employeeData = await employeeResponse.json();

            animateCount('totalEmployees', 0, employeeData.totalEmployees || 0, 1500);
        }

        const positionResponse = await fetchRequest('http://localhost:3000/api/simba-systems/position/get-count');
        if (positionResponse.ok) {
            const positionData = await positionResponse.json();

           animateCount('totalPositions', 0, positionData.totalPositions || 0, 1500); 
        }

        const payrollResponse = await fetchRequest('http://localhost:3000/api/simba-systems/payroll/get-count');
        if (payrollResponse.ok) {
            const payrollData = await payrollResponse.json();

           animateCount('totalNetPay', 0, payrollData.totalNetPay || 0, 1500);
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

populateCounts();

