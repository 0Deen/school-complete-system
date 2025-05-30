function initializeAddFeeReminderForm() {
    const addForm = document.getElementById('feeReminderForm');

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const feeReminderDetails = {
            students: document.getElementById('feeReminderStudentId').value.trim(),
            ReminderAmount: document.getElementById('feeReminderAmount').value.trim(),
            ReminderDate: document.getElementById('feeReminderDate').value.trim(),
            ReminderStatus: document.getElementById('feeReminderStatus').value.trim(),
        }

        try {
            const response = await fetch('http://localhost:3000/api/simba-systems/feeReminder/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feeReminderDetails)
            });

            if (response.ok) {
                alert('Fee reminder item added successfully!');
                toggleModal('#feeReminderForm', '#modalOverlayFeeReminder');
                loadFeeReminder();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add Fee Reminder');
            }
        } catch (error) {
            console.error('Error adding fee reminder:', error);
            alert('Failed to add fee reminder. Please try again.');
        }
    });
}

async function loadFeeReminder() {
    try {
        const response = await fetch('http://localhost:3000/api/simba-systems/feeReminder/viewAll');

        if (response.ok) {
            const feeReminders = await response.json();
            const feeReminderContainer = document.getElementById('fee-reminder-container');
            
            if (feeReminderContainer) {
                feeReminderContainer.innerHTML = '';
                feeReminders.forEach(feeReminder => {
                    const feeReminderRow = document.createElement('tr');

                    const studentIdCell = document.createElement('td');
                    studentIdCell.textContent = feeReminder.StudentId;

                    const amountCell = document.createElement('td');
                    amountCell.textContent = feeReminder.ReminderAmount;

                    const dateCell = document.createElement('td');
                    dateCell.textContent = new Date(feeReminder.ReminderDate).toLocaleDateString();

                    const statusCell = document.createElement('td');
                    statusCell.textContent = feeReminder.ReminderStatus;

                    const actionsCell = document.createElement('td');

                    const editButton = document.createElement('button');
                    editButton.className = 'edit-btn';
                    editButton.textContent = 'Edit';
                    editButton.onclick = () => openEditFeeReminderModal(feeReminder);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-btn';
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteFeeReminder(feeReminder.ReminderId);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    feeReminderRow.appendChild(studentIdCell);
                    feeReminderRow.appendChild(amountCell);
                    feeReminderRow.appendChild(dateCell);
                    feeReminderRow.appendChild(statusCell);
                    feeReminderRow.appendChild(actionsCell);

                    feeReminderContainer.appendChild(feeReminderRow);
                });
            }
        } else {
            console.error('Failed to load fee reminders.');
        }
    } catch (error) {
        console.error('Error fetching fee reminders:', error);
    }
}

function openEditFeeReminderModal(feeReminder) {
    document.getElementById('editFeeReminderId').value = feeReminder.ReminderId;
    document.getElementById('editFeeReminderStudentId').value = feeReminder.StudentId;
    document.getElementById('editFeeReminderAmount').value = feeReminder.ReminderAmount;
    document.getElementById('editFeeReminderDate').value = new Date(feeReminder.ReminderDate).toISOString().split('T')[0];
    document.getElementById('editFeeReminderStatus').value = feeReminder.ReminderStatus;
    toggleModal('#editFeeReminderModal', '#modalOverlay');
}

async function deleteFeeReminder(ReminderId) {
    if (confirm('Are you sure you want to delete this fee reminder?')) {
        try {
            const response = await fetch('http://localhost:3000/api/simba-systems/feeReminder/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ReminderId }),
            });

            if (response.ok) {
                alert('Fee reminder deleted successfully!');
                loadFeeReminder();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete fee reminder');
            }
        } catch (error) {
            console.error('Error deleting fee reminder:', error);
            alert('Failed to delete fee reminder');
        }
    }
}
