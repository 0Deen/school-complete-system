function calculateNetPay(salary, bonus, deductions) {
    return (parseFloat(salary) || 0) + (parseFloat(bonus) || 0) - (parseFloat(deductions) || 0);
}

function addBonusField() {
    const bonusContainer = document.getElementById('addBonusContainer');
    const bonusFieldDiv = document.createElement('div');
    bonusFieldDiv.classList.add('bonus-field');

    bonusFieldDiv.innerHTML = `
        <input type="text" class="bonus-name" placeholder="Bonus Name" required>
        <input type="number" class="bonus-value" placeholder="Amount" required>
        <button type="button" onclick="removeBonusField(this)">Remove</button>
    `;

    bonusContainer.appendChild(bonusFieldDiv);
}

function removeBonusField(button) {
    const bonusFieldDiv = button.parentElement;
    bonusFieldDiv.remove();
}

function addDeductionField() {
    const deductionContainer = document.getElementById('addDeductionsContainer');
    const deductionFieldDiv = document.createElement('div');
    deductionFieldDiv.classList.add('deduction-field');

    deductionFieldDiv.innerHTML = `
        <input type="text" class="deduction-name" placeholder="Deduction Name" required>
        <input type="number" class="deduction-value" placeholder="Amount" required>
        <button type="button" onclick="removeDeductionField(this)">Remove</button>
    `;

    deductionContainer.appendChild(deductionFieldDiv);
}

// Function to remove deduction input field
function removeDeductionField(button) {
    const deductionFieldDiv = button.parentElement;
    deductionFieldDiv.remove();
}

// Function to collect all bonus and deduction values and send them along with the other payroll details
async function initializeAddPayrollForm() {
    try {
        const employeeIdInput = document.getElementById('addEmployeeSelect');
        const salaryInput = document.getElementById('addSalary');
        const bonusInputs = document.querySelectorAll('#addBonusContainer .bonus-name');
        const bonusValues = document.querySelectorAll('#addBonusContainer .bonus-value');
        const deductionInputs = document.querySelectorAll('#addDeductionsContainer .deduction-name');
        const deductionValues = document.querySelectorAll('#addDeductionsContainer .deduction-value');
        const payDateInput = document.getElementById('addPayDate');
        const paymentMethodInput = document.getElementById('addPaymentMethod');

        // Gather all bonus and deduction data
        const bonuses = [];
        for (let i = 0; i < bonusInputs.length; i++) {
            bonuses.push({
                name: bonusInputs[i].value,
                amount: bonusValues[i].value
            });
        }

        const deductions = [];
        for (let i = 0; i < deductionInputs.length; i++) {
            deductions.push({
                name: deductionInputs[i].value,
                amount: deductionValues[i].value
            });
        }

        const netPay = calculateNetPay(salaryInput.value, bonuses.reduce((acc, item) => acc + parseFloat(item.amount), 0), deductions.reduce((acc, item) => acc + parseFloat(item.amount), 0));

        // Prepare data to be sent
        const payrollDetails = {
            EmployeeID: employeeIdInput.value,
            BaseSalary: parseFloat(salaryInput.value),
            Bonus: bonuses,
            Deductions: deductions,
            NetPay: netPay,
            PayDate: payDateInput.value,
            PaymentMethod: paymentMethodInput.value,
        };

        // Send payroll details via API
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/payroll/create', payrollDetails);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add Payroll');
        }

        alert('Employee Payroll was added successfully.');
        toggleModal('#addPayrollModal', '#modalOverlay');
        loadPayroll();

    } catch (error) {
        console.error('Error adding payroll:', error);
        alert(`Failed to add payroll. ${error.message}`);
    }
}


