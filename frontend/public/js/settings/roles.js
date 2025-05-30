const populateStudents = async() => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/viewAll');

        if(response.ok){
            const students = await response.json();

            const studentContainer = document.getElementById('userDropdown');
            studentContainer.innerHTML = '<option value="">Select Student</option>';

            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.StudentID;
                option.textContent = `${student.FirstName} ${student.LastName}`;

                studentContainer.appendChild(option);
            });
        }
    } catch (error) {
        throw error
    }
}

populateStudents();