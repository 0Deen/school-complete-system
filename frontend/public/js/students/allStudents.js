async function initializeAddStudents() {

    const studentDetails = {
        StudentID: document.getElementById('addStudentID').value,
        FirstName: document.getElementById('addFirstName').value,
        LastName: document.getElementById('addLastName').value,
        ClassId: document.getElementById('addClassSelect').value,
        ParentPhoneNumber: document.getElementById('addParentPhone').value,
        Email: document.getElementById('addEmail').value,
        Gender: document.getElementById('addGender').value
    };
    
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/create', studentDetails);

        if (response.ok) {
            alert('Student added successfully');
            toggleModal('#addStudentModal', '#modalOverlay');
            loadStudents();
            resetStudents();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add student');
        }
    } catch (error) {
        console.error('Error adding student', error);
        alert('Failed to add student. Please try again.');
    }
}

const resetStudents = async() => {
    document.getElementById('addStudentID').value = '';
    document.getElementById('addFirstName').value = '';
    document.getElementById('addLastName').value = '';
    document.getElementById('addClassSelect').value = '';
    document.getElementById('addParentPhone').value = '';
    document.getElementById('addEmail').value = '';
    document.getElementById('addGender').value = '';
}

async function initializeEditStudents(){
    try {
        const studentIdInput = document.getElementById('editStudentID').value;
        const firstNameInput = document.getElementById('editFirstName').value;
        const lastNameInput = document.getElementById('editLastName').value;
        const phoneInput = document.getElementById('editParentPhone').value;
        const emailInput = document.getElementById('editEmail').value;
        const genderInput = document.getElementById('editGender').value;

        const studentElement = {
            StudentID: studentIdInput,
            FirstName: firstNameInput,
            LastName: lastNameInput,
            ParentPhoneNumber: phoneInput,
            Email: emailInput,
            Gender: genderInput,
        };
        
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/edit',studentElement)
           
        if(response.ok){
            alert("Student Updated Sucessfully")
            toggleModal('#editStudentModal', '#modalOverlay')
            loadStudents();
        }else{
            const error = await response.json()
            console.log(error)
        }
    } catch (error) {
        throw error
    }
}

async function loadStudents() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/view-detailed-students');

        if (response.ok) {
            const students = await response.json(); 
            const studentsContainer = document.getElementById('activeStudents-container');
            studentsContainer.innerHTML = '';
            students.forEach(async(student) => {
                const studentRow = document.createElement('tr');

                studentRow.addEventListener('click', (event) => {
                    if (event.target.tagName !== 'BUTTON') {
                        openStudentDetailsModal(student);
                    }
                });

                const idCell = document.createElement('td');
                const firstNameCell = document.createElement('td');
                const lastNameCell = document.createElement('td');
                const classCell = document.createElement('td');
                const parentPhoneCell = document.createElement('td');
                const emailCell = document.createElement('td');
                const genderCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                idCell.textContent = student.StudentID;
                firstNameCell.textContent = student.FirstName;
                lastNameCell.textContent = student.LastName;
                classCell.textContent = `${student.class.block.Name} ${student.class.BlockRange} ${student.class.stream.Name}`
                parentPhoneCell.textContent = student.ParentPhoneNumber;
                emailCell.textContent = student.Email;
                genderCell.textContent = student.Gender;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => openEditStudentModal(student);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => confirmDeleteStudent(student.StudentID);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                studentRow.appendChild(idCell);
                studentRow.appendChild(firstNameCell);
                studentRow.appendChild(lastNameCell);
                studentRow.appendChild(classCell);
                studentRow.appendChild(parentPhoneCell);
                studentRow.appendChild(emailCell);
                studentRow.appendChild(genderCell);
                studentRow.appendChild(actionsCell);

                studentsContainer.appendChild(studentRow);
            });
        } else {
            console.error('Failed to load students.');
        }
    } catch (error) {
        console.error('Error fetching students!', error);
    }
}