/* async function initializeAddPayrollForm() {
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

        const bonusInputs = document.querySelectorAll('.bonusInput');
        let totalBonus = 0;
        bonusInputs.forEach(input => totalBonus += parseFloat(input.value) || 0);

        // Calculate Total Deductions
        const deductionsInputs = document.querySelectorAll('.deductionsInput');
        let totalDeductions = 0;
        deductionsInputs.forEach(input => totalDeductions += parseFloat(input.value) || 0);

        const netPay = calculateNetPay(salary, bonus, deductions);
        netPayInput.value = netPay.toFixed(2);

        const payrollDetails = {
            EmployeeID: employeeId,
            BaseSalary: parseFloat(salary) || 0,
            Bonus: totalBonus,
            Deductions: totalDeductions,
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
        loadPayroll();

    } catch (error) {
        console.error('Error adding payroll:', error);
        alert(`Failed to add payroll. ${error.message}`);
    }
} */


 async function loadPayroll() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/payroll/viewAll');

        if (response.ok) {
            const payrolls = (await response.json()).payrolls;

            const payrollContainer = document.getElementById('payroll-container');
            const searchQuery = document.getElementById('searchPayroll').value.toLowerCase();

            if (payrollContainer) {
                payrollContainer.innerHTML = '';

                const payrollsFilter = payrolls.filter(payroll => {
                    return (!searchQuery || 
                        payroll.employee.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payroll.employee.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payroll.BaseSalary.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payroll.Bonus.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payroll.Deductions.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payroll.NetPay.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payroll.PayDate.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payroll.PaymentMethod.toString().toLowerCase().includes(searchQuery.toLowerCase())
                    );
                });
                
                payrollsFilter.forEach(payroll => {
                    const payrollRow = document.createElement('tr');

                    const firstNameCell = document.createElement('td');
                    const lastNameCell = document.createElement('td');
                    const salaryCell = document.createElement('td');
                    const bonusCell = document.createElement('td');
                    const deductionsCell = document.createElement('td');
                    const netPayCell = document.createElement('td');
                    const payDateCell = document.createElement('td');
                    const paymentMethodCell = document.createElement('td');
                    const actionsCell = document.createElement('td');

                    firstNameCell.textContent = payroll.employee.FirstName;
                    lastNameCell.textContent = payroll.employee.LastName;
                    salaryCell.textContent = payroll.BaseSalary;
                    bonusCell.textContent = payroll.Bonus;
                    deductionsCell.textContent = payroll.Deductions;
                    netPayCell.textContent = payroll.NetPay;
                    payDateCell.textContent = payroll.PayDate;
                    paymentMethodCell.textContent = payroll.PaymentMethod;


                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('edit-btn');
                    editButton.onclick = () => openEditPayrollModal(payroll);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.onclick = () => deletePayroll(payroll.PayrollID);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    payrollRow.appendChild(firstNameCell);
                    payrollRow.appendChild(lastNameCell);
                    payrollRow.appendChild(salaryCell);
                    payrollRow.appendChild(bonusCell);
                    payrollRow.appendChild(deductionsCell);
                    payrollRow.appendChild(netPayCell);
                    payrollRow.appendChild(payDateCell);
                    payrollRow.appendChild(paymentMethodCell);
                    payrollRow.appendChild(actionsCell);

                    payrollContainer.appendChild(payrollRow);
                });
            } else {
                console.error('Failed to load Payroll');
            }
        }
    } catch (error) {
        console.error('Error loading Payroll:', error);
    }
} 

document.getElementById('searchPayroll').addEventListener('input', loadPayroll);

loadPayroll();

async function openEditPayrollModal(payroll) {
    document.getElementById('editEmployeeId').value = `${payroll.employee.FirstName} ${payroll.employee.LastName}`;
    document.getElementById('editSalary').value = payroll.Salary;
    document.getElementById('editBonus').value = payroll.Bonus;
    document.getElementById('editDeductions').value = payroll.Deductions;
    document.getElementById('editPayDate').value = payroll.PayDate;
    document.getElementById('editPaymentMethod').value = payroll.PaymentMethod;
    

    toggleModal('#editPayrollModal', '#modalOverlay');
}

async function deletePayroll(payrollID) {
    if (confirm('Are you sure you want to delete this payroll?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/payroll/delete', { PayrollID: payrollID });

            if (response.ok) {
                alert('Payroll Deleted successfully!');
                loadPayroll();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete Payroll');
            }
        } catch (error) {
            console.error('Error deleting payroll', error);
            alert('Failed to delete Payroll');
        }
    }
}

