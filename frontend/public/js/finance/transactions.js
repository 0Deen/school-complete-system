async function loadTransactions() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/transaction/viewAll');

        if (response.ok) {
            const transactions = await response.json();

            const transactionsContainer = document.getElementById('transactions-container');
            const searchQuery = document.getElementById('searchTransaction').value.toLowerCase();

            transactionsContainer.innerHTML = '';

            const transactionsFilter = transactions.filter(transaction => {

                return (
                    !searchQuery ||
                    transaction.transaction.transactionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    transaction.transaction.transactionMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    transaction.transaction.amount.includes(searchQuery) ||
                    transaction.transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    transaction.transaction.operation.includes(searchQuery) ||
                    transaction.transaction.date.includes(searchQuery) ||
                    transaction.account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    transaction.account.accountNumber.includes(searchQuery)
                );
            });
            

            transactionsFilter.forEach(transaction => {
                const transactionRow = document.createElement('tr');

                const accountCell = document.createElement('td');
                const typeCell = document.createElement('td');
                const amountCell = document.createElement('td');
                const dateCell = document.createElement('td');
                const operationCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                accountCell.textContent = transaction.account.accountName;
                typeCell.textContent = transaction.transaction.transactionType;
                amountCell.textContent = transaction.transaction.amount;
                dateCell.textContent = transaction.transaction.date
                operationCell.textContent = transaction.transaction.operation;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => {
                    openEdittransactionsModal(transaction);
                }

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = async() => {
                    if (confirm('Are you sure you want to delete this transaction?')) {
                        try {
                            const response = await fetchRequest('http://localhost:3000/api/simba-systems/transaction/delete', { transactionId:transaction.transaction.transactionId });
                
                            if (response.ok) {
                                alert('Deleted successfully!');
                                loadTransactions();
                            } else {
                                const error = await response.json();
                                throw new Error(error.message || 'Failed to delete transactions transaction');
                            }
                        } catch (error) {
                            console.error('Error deleting transactions transaction:', error);
                            alert('Failed to delete transactions transaction');
                        }
                    }
                };

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                transactionRow.appendChild(accountCell);
                transactionRow.appendChild(typeCell);
                transactionRow.appendChild(amountCell);
                transactionRow.appendChild(dateCell);
                transactionRow.appendChild(operationCell);
                transactionRow.appendChild(actionsCell);

                transactionsContainer.appendChild(transactionRow);
            });
        } else {
            console.error('Failed to load transactions transactions.');
        }
    } catch (error) {
        console.error('Error fetching transactions transactions:', error);
    }
}

document.getElementById('searchTransaction').addEventListener('input', loadTransactions);
loadTransactions();

async function initializeAddTransactionsForm() {
    const transactionDetails = {
        accountId: document.getElementById('addAccount').value,
        /* transactionRef: document.getElementById('addTransactionRef').value, */
        amount: document.getElementById('addBankTransactionAmount').value,
        date: document.getElementById('addBankTransactionDate').value,
        transactionMode: document.getElementById('addBankTransactionType').value,
        description: document.getElementById('addTransactionDescription').value,
        operation: document.getElementById('addBankTransactionType').value,
    };

    if (
        !transactionDetails.accountId ||
        !transactionDetails.transactionMode ||
        !transactionDetails.amount ||
        !transactionDetails.date ||
        !transactionDetails.operation
    ) {
        alert('Please fill all the required fields.');
        return;
    }

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/transaction/create', { transactionDetails });

        if (response.ok) {
            alert('Transaction added successfully!');
            toggleModal('#addModal', '#modalOverlay');
            loadTransactions();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add transaction');
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        alert('Failed to add transaction. Please try again.');
    }
}


function openEdittransactionsModal(transaction) {
    document.getElementById('edittransactionsTransactionId').value = transaction.transactionId;
    document.getElementById('edittransactionsAccountNumber').value = transaction.accountNumber;
    document.getElementById('edittransactionsAccountHolder').value = transaction.accountHolder;
    document.getElementById('edittransactionsAmount').value = transaction.amount;
    document.getElementById('edittransactionsTransactionDate').value = new Date(transaction.transactionDate).toISOString().split('T')[0];
    document.getElementById('edittransactionsTransactionType').value = transaction.transactionType;
    toggleModal('#edittransactionsModal', '#modalOverlay');
}
async function populateAccountsDropdown() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/account/viewAll');

        if (response.ok) {
            const accounts = await response.json();
            const accountSelect = document.getElementById('addAccount');

            if (accountSelect) {
                accountSelect.innerHTML = '<option value="">Select an Account</option>';

                accounts.forEach(account => {
                    const option = document.createElement('option');
                    option.value = account.accountNumber;
                    option.textContent = `${account.accountName}`;

                    accountSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to load accounts for dropdown.');
        }
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
}

populateAccountsDropdown();


async function initializeEditTransactionsForm() {
    const transactionData = {
        account: document.getElementById('editAccount').value,
        transactionType: document.getElementById('editBankTransactionType').value,
        amount: document.getElementById('editBankTransactionAmount').value,
        date: document.getElementById('editBankTransactionDate').value,
    };

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/transactions/edit', transactionData);
           
        if (response.ok) {
            alert('Transaction updated successfully!');
            toggleModal('#editTransactionModal', '#transactionModalOverlay');
            loadTransactions();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update transaction');
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        alert('Failed to update transaction. Please try again.');
    }
}
