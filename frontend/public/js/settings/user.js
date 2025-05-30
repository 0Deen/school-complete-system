const addUser = async () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const employeeRef = document.getElementById('employeeRef').value;
    const role = document.getElementById('addRole').value;
    const status = document.getElementById('addStatus').value;
    const password = document.getElementById('addPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!firstName || !lastName || !email || !phone || !employeeRef || !role || !status || !password || !confirmPassword) {
        alert('Please fill in all the fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    try {
        const payload = {firstName,lastName,email,phone,employeeRef,role,status,password};

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/user/register', payload);

        if (response.ok) {
            alert('User added successfully');
            toggleModal('#addUserModal', '#modalOverlay');
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add user');
        }
    } catch (error) {
        console.error('Error adding user', error);
        alert('Failed to add user. Please try again.');
    }
};


const loadUsers = async()=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/user/viewall');
        if(response.ok){
            const users = await response.json();
            const usersContainer = document.getElementById('users-container');
            usersContainer.innerHTML = '';

            users.forEach(user => {
                const userRow = document.createElement('tr');

                const firstNameCell = document.createElement('td');
                const lastNameCell = document.createElement('td');
                const emailCell = document.createElement('td');
                const phoneCell = document.createElement('td');
                const roleCell = document.createElement('td');
                const statusCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                firstNameCell.textContent = user.firstName;
                lastNameCell.textContent = user.lastName;
                emailCell.textContent = user.email;
                phoneCell.textContent = user.phone;
                roleCell.textContent = user.role;
                statusCell.textContent = user.status;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => openEditModal(user);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => deleteUser(user.user_id);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                userRow.appendChild(firstNameCell);
                userRow.appendChild(lastNameCell);
                userRow.appendChild(emailCell);
                userRow.appendChild(phoneCell);
                userRow.appendChild(roleCell);
                userRow.appendChild(statusCell);
                userRow.appendChild(actionsCell);

                usersContainer.appendChild(userRow);
            });
        }else{
            alert('An error ocurred, please try again');
        }
    } catch (error) {
        throw error;
    }
}

loadUsers()

const openEditModal = async(user) => {
    document.getElementById('userId').value = user.user_id;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPhone').value = user.phone;
    document.getElementById('editEmployeeRef').value = user.employeeRef;
    document.getElementById('editRole').value = user.role;
    document.getElementById('editStatus').value = user.status;

    toggleModal('#editUserModal', '#modalOverlay');
}

const deleteUser = async(userId) => {
    try {
        if(!confirm('Are you sure you want to delete this user?')) return;
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/user/delete', userId);

        if(response.ok){
            alert('User deleted Succesfully!');
            loadUsers();
        } else{
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete User.');
        }
    } catch (error) {
        throw error;
    }
}

const editUser = async () => {
    // Get values from the form fields
    const userId = document.getElementById('userId').value;
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const employeeRef = document.getElementById('editEmployeeRef').value;
    const role = document.getElementById('editRole').value;
    const status = document.getElementById('editStatus').value;
    const password = document.getElementById('editPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate that all required fields are filled (except password fields)
    if (!firstName || !lastName || !email || !phone || !employeeRef || !role || !status) {
        alert('Please fill in all the fields.');
        return;
    }

    // Validate that passwords match if both are provided
    if (password && password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    try {
        // Create the payload to be sent to the server
        const payload = { userId, firstName, lastName, email, phone, employeeRef, role, status };

        // Add password to the payload if it's provided
        if (password) {
            payload.password = password;
        }

        // Send a PUT or PATCH request to update the user
        const response = await fetchRequest(`http://localhost:3000/api/simba-systems/user/${userId}`, payload);

        if (response.ok) {
            alert('User updated successfully');
            toggleModal('#editUserModal', '#modalOverlay');
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }
    } catch (error) {
        console.error('Error editing user', error);
        alert('Failed to update user. Please try again.');
    }
};


async function populateEmployeeDropdown() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/employee/viewall');

        if (response.ok) {
            const employees = await response.json();

            const employeeSelect = document.getElementById('employeeRef');

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

populateEmployeeDropdown()