async function populateEmployeeDropdown() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/employee/viewall');

        if (response.ok) {
            const employees = await response.json();
            const employeeSelect = document.getElementById('addEmployeeSelect');

            if (employeeSelect) {
                employeeSelect.innerHTML = '<option value="">Select an employee</option>';

                employees.forEach(employee => {
                    const option = document.createElement('option');
                    option.value = employee.EmployeeID;
                    option.textContent = `${employee.FirstName} ${employee.LastName}`;
                    employeeSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to load employees for dropdown.');
        }
    } catch (e) {
        console.error('Error fetching employees for dropdown:', e);
    }
}

populateEmployeeDropdown();

const filters = {
    searchPayroll: '',
    method: '',
};

function setupPayrollFilters() {
    Object.keys(filters).forEach(filter => {
        const element = document.getElementById(filter);
        if (element) {
            element.addEventListener('change', () => {
                filters[filter] = element.value;
                applyPayrollFilters(element.value);
            });
        }
    });
}

async function applyPayrollFilters(PositionId) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/payroll/viewPosition',  { PositionId } );

        if (!response.ok) {
            console.error('Failed to load payroll records.');
            return;
        }

        const payrollData = await response.json();

        const payrolls = payrollData.payrolls;

        const payrollContainer = document.getElementById('payroll-container');
        payrollContainer.innerHTML = '';

        payrolls.forEach(payroll => {
            const payrollRow = document.createElement('tr');
            const firstNameCell = document.createElement('td');
            const lastNameCell = document.createElement('td');
            const salaryCell = document.createElement('td');
            const bonusCell = document.createElement('td');
            const deductionsCell = document.createElement('td');
            const netPayCell = document.createElement('td');
            const payDateCell = document.createElement('td');
            const paymentMethodCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            firstNameCell.textContent = payroll.employee.FirstName;
            lastNameCell.textContent = payroll.employee.LastName;
            salaryCell.textContent = payroll.BaseSalary;
            bonusCell.textContent = payroll.Bonus;
            deductionsCell.textContent = payroll.Deductions;
            netPayCell.textContent = payroll.NetPay;
            payDateCell.textContent = payroll.PayDate;
            paymentMethodCell.textContent = payroll.PaymentMethod;


            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.onclick = () => openEditPayrollModal(payroll);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deletePayroll(payroll.PayrollID);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            payrollRow.appendChild(firstNameCell);
            payrollRow.appendChild(lastNameCell);
            payrollRow.appendChild(salaryCell);
            payrollRow.appendChild(bonusCell);
            payrollRow.appendChild(deductionsCell);
            payrollRow.appendChild(netPayCell);
            payrollRow.appendChild(payDateCell);
            payrollRow.appendChild(paymentMethodCell);
            payrollRow.appendChild(actionsCell);

            payrollContainer.appendChild(payrollRow);
        });
    } catch (error) {
        console.error('Error fetching payroll records:', error);
    }
}

setupPayrollFilters();


const paymentMethod = async () => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/payroll/viewAll');
        if (response.ok) {
            const methods = await response.json();
            const methodPay = methods.payrolls;
            
            const methodSelect = document.getElementById('method');

            if (methodSelect) {
                methodSelect.innerHTML = '<option value="">Filter by Payment</option>';

                const uniquePositions = new Set();

                methodPay.forEach(method => {
                    if (!uniquePositions.has(method.PaymentMethod)) {
                        uniquePositions.add(method.PaymentMethod);

                        const option = document.createElement('option');
                        option.value = method.employee.EmployeeID;
                        option.textContent = method.PaymentMethod;

                        methodSelect.appendChild(option);
                    }
                });
            }
        } else {
            console.error('Failed to load payment method for dropdown.');
        }
    } catch (error) {
        console.error('Error fetching payment method:', error);
    }
}

paymentMethod();
