function initializeAddPositionForm() {
    const form = document.getElementById('addPositionForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const positionData = {
            name: document.getElementById('positionName').value.trim(),
        };

        if (positionData.name) {
            try {
                const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/create', { Name: positionData.name });
                    
                if (response.ok) {
                    alert('Position added successfully!');
                    form.reset();
                    toggleModal('#addPositionModal', '#modalOverlay');
                    loadPositions();
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to add position');
                }
            } catch (error) {
                console.error('Error adding position:', error);
            }
        } else {
            alert('Position name cannot be empty');
        }
    });
}

function initializeEditPositionForm() {
    const form = document.getElementById('editPositionForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const positionId = document.getElementById('editPositionId').value;
        updatePosition(positionId);
    });
}

const updatePosition = async (positionId) => {
    const updatedData = {
        positionId: positionId,
        Name: document.getElementById('editPositionName').value.trim(),
    };

    if (updatedData.Name) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/edit', updatedData);
                
            if (response.ok) {
                alert('Position updated successfully!');
                toggleModal('#editPositionModal', '#modalOverlay');
                loadPositions();
            } else {
                console.error('Failed to update position:', response.statusText);
            }
        } catch (e) {
            console.error('Error updating position:', e);
        }
    } else {
        alert('Position name cannot be empty');
    }
}

async function loadPositions() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/viewall');

        if (response.ok) {
            const positions = await response.json();
            const positionContainer = document.getElementById('position-container');

            if (positionContainer) {
                positionContainer.innerHTML = '';

                positions.forEach(position => {
                    const positionRow = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    const actionsCell = document.createElement('td');

                    nameCell.textContent = position.Name;

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('edit-btn');
                    editButton.onclick = () => openEditModal(position.positionId, position.Name);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.onclick = () => deletePosition(position.positionId);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    positionRow.appendChild(nameCell);
                    positionRow.appendChild(actionsCell);

                    positionContainer.appendChild(positionRow);
                });
            }
        } else {
            console.error('Failed to load positions.');
        }
    } catch (e) {
        console.error('Error fetching positions:', e);
    }
}

loadPositions();

function openEditModal(positionId, name) {
    document.getElementById('editPositionId').value = positionId;
    document.getElementById('editPositionName').value = name;
    toggleModal('#editPositionModal', '#modalOverlay');
}

async function deletePosition(positionId) {
    if (confirm('Are you sure you want to delete this position?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/delete', { positionId });
                
            if (response.ok) {
                alert('Position deleted successfully!');
                loadPositions();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete position');
            }
        } catch (error) {
            console.error('Error deleting position:', error);
            alert('Failed to delete position');
        }
    }
}

async function populatePositionDropdown() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/viewall');

        if (response.ok) {
            const positions = await response.json();
            const positionSelect = document.getElementById('addPositionSelect');

            if (positionSelect) {
                positionSelect.innerHTML = '<option value="">Select a position</option>';

                positions.forEach(position => {
                    const option = document.createElement('option');
                    option.value = position.positionId;
                    option.textContent = position.Name;
                    positionSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to load positions for dropdown.');
        }
    } catch (e) {
        console.error('Error fetching positions for dropdown:', e);
    }
}

populatePositionDropdown();

const filters = {
    searchPosition: ''
};

function setupSearch() {
    const searchInput = document.getElementById('searchPosition');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filters.searchPosition = searchInput.value.trim().toLowerCase();
            applyFilters();
        });
    }
}

async function applyFilters() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/viewAll');
        if (response.ok) {
            const positions = await response.json();

            const positionContainer = document.getElementById('position-container');
            positionContainer.innerHTML = '';

            const filteredPositions = positions.filter(position => {
                const positionName = position.Name.toLowerCase();

                return !filters.searchPosition || positionName.includes(filters.searchPosition);
            });

            filteredPositions.forEach(position => {
                const positionRow = document.createElement('tr');
                const nameCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                nameCell.textContent = position.Name;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => openEditModal(position.positionId, position.Name);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => deletePosition(position.positionId);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                positionRow.appendChild(nameCell);
                positionRow.appendChild(actionsCell);

                positionContainer.appendChild(positionRow);
            });

            if (filteredPositions.length === 0) {
                const noDataMessage = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.colSpan = 2;
                noDataCell.textContent = 'No positions found';
                noDataMessage.appendChild(noDataCell);
                positionContainer.appendChild(noDataMessage);
            }
        } else {
            console.error('Failed to load positions.');
        }
    } catch (error) {
        console.error('Error fetching positions!', error);
    }
}

setupSearch();
