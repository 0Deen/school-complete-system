async function addBank() {
    const bankDetails = {
        Name: document.getElementById('addName').value,
        Branch: document.getElementById('addBranch').value,
    }

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bank/create',bankDetails);
           
        if (response.ok) {
            alert('Bank added successfully');
            toggleModal('#addBankModal', '#modalOverlay');
            loadBanks();
            resetBanks();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add bank');
        }
    } catch (error) {
        console.error('Error adding bank:', error);
        alert('Failed to add bank. Please try again.');
    }
}

function resetBanks() {
    document.getElementById('addName').value = '';
    document.getElementById('addBranch').value = '';
}

async function loadBanks() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bank/viewAll');
        if (response.ok) {
            const banks = await response.json();
            const banksContainer = document.getElementById('banks-container');
            const searchQuery = document.getElementById('searchBank').value.toLowerCase();

            banksContainer.innerHTML = '';

            const filteredBanks = banks.filter(bank =>
                (!searchQuery || 
                    `${bank.Name} ${bank.Branch}`.toLowerCase().includes(searchQuery))
            );

            filteredBanks.forEach(bank => {
                const bankRow = document.createElement('tr');
                const nameCell = document.createElement('td');
                const branchCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                nameCell.textContent = bank.Name;
                branchCell.textContent = bank.Branch;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => openEditBankModal(bank);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => deleteBank(bank.BankId);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                bankRow.appendChild(nameCell);
                bankRow.appendChild(branchCell);
                bankRow.appendChild(actionsCell);

                banksContainer.appendChild(bankRow);
            });
        } else {
            console.error('Failed to load banks.');
        }
    } catch (error) {
        console.error('Error fetching banks:', error);
    }
}

document.getElementById('searchBank').addEventListener('input', loadBanks);

loadBanks();


async function deleteBank(BankId) {
    try {
        if (!confirm('Are you sure you want to delete this bank?')) {
            return;
        }
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bank/delete',{BankId});
            
        if (response.ok) {
            alert('Bank deleted successfully!');
            loadBanks();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete bank');
        }
    } catch (error) {
        console.error('Error deleting bank:', error);
        alert('Failed to delete bank');
    }
}

function openEditBankModal(bank) {
    document.getElementById('editBankId').value = bank.BankId;
    document.getElementById('editName').value = bank.Name;
    document.getElementById('editBranch').value = bank.Branch;
    toggleModal('#editBankModal', '#modalOverlay');
}

const editBank = async()=>{
    try {
        const BankId = document.getElementById('editBankId').value;
        const Name = document.getElementById('editName').value;
        const Branch = document.getElementById('editBranch').value;

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bank/edit',{BankId, Name, Branch});
            
        if(response.ok){
            alert(`${Name} Updated Sucessfully`);
            toggleModal('#editBankModal', '#modalOverlay');
            loadBanks();
        }
    } catch (error) {
        throw error;
    }
}