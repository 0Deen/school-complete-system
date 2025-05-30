async function initializeAddEmployeeForm() {
    const employeeData = {
        FirstName: document.getElementById('addFirstName').value,
        LastName: document.getElementById('addLastName').value,
        PositionId: document.getElementById('addPositionSelect').value,
        Email: document.getElementById('addEmail').value,
        Phone: document.getElementById('addPhoneNumber').value
    };

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/employee/create', employeeData);

        if (response.ok) {
            const data = await response.json();

            const employeeId = data.employee.EmployeeID;

            alert('Employee added successfully!');
            resetEmployeeForm();

            const addPayroll = confirm('add a payroll for this employee?');

            if (addPayroll) {
                document.getElementById('addEmployeeSelect').value = employeeId;
                toggleModal('#addEmployeeModal', '#modalOverlay');
                toggleModal('#addPayrollModal', '#modalOverlay');
            } else {
                toggleModal('#addEmployeeModal', '#modalOverlay');
            }

            loadEmployees();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add employee');
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        alert('Failed to add employee. Please try again.');
    }
}


function resetEmployeeForm() {
    document.getElementById('addFirstName').value = '';
    document.getElementById('addLastName').value = '';
    document.getElementById('addPositionSelect').value = '';
    document.getElementById('addEmail').value = '';
    document.getElementById('addPhoneNumber').value = '';
}

async function loadEmployees() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/employee/get-detailed-employees');

        if (response.ok) {
            const employees = await response.json();

            const employeeContainer = document.getElementById('employee-container');
            const searchQuery = document.getElementById('searchPosition').value.toLowerCase();


            if (employeeContainer) {
                employeeContainer.innerHTML = ''; 

                
            const employeesFilter = employees.filter(employee => {
                return (!searchQuery || 
                    employee.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.specializedPosition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.Phone.toLowerCase().includes(searchQuery.toLowerCase())
                );
            });

            employeesFilter.forEach(employee => {
                const employeeRow = document.createElement('tr');
                
                const firstNameCell = document.createElement('td');
                const lastNameCell = document.createElement('td');
                const positionCell = document.createElement('td');
                const emailCell = document.createElement('td');
                const phoneCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                firstNameCell.textContent = employee.FirstName;
                lastNameCell.textContent = employee.LastName;
                positionCell.textContent = employee.specializedPosition.name;
                emailCell.textContent = employee.Email;
                phoneCell.textContent = employee.Phone;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => openEditEmployeeModal(employee);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => deleteEmployee(employee.EmployeeID);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                employeeRow.appendChild(firstNameCell);
                employeeRow.appendChild(lastNameCell);
                employeeRow.appendChild(positionCell);
                employeeRow.appendChild(emailCell);
                employeeRow.appendChild(phoneCell);
                employeeRow.appendChild(actionsCell);

                employeeContainer.appendChild(employeeRow);
            });
        }
    } else {
        console.error('Failed to load employees.');
    }
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

document.getElementById('searchPosition').addEventListener('input', loadEmployees);

loadEmployees();

async function initializeEditEmployeeForm() {
        const updatedEmployee = {
            EmployeeID: document.getElementById('editEmployeeId').value,
            FirstName: document.getElementById('editFirstName').value,
            LastName: document.getElementById('editLastName').value,
            PositionId: document.getElementById('editPositionSelect').value,
            Email: document.getElementById('editEmail').value,
            Phone: document.getElementById('editPhoneNumber').value
        };

        if (updatedEmployee.EmployeeID && updatedEmployee.FirstName && updatedEmployee.LastName && 
            updatedEmployee.PositionId && updatedEmployee.Email && updatedEmployee.Phone) {
            try {
                const response = await fetchRequest('http://localhost:3000/api/simba-systems/employee/edit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedEmployee),
                });

                if (response.ok) {
                    alert('Employee updated successfully!');
                    toggleModal('#editEmployeeModal', '#modalOverlay');
                    loadEmployees();
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to update employee');
                }
            } catch (error) {
                console.error('Error updating employee:', error);
                alert('Failed to update employee. Please try again.');
            }
        } else {
            alert('Please fill in all required fields.');
        }
}

