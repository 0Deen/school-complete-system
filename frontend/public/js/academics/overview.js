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
        const classResponse = await fetchRequest('http://localhost:3000/api/simba-systems/class/get-count');
        if (classResponse.ok) {
            const classData = await classResponse.json();

            animateCount('totalClasses', 0, classData.allClasses || 0, 1500);
            animateCount('totalStreams', 0, classData.allStreams || 0, 1500);
            animateCount('totalBlocks', 0, classData.allBlocks || 0, 1500);
            animateCount('totalTeachers', 0, classData.allTeachers || 0, 1500);
        }

        const studentResponse = await fetchRequest('http://localhost:3000/api/simba-systems/student/get-count');
        if (studentResponse.ok) {
            const studentData = await studentResponse.json();

            animateCount('totalStudents', 0, studentData.allStudents || 0, 1500);
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

populateCounts();

