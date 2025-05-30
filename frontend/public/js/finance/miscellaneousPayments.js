function initializeAddMiscellaneousPayment() {
    const paymentForm = document.getElementById('addPaymentModal');

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const paymentDetails = {
            description: document.getElementById('addPaymentDescription').value.trim(),
            amount: document.getElementById('addPaymentAmount').value.trim(),
            date: document.getElementById('addPaymentDate').value.trim(),
        }

        try {
            const response = await fetch('http://localhost:3000/api/simba-systems/miscellaneousPayments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentDetails)
            });

            if (response.ok) {
                alert('Miscellaneous payment added successfully!');
                toggleModal('#addPaymentModal', '#modalOverlay');
                loadMiscellaneousPayments();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add miscellaneous payment');
            }
        } catch (error) {
            console.error('Error adding miscellaneous payment:', error);
            alert('Failed to add miscellaneous payment. Please try again.');
        }
    });
}

async function loadMiscellaneousPayments() {
    try {
        const response = await fetch('http://localhost:3000/api/simba-systems/miscellaneousPayments/viewAll');

        if (response.ok) {
            const payments = await response.json();
            const paymentsContainer = document.getElementById('payments-container');

            if (paymentsContainer) {
                paymentsContainer.innerHTML = '';

                payments.forEach(payment => {
                    const paymentRow = document.createElement('tr');

                    const descriptionCell = document.createElement('td');
                    const amountCell = document.createElement('td');
                    const dateCell = document.createElement('td');
                    const actionsCell = document.createElement('td');

                    descriptionCell.textContent = payment.description;
                    amountCell.textContent = payment.amount;
                    dateCell.textContent = payment.date;

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('edit-btn');
                    editButton.onclick = () => openEditMiscellaneousPaymentModal(payment);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.onclick = () => confirmDeleteMiscellaneousPayment(payment.paymentId);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    paymentRow.appendChild(descriptionCell);
                    paymentRow.appendChild(amountCell);
                    paymentRow.appendChild(dateCell);
                    paymentRow.appendChild(actionsCell);

                    paymentsContainer.appendChild(paymentRow);
                });
            }
        } else {
            console.error('Failed to load miscellaneous payments.');
        }
    } catch (error) {
        console.error('Error fetching miscellaneous payments:', error);
    }
}

function openEditMiscellaneousPaymentModal(payment) {
    document.getElementById('editPaymentId').value = payment.paymentId;
    document.getElementById('editPaymentDescription').value = payment.description;
    document.getElementById('editPaymentAmount').value = payment.amount;
    document.getElementById('editPaymentDate').value = new Date(payment.date).toISOString().split('T')[0];
    toggleModal('#editPaymentModal', '#modalOverlay');
}

async function confirmDeleteMiscellaneousPayment(paymentId) {
    if (confirm('Are you sure you want to delete this miscellaneous payment?')) {
        await deleteMiscellaneousPayment(paymentId);
    }
}

async function deleteMiscellaneousPayment(paymentId) {
    try {
        const response = await fetch('http://localhost:3000/api/simba-systems/miscellaneousPayments/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentId }),
        });

        if (response.ok) {
            alert('Miscellaneous payment deleted successfully!');
            loadMiscellaneousPayments();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete miscellaneous payment');
        }
    } catch (error) {
        console.error('Error deleting miscellaneous payment:', error);
        alert('Failed to delete miscellaneous payment');
    }
}
