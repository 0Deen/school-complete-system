function animateCount(elementId, from, to, duration) {
    const startTime = performance.now();
    
    function animate() {
        const currentTime = performance.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const count = Math.floor(from + (to - from) * progress);
        
        document.getElementById(elementId).textContent = count;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            document.getElementById(elementId).textContent = to;
        }
    }

    requestAnimationFrame(animate);
}

async function populateCounts() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/get-count');
        if (response.ok) {
            const data = await response.json();

            animateCount('allStudentsCount', 0, data.allStudents || 0, 1500);
            animateCount('activeStudentsCount', 0, data.activeStudents || 0, 1500);
            animateCount('inactiveStudentsCount', 0, data.inactiveStudents || 0, 1500);
            /* animateCount('newAdmissionsCount', 0, data.newAdmissions || 0, 1500); */
            /* animateCount('feeDefaultersCount', 0, data.feeDefaulters || 0, 1500); */
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

populateCounts();