async function openEditEmployeeModal(employee) {
    try {
        document.getElementById('editEmployeeId').value = employee.EmployeeID; 
        document.getElementById('editFirstName').value = employee.FirstName;
        document.getElementById('editLastName').value = employee.LastName;
        document.getElementById('editEmail').value = employee.Email;
        document.getElementById('editPhoneNumber').value = employee.Phone;

        populateSpecializedPositionDropdown(employee.specializedPosition.positionId, employee.specializedPosition.id);
        await populatePositionDropdown(employee.specializedPosition.positionId);

        toggleModal('#editEmployeeModal', '#modalOverlay');
    } catch (error) {
        console.error('Error opening edit employee modal:', error);
    }
}

async function populatePositionDropdown(selectedPositionId) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/viewAll');

        if (response.ok) {
            const positions = await response.json();
            const positionSelect = document.getElementById('editParentPositionSelect');

            if (positionSelect) {
                positionSelect.innerHTML = '<option value="">Select a position</option>';

                positions.forEach(position => {
                    const option = document.createElement('option');
                    option.value = position.positionId;
                    option.textContent = position.Name;

                    if (position.positionId === selectedPositionId) {
                        option.selected = true;
                    }

                    positionSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to load positions for dropdown.');
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}
document.getElementById('editParentPositionSelect').addEventListener('change',()=>{
    populateSpecializedPositionDropdown(document.getElementById('editParentPositionSelect').value)
})

async function populateSpecializedPositionDropdown(selectedPositionId,specializedPosition) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/view-specialized',{positionId:selectedPositionId});

        if (response.ok) {
            const positions = await response.json();
            const positionSelect = document.getElementById('editPositionSelect');

            if (positionSelect) {
                positionSelect.innerHTML = '<option value="">Select a position</option>';

                positions.forEach(position => {
                    const option = document.createElement('option');
                    option.value = position.id;
                    option.textContent = position.name;

                    if (position.id === specializedPosition) {
                        option.selected = true;
                    }

                    positionSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to load positions for dropdown.');
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}
    
async function populateInitialPositionDropdown() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/viewall');

        if (response.ok) {
            const positions = await response.json();

            const positionSelect = document.getElementById('addParentPositionSelect');

            if (positionSelect) {
                positionSelect.innerHTML = '<option value="">Select a position</option>';

                positions.forEach(position => {
                    const option = document.createElement('option');
                    option.value = position.positionId;
                    option.textContent = position.Name;

                    positionSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to load positions for dropdown.');
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}
populateInitialPositionDropdown();

document.getElementById('addParentPositionSelect').addEventListener('change',()=>{
    populateInitialSpecializedDropdown(document.getElementById('addParentPositionSelect').value)
})

async function populateInitialSpecializedDropdown(positionId) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/view-specialized',{positionId});

        if (response.ok) {
            const positions = await response.json();
            const positionSelect = document.getElementById('addPositionSelect');

            if (positionSelect) {
                positionSelect.innerHTML = '<option value="">Select a position</option>';

                positions.forEach(position => {
                    const option = document.createElement('option');
                    option.value = position.id;
                    option.textContent = position.name;

                    positionSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to load positions for dropdown.');
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}

async function deleteEmployee(EmployeeID) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/employee/delete',{ EmployeeID });

            if (response.ok) {
                alert('Employee deleted successfully!');
                loadEmployees();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete employee');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee');
        }
    }
}

function calculateNetPay(salary, bonus, deductions) {
    return (parseFloat(salary) || 0) + (parseFloat(bonus) || 0) - (parseFloat(deductions) || 0);
}

async function initializeAddPayrollForm() {
    try {
        const employeeIdInput = document.getElementById('addEmployeeSelect');
        const salaryInput = document.getElementById('addSalary');
        const bonusInput = document.getElementById('addBonus');
        const deductionsInput = document.getElementById('addDeductions');
        const netPayInput = document.getElementById('addNetPay');
        const payDateInput = document.getElementById('addPayDate');
        const paymentMethodInput = document.getElementById('addPaymentMethod');

        const employeeId = employeeIdInput.value;
        const salary = salaryInput.value;
        const bonus = bonusInput.value;
        const deductions = deductionsInput.value;
        const payDate = payDateInput.value;
        const paymentMethod = paymentMethodInput.value;

        if (!employeeId || !payDate || !paymentMethod) {
            alert('Please fill in all required fields.');
            return;
        }
        const netPay = calculateNetPay(salary, bonus, deductions);
        netPayInput.value = netPay.toFixed(2);

        const payrollDetails = {
            EmployeeID: employeeId,
            BaseSalary: parseFloat(salary) || 0,
            Bonus: parseFloat(bonus) || 0,
            Deductions: parseFloat(deductions) || 0,
            NetPay: netPay,
            PayDate: payDate,
            PaymentMethod: paymentMethod,
        };
        

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/payroll/create', payrollDetails);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add Payroll');
        }

        alert('Employee Payroll was added successfully.');
        toggleModal('#addPayrollModal', '#modalOverlay');

    } catch (error) {
        console.error('Error adding payroll:', error);
        alert(`Failed to add payroll. ${error.message}`);
    }
} 

/* async function populatePositionDropdown() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/viewall');

        if (response.ok) {
            const positions = await response.json();

            const positionSelect = document.getElementById('position');

            if (positionSelect) {
                positionSelect.innerHTML = '<option value="">Select a position</option>';

                const uniquePositions = new Set();

                positions.forEach(position => {
                    if (!uniquePositions.has(position.Name)) {
                        uniquePositions.add(position.Name);

                        const option = document.createElement('option');
                        option.value = position.positionId;
                        option.textContent = position.Name;

                        positionSelect.appendChild(option);
                    }
                });
            }
        } else {
            console.error('Failed to load positions for dropdown.');
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}

populatePositionDropdown(); */

async function populateSpecializedPosition() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/specialized-position/viewAll');

        if (response.ok) {
            const positions = await response.json();

            const positionSelect = document.getElementById('specializedPosition');

            if (positionSelect) {
                positionSelect.innerHTML = '<option value="">Select a Specialized position</option>';

                const uniquePositions = new Set();

                positions.forEach(position => {
                    if (!uniquePositions.has(position.position.name)) {
                        uniquePositions.add(position.position.name);

                        const option = document.createElement('option');
                        option.value = position.position.id;
                        option.textContent = position.position.name;

                        positionSelect.appendChild(option);
                    }
                });
            }
        } else {
            console.error('Failed to load positions for dropdown.');
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}

populateSpecializedPosition();

const filters = {
    position: '',
    specializedPosition: ''
};

async function setupEmployeeFilters() {
    Object.keys(filters).forEach(filter => {
        const element = document.getElementById(filter);
        if (element) {
            element.addEventListener('change', () => {
                filters[filter] = element.value;
                applyEmployeeFilters(element.value);
            });
        }
    });
}

async function applyEmployeeFilters(PositionId) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/employee/find-by-position', { PositionId });

        if (!response.ok) {
            console.error('Failed to load employees.');
            return;
        }

        const employees = await response.json();

        const employeeContainer = document.getElementById('employee-container');
        employeeContainer.innerHTML = '';

        employees.forEach(employee => {
            const employeeRow = document.createElement('tr');
                    
            const firstNameCell = document.createElement('td');
            const lastNameCell = document.createElement('td');
            const positionCell = document.createElement('td');
            const emailCell = document.createElement('td');
            const phoneCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            firstNameCell.textContent = employee.FirstName;
            lastNameCell.textContent = employee.LastName;
            positionCell.textContent = employee.specializedPosition.name;
            emailCell.textContent = employee.Email;
            phoneCell.textContent = employee.Phone;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.onclick = () => openEditEmployeeModal(employee);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteEmployee(employee.EmployeeID);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            employeeRow.appendChild(firstNameCell);
            employeeRow.appendChild(lastNameCell);
            employeeRow.appendChild(positionCell);
            employeeRow.appendChild(emailCell);
            employeeRow.appendChild(phoneCell);
            employeeRow.appendChild(actionsCell);

            employeeContainer.appendChild(employeeRow);
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

setupEmployeeFilters();