const openEditStudentModal = async (student) => {
    const studentIdInput = document.getElementById('editStudentID');
    const firstNameInput = document.getElementById('editFirstName');
    const lastNameInput = document.getElementById('editLastName');
    const phoneInput = document.getElementById('editParentPhone');
    const emailInput = document.getElementById('editEmail');
    const genderInput = document.getElementById('editGender');

    studentIdInput.value = student.StudentID;
    firstNameInput.value = student.FirstName;
    lastNameInput.value = student.LastName;
    phoneInput.value = student.ParentPhoneNumber;
    emailInput.value = student.Email;
    genderInput.value = student.Gender;

    toggleModal('#editStudentModal', '#modalOverlay')
    await populateClassesSelected(student.ClassId);
};

const openStudentDetailsModal = async (student) => {
    document.getElementById('modalStudentID').textContent = student.StudentID;
    document.getElementById('modalFirstName').textContent = student.FirstName;
    document.getElementById('modalLastName').textContent = student.LastName;
    document.getElementById('modalClass').textContent = `${student.class.block.Name} ${student.class.BlockRange} ${student.class.stream.Name}`;
    document.getElementById('modalParentPhone').textContent = student.ParentPhoneNumber;
    document.getElementById('modalEmail').textContent = student.Email;
    document.getElementById('modalGender').textContent = student.Gender;
    document.getElementById('modalStatus').textContent = student.Status;

    const modalFeeTable = document.getElementById('feeTable');
    modalFeeTable.innerHTML = '';

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/get-fee', { StudentID: student.StudentID });
        const fee = await response.json();

        if (fee && fee.length > 0) {
            const tableHeader = `
                <thead>
                    <tr>
                        <th>Term</th>
                        <th>Year></th>
                        <th>Amount Paid</th>
                        <th>Account Number</th>
                        <th>Bank></th>
                        <th>Payment Mode</th>
                        <th>Payment Date</th>
                    </tr>
                </thead>
            `;
            modalFeeTable.innerHTML = tableHeader;

            const tableBody = document.createElement('tbody');

            fee.forEach((feeItem) => {
                const row = document.createElement('tr');

                const termCell = document.createElement('td');
                const yearCell = document.createElement('td');
                const amountPaidCell = document.createElement('td');
                const accountNumberCell = document.createElement('td');
                const bankCell = document.createElement('td');
                const paymentModeCell = document.createElement('td');
                const paymentDateCell = document.createElement('td');

                termCell.textContent = `Term ${feeItem.term.value}`;
                yearCell.textContent = feeItem.term.academic_year.yearName;
                amountPaidCell.textContent = feeItem.AmountPaid;
                accountNumberCell.textContent = feeItem.account.accountNumber;
                bankCell.textContent = `${feeItem.account.bank.Name} - ${feeItem.account.bank.Branch}`;
                paymentModeCell.textContent = feeItem.PaymentMode;
                paymentDateCell.textContent = feeItem.PaymentDate;

                row.appendChild(termCell);
                row.appendChild(yearCell);
                row.appendChild(amountPaidCell);
                row.appendChild(accountNumberCell);
                row.appendChild(bankCell);
                row.appendChild(paymentModeCell);
                row.appendChild(paymentDateCell);

                tableBody.appendChild(row);
            });

            modalFeeTable.appendChild(tableBody);
        } else {
            const row = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 4;
            emptyCell.textContent = 'No fee records found';
            row.appendChild(emptyCell);
            modalFeeTable.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching fee data:', error);
    }

    toggleModal('#studentDetailsModal', '#modalOverlay');
};



const populateClassesSelected = async (selectedClass) => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/class/view-detailed');
        if (response.ok) {
            const classes = await response.json();
            const classDropdown = document.getElementById('editClassSelect');
            classDropdown.innerHTML = '';

            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.Class;
                option.textContent = `${cls.Block} ${cls.Stream}` ;
                if (cls.Class === selectedClass) {
                    option.selected = true;
                }
                classDropdown.appendChild(option);
            });
        }
    } catch (e) {
        console.error(e);
    }
};

async function confirmDeleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        await deleteStudent(studentId);
    }
}

async function deleteStudent(studentId) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/delete',{ StudentID: studentId });

        if (response.ok) {
            alert('Student deleted successfully!');
            loadStudents();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete student');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
    }
}

