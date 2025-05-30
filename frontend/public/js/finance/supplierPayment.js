async function initializeAddSupplierPayment() {
    const paymentData = {
        supplierName: document.getElementById('supplierName').value.trim(),
        paymentAmount: parseFloat(document.getElementById('paymentAmount').value.trim()),
        paymentDate: document.getElementById('paymentDate').value.trim(),
    };

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/supplierPayments/add', paymentData);
           
        if (response.ok) {
            alert('Supplier payment recorded successfully!');
            toggleModal('#addPaymentModal', '#paymentModalOverlay');
            loadSupplierPayments();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to record supplier payment');
        }
    } catch (error) {
        console.error('Error recording supplier payment:', error);
        alert('Failed to record supplier payment. Please try again.');
    }
}

async function loadSupplierPayments() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/supplierPayments/viewAll');

        if (response.ok) {
            const payments = await response.json();
            const supplierPaymentsTableBody = document.getElementById('supplierPaymentsTable').querySelector('tbody');

            if (supplierPaymentsTableBody) {
                supplierPaymentsTableBody.innerHTML = '';

                payments.forEach(payment => {
                    const paymentRow = document.createElement('tr');

                    const nameCell = document.createElement('td');
                    const amountCell = document.createElement('td');
                    const dateCell = document.createElement('td');

                    nameCell.textContent = payment.supplierName;
                    amountCell.textContent = payment.paymentAmount;
                    dateCell.textContent = payment.paymentDate;

                    paymentRow.appendChild(nameCell);
                    paymentRow.appendChild(amountCell);
                    paymentRow.appendChild(dateCell);

                    supplierPaymentsTableBody.appendChild(paymentRow);
                });
            }
        } else {
            console.error('Failed to load supplier payments.');
        }
    } catch (error) {
        console.error('Error fetching supplier payments:', error);
    }
}

async function deleteSupplierPayment(paymentId) {
    if (confirm('Are you sure you want to delete this supplier payment?')) {
        try {
            const response = await fetchRequest(`http://localhost:3000/api/simba-systems/supplierPayments/delete/${paymentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Supplier payment deleted successfully!');
                loadSupplierPayments();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete supplier payment');
            }
        } catch (error) {
            console.error('Error deleting supplier payment:', error);
            alert('Failed to delete supplier payment');
        }
    }
}

loadSupplierPayments();

async function initializeEditSupplierPayment() {

    const updatedPayment = {
        supplierName: document.getElementById('editSupplierName').value,
        paymentAmount: document.getElementById('editPaymentAmount').value,
        paymentDate: document.getElementById('editPaymentDate').value,
    };

    try {
        const response = await fetchRequest("http://localhost:3000/api/simba-systems/supplierPayments/edit", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPayment),
        });

        if (response.ok) {
            alert('Supplier payment updated successfully!');
            toggleModal('#editPaymentModal', '#editPaymentModalOverlay');
            loadSupplierPayments();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update supplier payment');
        }
    } catch (error) {
        console.error('Error updating supplier payment:', error);
        alert('Failed to update supplier payment. Please try again.');
    }
}
