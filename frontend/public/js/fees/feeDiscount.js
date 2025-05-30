function initializeAddFeeDiscountForm() {
    const addForm = document.getElementById('feeDiscountForm');

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const feeDiscountDetails = {
            students: document.getElementById('feeDiscountStudentId').value.trim(),
            DiscountAmount: document.getElementById('feeDiscountAmount').value.trim(),
            AwardDate: document.getElementById('feeDiscountDate').value.trim(),
            DiscountStatus: document.getElementById('feeDiscountStatus').value.trim(),
        }

        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/feeDiscount/add', feeDiscountDetails);

            if (response.ok) {
                alert('Fee discount item added successfully!');
                toggleModal('#feeDiscountForm', '#modalOverlayFeeDiscount');
                loadFeeDiscount();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add Fee Discount');
            }
        } catch (error) {
            console.error('Error adding fee discount:', error);
            alert('Failed to add fee discount. Please try again.');
        }
    });
}

async function loadFeeDiscount() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/feeDiscount/viewAll');

        if (response.ok) {
            const feeDiscounts = await response.json();
            const feeDiscountContainer = document.getElementById('fee-discount-container');
            
            if (feeDiscountContainer) {
                feeDiscountContainer.innerHTML = '';
                feeDiscounts.forEach(feeDiscount => {
                    const feeDiscountRow = document.createElement('tr');

                    const studentIdCell = document.createElement('td');
                    studentIdCell.textContent = feeDiscount.StudentId;

                    const amountCell = document.createElement('td');
                    amountCell.textContent = feeDiscount.DiscountAmount;

                    const dateCell = document.createElement('td');
                    dateCell.textContent = new Date(feeDiscount.AwardDate).toLocaleDateString();

                    const statusCell = document.createElement('td');
                    statusCell.textContent = feeDiscount.DiscountStatus;

                    const actionsCell = document.createElement('td');

                    const editButton = document.createElement('button');
                    editButton.className = 'edit-btn';
                    editButton.textContent = 'Edit';
                    editButton.onclick = () => openEditFeeDiscountModal(feeDiscount);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-btn';
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteFeeDiscount(feeDiscount.DiscountId);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    feeDiscountRow.appendChild(studentIdCell);
                    feeDiscountRow.appendChild(amountCell);
                    feeDiscountRow.appendChild(dateCell);
                    feeDiscountRow.appendChild(statusCell);
                    feeDiscountRow.appendChild(actionsCell);

                    feeDiscountContainer.appendChild(feeDiscountRow);
                });
            }
        } else {
            console.error('Failed to load fee discounts.');
        }
    } catch (error) {
        console.error('Error fetching fee discounts:', error);
    }
}

function openEditFeeDiscountModal(feeDiscount) {
    document.getElementById('editFeeDiscountId').value = feeDiscount.DiscountId;
    document.getElementById('editFeeDiscountStudentId').value = feeDiscount.StudentId;
    document.getElementById('editFeeDiscountAmount').value = feeDiscount.DiscountAmount;
    document.getElementById('editFeeDiscountDate').value = new Date(feeDiscount.AwardDate).toISOString().split('T')[0];
    document.getElementById('editFeeDiscountStatus').value = feeDiscount.DiscountStatus;
    toggleModal('#editFeeDiscountModal', '#modalOverlay');
}

async function deleteFeeDiscount(DiscountId) {
    if (confirm('Are you sure you want to delete this fee discount?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/feeDiscount/delete', { DiscountId });

            if (response.ok) {
                alert('Fee discount deleted successfully!');
                loadFeeDiscount();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete fee discount');
            }
        } catch (error) {
            console.error('Error deleting fee discount:', error);
            alert('Failed to delete fee discount');
        }
    }
}
