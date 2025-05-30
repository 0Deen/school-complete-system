async function loadBursary() {
    try {
        fetchAccounts('addAccount');

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bursary/viewAll');

        if (response.ok) {
            const bursaries = await response.json();
            const bursaryContainer = document.getElementById('bursary-container');
            const searchQuery = document.getElementById('searchBursary').value.toLowerCase();

            bursaryContainer.innerHTML = '';

            const filterBursary = bursaries.filter(bursary => {
                return (
                    !searchQuery || 
                    bursary.Bursary.source.toLowerCase().includes(searchQuery) || 
                    bursary.Account.accountName.toLowerCase().includes(searchQuery) ||
                    bursary.Bursary.amount.toLowerCase().includes(searchQuery) || 
                    bursary.Bursary.date.toLowerCase().includes(searchQuery)
                );
            });

            filterBursary.forEach(bursary => {
                const bursaryRow = document.createElement('tr');

                const sourceCell = document.createElement('td');
                const accountCell = document.createElement('td');
                const amountCell = document.createElement('td');
                const dateCell = document.createElement('td');
                const actionsCell = document.createElement('td');
                const editButton = document.createElement('button');
                const deleteButton = document.createElement('button');

                sourceCell.textContent = bursary.Bursary.source;
                accountCell.textContent = bursary.Account.accountName;
                amountCell.textContent = bursary.Bursary.amount;
                dateCell.textContent = bursary.Bursary.date;

                editButton.className = 'edit-btn';
                editButton.textContent = 'Edit';
                editButton.onclick = () => {
                    document.getElementById('editId').value = bursary.Bursary.bursaryId;
                    document.getElementById('editSource').value = bursary.Bursary.source;
                    document.getElementById('editAmount').value = bursary.Bursary.amount;
                    document.getElementById('editDate').value = bursary.Bursary.date;
                    fetchAccounts('editAccount', bursary.Account);
                    toggleModal('#editModal', '#modalOverlay');
                };

                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = async () => {
                    if (confirm('Are you sure you want to delete this bursary?')) {
                        try {
                            const response = await fetchRequest('http://localhost:3000/api/simba-systems/bursary/delete', { bursaryId: bursary.Bursary.bursaryId });

                            if (response.ok) {
                                loadBursary();
                            } else {
                                const error = await response.json();
                                throw new Error(error.message || 'Failed to delete bursary');
                            }
                        } catch (error) {
                            console.error('Error deleting bursary:', error);
                            alert('Failed to delete bursary');
                        }
                    }
                };

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                bursaryRow.appendChild(sourceCell);
                bursaryRow.appendChild(accountCell);
                bursaryRow.appendChild(amountCell);
                bursaryRow.appendChild(dateCell);
                bursaryRow.appendChild(actionsCell);

                bursaryRow.addEventListener('click', (event) => {
                    if (event.target.tagName !== 'BUTTON') {
                        openBursaryDetailsModal(bursary);
                    }
                });

                bursaryContainer.appendChild(bursaryRow);
            });
        } else {
            console.error('Failed to load bursaries.');
        }
    } catch (error) {
        console.error('Error fetching bursaries:', error);
    }
}

function openBursaryDetailsModal(bursary) {
    document.getElementById('bursaryDetailsSource').textContent = bursary.Bursary.source;
    document.getElementById('bursaryDetailsAccount').textContent = bursary.Account.accountName;
    document.getElementById('bursaryDetailsAmount').textContent = bursary.Bursary.amount;
    document.getElementById('bursaryDetailsDate').textContent = bursary.Bursary.date;

    toggleModal('#bursaryDetailsModal', '#modalOverlay');
}


document.getElementById('searchBursary').addEventListener('input', loadBursary);

const fetchAccounts = async(selectedId,selected )=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/account/viewAll');
        if(response.ok){
            const accounts = await response.json();
            const accountSelect = document.getElementById(selectedId);
            accountSelect.innerHTML = '';
            const option = document.createElement('option');
            if(selected){
                option.textContent = selected.accountName;
                option.value = selected.accountId
            }else{
                option.textContent = 'Select the account';
            }
            accountSelect.appendChild(option);
            accounts.forEach(account=>{
                if(selected){
                    if(selected.accountId === account.accountId)return;
                }
                const option = document.createElement('option');
                option.textContent = account.accountName;
                option.value = account.accountId;
                accountSelect.appendChild(option);
            })
        }
    } catch (error) {
        throw error;
    }
}

loadBursary();

const addBursary = async()=>{
    try {
        const source = document.getElementById('addSource').value;
        const accountId = document.getElementById('addAccount').value;
        const amount = document.getElementById('addAmount').value;
        const date = document.getElementById('addDate').value;

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bursary/create',{source, accountId, amount, date});
        if(response.ok){
            alert('Added Sucessfully');
            toggleModal('#addModal','#modalOverlay');
            /* toggleModal('#allocateBursaryModal', '#modalOverlay'); */
            loadBursary();
        }else{
            alert('Failed to add, please try again');
            toggleModal('#addModal','#modalOverlay');
            loadBursary();
        }
    } catch (error) {
        console.log('An error ocurred');
        throw error;
    }
}

const editBursary = async()=>{
    try {
        const bursaryId = document.getElementById('editId').value
        const source = document.getElementById('editSource').value;
        const accountId = document.getElementById('editAccount').value;
        const amount = document.getElementById('editAmount').value;
        const date = document.getElementById('editDate').value;

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bursary/edit',{bursaryId, source, accountId, amount, date});
        if(response.ok){
            alert('Edited Sucessfully');
            toggleModal('#editModal','#modalOverlay');
            loadBursary();
        }else{
            alert('Failed to edit, please try again');
            toggleModal('#editModal','#modalOverlay');
            loadBursary();
        }
    } catch (error) {
        console.log('An error ocurred');
        throw error;
    }
}