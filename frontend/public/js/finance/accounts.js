async function addAccount() {
    const BankId = document.getElementById('addBank').value;
    const accountNumber = document.getElementById('addNumber').value;
    const accountName = document.getElementById('addName').value;
    const balance = document.getElementById('addBalance').value;

    if (!BankId || !accountNumber || !accountName || !balance) {
        alert('Please fill in all the fields.');
        return;
    }

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/account/create', { BankId, accountNumber, accountName, balance });
            
        if (response.ok) {
            alert('Account added successfully');
            toggleModal('#addAccountModal', '#modalOverlay');
            loadAccounts();
            resetAccounts();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add Account');
        }
    } catch (error) {
        console.error('Error adding account', error);
        alert('Failed to add account. Please try again.');
    }
}

const resetAccounts = async() => {
    document.getElementById('addBank').value = '';
    document.getElementById('addNumber').value = '';
    document.getElementById('addName').value = '';
    document.getElementById('addBalance').value = '';
}

const loadBanks = async(selectId, selected)=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bank/viewall')
        if(response.ok){
            const banks = await response.json();
            const bankSelect = document.getElementById(selectId);
            bankSelect.innerHTML = '';
            const option = document.createElement('option');
            if(selected){
                option.textContent = selected.Name;
                option.value = selected.BankId;
            }else{
                option.textContent = 'Select a bank for the Account';
                option.value = '';
            }
            bankSelect.appendChild(option);
            banks.forEach(bank=>{
                if(selected){
                    if(bank.BankId === selected.BankId)return;
                }
                const option = document.createElement('option');
                option.textContent = bank.Name;
                option.value = bank.BankId;
                bankSelect.appendChild(option);
            })
        }
    } catch (error) {
        throw error;
    }
}

async function loadAccounts() {
    try {
        loadBanks("addBank");

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/account/viewAll');

        if (response.ok) {
            const accounts = await response.json();
            const accountsContainer = document.getElementById('accounts-container');
            const searchQuery = document.getElementById('searchAccount').value.toLowerCase();

            if (accountsContainer) {
                accountsContainer.innerHTML = '';

                const accountsFilter = accounts.filter(account => {
                    return (
                        !searchQuery ||
                        account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        account.accountNumber.includes(searchQuery) ||
                        account.bank.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        account.bank.Branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        account.balance.includes(searchQuery)
                    );
                });                

                accountsFilter.forEach(account => {
                    const accountRow = document.createElement('tr');

                    const bankCell = document.createElement('td');
                    const nameCell = document.createElement('td');
                    const numberCell = document.createElement('td');
                    const balanceCell = document.createElement('td');
                    const actionsCell = document.createElement('td');

                    bankCell.textContent = account.bank.Name;
                    numberCell.textContent = account.accountNumber;
                    nameCell.textContent = account.accountName;
                    balanceCell.textContent = account.balance;

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('edit-btn');
                    editButton.onclick = () => {
                        document.getElementById('accountId').value = account.accountId;
                        document.getElementById('editAccountNumber').value = account.accountNumber;
                        document.getElementById('editName').value = account.accountName;
                        document.getElementById('editBalance').value = account.balance;
                        toggleModal('#editModal', '#modalOverlay');
                        loadBanks("editBank", account.bank);
                    }

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.onclick = () => deleteAccount(account.accountId);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    accountRow.appendChild(bankCell);
                    accountRow.appendChild(numberCell);
                    accountRow.appendChild(nameCell);
                    accountRow.appendChild(balanceCell);
                    accountRow.appendChild(actionsCell);

                    accountsContainer.appendChild(accountRow);
                });
            }
        } else {
            console.error('Failed to load accounts.');
        }
    } catch (error) {
        console.error('Error fetching accounts!', error);
    }
}

document.getElementById('searchAccount').addEventListener('input', loadAccounts);

loadAccounts();

async function deleteAccount(accountId) {
    try {
        if (!confirm('Are you sure you want to delete this account?'))return;
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/account/delete', { accountId });
           
        if (response.ok) {
            alert('Account deleted successfully!');
            loadAccounts();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete account');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
    }
}

async function editAccount() {
    const accountId = document.getElementById('accountId').value;
    const BankId = document.getElementById('editBank').value;
    const accountNumber = document.getElementById('editAccountNumber').value;
    const accountName = document.getElementById('editName').value;
    const balance = document.getElementById('editBalance').value;

    if (!BankId || !accountNumber || !accountName || !balance ) {
        alert('Please fill in all the fields.');
        return;
    }

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/account/edit',{accountId, BankId, accountNumber, accountName, balance});
           
        if (response.ok) {
            alert('Account updated successfully');
            toggleModal('#editModal', '#modalOverlay');
            loadAccounts();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update Account');
        }
    } catch (error) {
        console.error('Error updating account', error);
        alert('Failed to update account. Please try again.');
    }
}

const populateBanks = async()=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bank/viewall')
        if(response.ok){
            const banks = await response.json();
            const bankSelect = document.getElementById('bank');
            bankSelect.innerHTML = '<option vlaue="">Filter by bank</option>';

            const uniquePositions = new Set();

            banks.forEach(bank=>{
                if (!uniquePositions.has(bank.Name)) {
                    uniquePositions.add(bank.Name);

                    const option = document.createElement('option');
                    option.textContent = bank.Name;
                    option.value = bank.BankId;
                    bankSelect.appendChild(option);
                }
            })
        }
    } catch (error) {
        throw error;
    }
}

populateBanks();

const filters = {
    bank: '',
};

function setupBankFilters() {
    Object.keys(filters).forEach(filter => {
        const element = document.getElementById(filter);
        if (element) {
            element.addEventListener('change', () => {
                filters[filter] = element.value;
                applyBankFilters(element.value);
            });
        }
    });
}

async function applyBankFilters(BankId) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/account/view-specified', { BankId });

        if (!response.ok) {
            console.error('Failed to load bank accounts.');
            return;
        }

        const accounts = await response.json();

        const accountsContainer = document.getElementById('accounts-container');
        accountsContainer.innerHTML = '';

        accounts.forEach(account => {
            const accountRow = document.createElement('tr');

            const bankCell = document.createElement('td');
            const nameCell = document.createElement('td');
            const numberCell = document.createElement('td');
            const balanceCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            bankCell.textContent = account.bank.Name;
            numberCell.textContent = account.accountNumber;
            nameCell.textContent = account.accountName;
            balanceCell.textContent = account.balance;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.onclick = () => {
                document.getElementById('accountId').value = account.accountId;
                document.getElementById('editAccountNumber').value = account.accountNumber;
                document.getElementById('editName').value = account.accountName;
                document.getElementById('editBalance').value = account.balance;
                toggleModal('#editModal', '#modalOverlay');
                loadBanks("editBank", account.bank);
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteAccount(account.accountId);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            accountRow.appendChild(bankCell);
            accountRow.appendChild(numberCell);
            accountRow.appendChild(nameCell);
            accountRow.appendChild(balanceCell);
            accountRow.appendChild(actionsCell);

            accountsContainer.appendChild(accountRow);
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
}

setupBankFilters();