async function populateClassSelect() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/class/view-detailed');
        if (response.ok) {
            const classes = await response.json();
            const classDropdown = document.getElementById('addClassSelect');
            classDropdown.innerHTML = '<option value="">Select a class</option>';

            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.Class;
                option.textContent = `${cls.Block} ${cls.Stream}` ;
                classDropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

populateClassSelect();
loadStudents()

const filters = {
    gender: '',
    studentAdmissionNumber: '',
    class: '',
    stream: '',
    teacher: '',
    parentPhoneNumber: '',
    feePaymentStatus: '',
    status: '',
    attendance: '',
    searchAllStudents: ''
};

function setupFilters() {
    Object.keys(filters).forEach(filter => {
        const element = document.getElementById(filter);
        if (element) {
            element.addEventListener('change', () => {
                filters[filter] = element.value;
                applyFilters();
            });
        }
    });

    const searchInput = document.getElementById('searchAllStudents');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filters.searchAllStudents = searchInput.value.trim();
            applyFilters();
        });
    }
}

async function applyFilters() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/view-detailed-students');
        if (response.ok) {
            const students = await response.json();
            const studentsContainer = document.getElementById('activeStudents-container');
            studentsContainer.innerHTML = '';

            const filteredStudents = students.filter(student => {
                return (
                    (!filters.gender || student.Gender === filters.gender) &&
                    (!filters.class || `${student.class.block.Name} ${student.class.BlockRange}` === filters.class) &&
                    (!filters.stream || `${student.class.stream.Name}` === filters.stream) &&
                    (!filters.status || student.Status === filters.status) &&
                    (!filters.searchAllStudents ||
                        `${student.StudentID} ${student.FirstName} ${student.LastName} ${student.Email}`.toLowerCase().includes(filters.searchAllStudents.toLowerCase()))
                );
            });

            filteredStudents.forEach(student => {
                const studentRow = document.createElement('tr');

                studentRow.addEventListener('click', (event) => {
                    if (event.target.tagName !== 'BUTTON') {
                        openStudentDetailsModal(student);
                    }
                });

                const idCell = document.createElement('td');
                const firstNameCell = document.createElement('td');
                const lastNameCell = document.createElement('td');
                const classCell = document.createElement('td');
                const parentPhoneCell = document.createElement('td');
                const emailCell = document.createElement('td');
                const genderCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                idCell.textContent = student.StudentID;
                firstNameCell.textContent = student.FirstName;
                lastNameCell.textContent = student.LastName;
                classCell.textContent = `${student.class.block.Name} ${student.class.BlockRange} ${student.class.stream.Name}`;
                parentPhoneCell.textContent = student.ParentPhoneNumber;
                emailCell.textContent = student.Email;
                genderCell.textContent = student.Gender;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => openEditStudentModal(student);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => confirmDeleteStudent(student.StudentID);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                studentRow.appendChild(idCell);
                studentRow.appendChild(firstNameCell);
                studentRow.appendChild(lastNameCell);
                studentRow.appendChild(classCell);
                studentRow.appendChild(parentPhoneCell);
                studentRow.appendChild(emailCell);
                studentRow.appendChild(genderCell);
                studentRow.appendChild(actionsCell);

                studentsContainer.appendChild(studentRow);
            });
        } else {
            console.error('Failed to load students.');
        }
    } catch (error) {
        console.error('Error fetching students!', error);
    }
}


async function populateclasses() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/class/view-detailed');
        if (response.ok) {
            const classes = await response.json();
            const classSelect = document.getElementById('class');
            classSelect.innerHTML = '<option value="">All blocks</option>'

            classes.forEach(classCell => {
                const option = document.createElement('option');
                option.value = `${classCell.Block}`;
                option.textContent = `${classCell.Block}`;
                classSelect.appendChild(option);
            });
        } else {
            console.error('Failed to load classes.');
        }
    } catch (error) {
        console.error('Error fetching classes!', error);
    }
}

async function populatestream() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/stream/viewAll');
        if (response.ok) {
            const streams = await response.json();
            const streamSelect = document.getElementById('stream');
            streamSelect.innerHTML = '<option value="">All streams</option>'

            streams.forEach(stream => {
                const option = document.createElement('option');
                option.value = `${stream.Name}`;
                option.textContent = `${stream.Name}`;
                streamSelect.appendChild(option);
            });
        } else {
            console.error('Failed to load streams.');
        }
    } catch (error) {
        console.error('Error fetching streams!', error);
    }
}


setupFilters();
populateclasses();
populatestream();