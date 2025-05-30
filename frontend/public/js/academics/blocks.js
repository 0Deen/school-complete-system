async function loadBlocks() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/block/viewAll');
        if (response.ok) {
            const blocks = await response.json();
            const blockContainer = document.getElementById('block-container');
            
            blockContainer.innerHTML = '';
            blocks.forEach(block => {
                const blockRow = document.createElement('tr');
                
                const nameCell = document.createElement('td');
                nameCell.textContent = block.Name;
                
                const valueCell = document.createElement('td');
                valueCell.textContent = `${block.startRange} - ${block.endRange}`;

                const actionsCell = document.createElement('td');
                
                const editButton = document.createElement('button');
                editButton.className = 'edit-btn';
                editButton.textContent = 'Edit';
                editButton.onclick = () => openEditBlockModal(block);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteBlock(block.BlockId);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                blockRow.appendChild(nameCell);
                blockRow.appendChild(valueCell);
                blockRow.appendChild(actionsCell);

                blockContainer.appendChild(blockRow);
            });
        } else {
            console.error('Failed to load blocks.');
        }
    } catch (e) {
        console.error('Error fetching blocks:', e);
    }
}

function openEditBlockModal(block) {
    document.getElementById('editBlockId').value = block.BlockId;
    document.getElementById('editBlockName').value = block.Name;
    document.getElementById('editStartRange').value = block.startRange;
    document.getElementById('editEndRange').value = block.endRange;
    toggleModal('#editBlockModal', '#modalOverlay');
}

async function deleteBlock(BlockId) {
    if (confirm('Are you sure you want to delete this block?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/block/delete',{BlockId});

            if (response.ok) {
                alert('Block deleted successfully!');
                loadBlocks();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete block');
            }
        } catch (error) {
            console.error('Error deleting block:', error);
            alert('Failed to delete block');
        }
    }
}

async function initializeAddBlockForm() {
    try {
        const newBlock = {
            Name: document.getElementById('blockName').value,
            startRange:document.getElementById('startRange').value,
            endRange:document.getElementById('endRange').value
        };

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/block/create', newBlock);

        if (response.ok) {
            alert('Block added successfully!');
            document.getElementById('blockName').value = '';
            document.getElementById('startRange').value = '';
            document.getElementById('endRange').value = '';
            toggleModal('#addBlockForm', '#modalOverlay');
            loadBlocks();
        } else {
            console.error('Failed to add block');
            alert('Failed to add block. Please try again.');
        }
    } catch (error) {
        console.error('Error adding block:', error);
        alert('Failed to add block. Please try again.');
    }
}

loadBlocks();

async function initializeEditBlockForm() {
    try {
        const updatedBlock = {
            BlockId: document.getElementById('editBlockId').value,
            Name: document.getElementById('editBlockName').value,
            startRange:document.getElementById('editStartRange').value,
            endRange:document.getElementById('editEndRange').value
        };

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/block/edit', updatedBlock);
        console.log('Response', response)

        if (response.ok) {
            toggleModal('#editBlockModal', '#modalOverlay');
            alert('Block updated successfully!');
            loadBlocks();
        } else {
            const error = await response.json();
            console.log(error.error || 'Failed to update Block');
        }
    } catch (error) {
        console.error('Error updating Block:', error);
        alert('Failed to update Block. Please try again.');
    }
}

const filters = {
    block: ''
};

function setupFilters() {
    const searchInput = document.getElementById('searchBlock');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filters.block = searchInput.value.trim();
            applyBlockFilters();
        });
    }
}

async function applyBlockFilters() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/block/viewAll');
        if (response.ok) {
            const blocks = await response.json();
            const blockContainer = document.getElementById('block-container');
            blockContainer.innerHTML = '';

            const filteredBlocks = blocks.filter(block => {
                return (
                    (!filters.block || 
                        block.Name.toLowerCase().includes(filters.block.toLowerCase()))
                );
            });

            if (filteredBlocks.length === 0) {
                blockContainer.innerHTML = '<tr><td colspan="3">No blocks found.</td></tr>';
                return;
            }

            filteredBlocks.forEach(block => {
                const blockRow = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = block.Name;

                const valueCell = document.createElement('td');
                valueCell.textContent = `${block.startRange} - ${block.endRange}`;

                const actionsCell = document.createElement('td');

                const editButton = document.createElement('button');
                editButton.classList.add('edit-btn');
                editButton.textContent = 'Edit';
                editButton.onclick = () => openEditBlockModal(block);

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => confirmDeleteBlock(block.BlockId);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                blockRow.appendChild(nameCell);
                blockRow.appendChild(valueCell);
                blockRow.appendChild(actionsCell);

                blockContainer.appendChild(blockRow);
            });
        } else {
            console.error('Failed to load blocks.');
        }
    } catch (error) {
        console.error('Error fetching blocks!', error);
    }
}


setupFilters();
