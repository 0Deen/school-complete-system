async function syncStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/simba-systems/student/sync', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const students = await response.json();
            const studentContainer = document.getElementById('student-container');

            if (studentContainer) {
                studentContainer.innerHTML = '';
                students.forEach(student => {
                    const studentRow = document.createElement('tr');

                    const nameCell = document.createElement('td');
                    nameCell.textContent = student.Name;

                    const idCell = document.createElement('td');
                    idCell.textContent = student.StudentId;

                    const actionsCell = document.createElement('td');

                    const editButton = document.createElement('button');
                    editButton.className = 'edit-btn';
                    editButton.textContent = 'Edit';
                    editButton.onclick = () => openEditStudentModal(student);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-btn';
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteStudent(student.StudentId);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    studentRow.appendChild(nameCell);
                    studentRow.appendChild(idCell);
                    studentRow.appendChild(actionsCell);

                    studentContainer.appendChild(studentRow);
                });
            }
        } else {
            console.error('Failed to sync students.');
        }
    } catch (e) {
        console.error('Error syncing students:', e);
    }
}

function openEditStudentModal(student) {
    document.getElementById('editStudentId').value = student.StudentId;
    document.getElementById('editStudentName').value = student.Name;
    toggleModal('#editStudentModal', '#modalOverlay');
}

async function deleteStudent(StudentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch('http://localhost:3000/api/simba-systems/student/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ StudentId }),
            });

            if (response.ok) {
                alert('Student deleted successfully!');
                syncStudents();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student');
        }
    }
}

syncStudents();
