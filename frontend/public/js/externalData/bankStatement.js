async function importBankStatement() {
    const fileInput = document.getElementById('bankStatementFile');
    
    if (fileInput.files.length === 0) {
        alert('Please select a file to import.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bank-statement/import', formData);

        if (response.ok) {
            alert('Bank statement imported successfully!');
            loadBankStatements();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to import bank statement');
        }
    } catch (error) {
        console.error('Error importing bank statement:', error);
        alert('Failed to import bank statement. Please try again.');
    }
}

async function loadBankStatements() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bank-statement/viewAll');
        if (response.ok) {
            const bankStatements = await response.json();
            const bankStatementContainer = document.getElementById('bank-statement-container');
            
            if (bankStatementContainer) {
                bankStatementContainer.innerHTML = '';
                bankStatements.forEach(statement => {
                    const statementRow = document.createElement('tr');
                    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = new Date(statement.Date).toLocaleDateString();

                    const amountCell = document.createElement('td');
                    amountCell.textContent = statement.Amount;

                    const descriptionCell = document.createElement('td');
                    descriptionCell.textContent = statement.Description;

                    const actionsCell = document.createElement('td');

                    const editButton = document.createElement('button');
                    editButton.className = 'edit-btn';
                    editButton.textContent = 'Edit';
                    editButton.onclick = () => openEditBankStatementModal(statement);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-btn';
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteBankStatement(statement.StatementId);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    statementRow.appendChild(dateCell);
                    statementRow.appendChild(amountCell);
                    statementRow.appendChild(descriptionCell);
                    statementRow.appendChild(actionsCell);

                    bankStatementContainer.appendChild(statementRow);
                });
            }
        } else {
            console.error('Failed to load bank statements.');
        }
    } catch (error) {
        console.error('Error fetching bank statements:', error);
    }
}

function openEditModal(statement) {
    document.getElementById('editStatementId').value = statement.StatementId;
    document.getElementById('editStatementDate').value = new Date(statement.Date).toISOString().split('T')[0];
    document.getElementById('editStatementAmount').value = statement.Amount;
    document.getElementById('editStatementDescription').value = statement.Description;
    toggleModal('#editBankStatementModal', '#modalOverlay');
}

async function deleteBankStatement(statementId) {
    if (confirm('Are you sure you want to delete this bank statement?')) {
        try {
            const response = await fetchRequest(`http://localhost:3000/api/simba-systems/bank-statement/delete/${statementId}`, {
                method: 'POST',
            });

            if (response.ok) {
                alert('Bank statement deleted successfully!');
                loadBankStatements();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete bank statement');
            }
        } catch (error) {
            console.error('Error deleting bank statement:', error);
            alert('Failed to delete bank statement. Please try again.');
        }
    }
}
