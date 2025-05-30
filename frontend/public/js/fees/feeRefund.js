function initializeAddFeeRefundForm() {
    const addForm = document.getElementById('feeRefundForm');

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const feeRefundDetails = {
            students: document.getElementById('feeRefundStudentId').value.trim(),
            RefundAmount: document.getElementById('feeRefundAmount').value.trim(),
            RefundDate: document.getElementById('feeRefundDate').value.trim(),
            RefundStatus: document.getElementById('feeRefundStatus').value.trim(),
        }

        try {
            const response = await fetch('http://localhost:3000/api/simba-systems/feeRefund/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feeRefundDetails)
            });

            if (response.ok) {
                alert('Fee refund item added successfully!');
                toggleModal('#feeRefundForm', '#modalOverlayFeeRefund');
                loadFeeRefund();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add Fee Refund');
            }
        } catch (error) {
            console.error('Error adding fee refund:', error);
            alert('Failed to add fee refund. Please try again.');
        }
    });
}

async function loadFeeRefund() {
    try {
        const response = await fetch('http://localhost:3000/api/simba-systems/feeRefund/viewAll');

        if (response.ok) {
            const feeRefunds = await response.json();
            const feeRefundContainer = document.getElementById('fee-refund-container');
            
            if (feeRefundContainer) {
                feeRefundContainer.innerHTML = '';
                feeRefunds.forEach(feeRefund => {
                    const feeRefundRow = document.createElement('tr');

                    const studentIdCell = document.createElement('td');
                    studentIdCell.textContent = feeRefund.StudentId;

                    const amountCell = document.createElement('td');
                    amountCell.textContent = feeRefund.RefundAmount;

                    const dateCell = document.createElement('td');
                    dateCell.textContent = new Date(feeRefund.RefundDate).toLocaleDateString();

                    const statusCell = document.createElement('td');
                    statusCell.textContent = feeRefund.RefundStatus;

                    const actionsCell = document.createElement('td');

                    const editButton = document.createElement('button');
                    editButton.className = 'edit-btn';
                    editButton.textContent = 'Edit';
                    editButton.onclick = () => openEditFeeRefundModal(feeRefund);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-btn';
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteFeeRefund(feeRefund.RefundId);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    feeRefundRow.appendChild(studentIdCell);
                    feeRefundRow.appendChild(amountCell);
                    feeRefundRow.appendChild(dateCell);
                    feeRefundRow.appendChild(statusCell);
                    feeRefundRow.appendChild(actionsCell);

                    feeRefundContainer.appendChild(feeRefundRow);
                });
            }
        } else {
            console.error('Failed to load fee refunds.');
        }
    } catch (error) {
        console.error('Error fetching fee refunds:', error);
    }
}

function openEditFeeRefundModal(feeRefund) {
    document.getElementById('editFeeRefundId').value = feeRefund.RefundId;
    document.getElementById('editFeeRefundStudentId').value = feeRefund.StudentId;
    document.getElementById('editFeeRefundAmount').value = feeRefund.RefundAmount;
    document.getElementById('editFeeRefundDate').value = new Date(feeRefund.RefundDate).toISOString().split('T')[0];
    document.getElementById('editFeeRefundStatus').value = feeRefund.RefundStatus;
    toggleModal('#editFeeRefundModal', '#modalOverlay');
}

async function deleteFeeRefund(RefundId) {
    if (confirm('Are you sure you want to delete this fee refund?')) {
        try {
            const response = await fetch('http://localhost:3000/api/simba-systems/feeRefund/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ RefundId }),
            });

            if (response.ok) {
                alert('Fee refund deleted successfully!');
                loadFeeRefund();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete fee refund');
            }
        } catch (error) {
            console.error('Error deleting fee refund:', error);
            alert('Failed to delete fee refund');
        }
    }
}
