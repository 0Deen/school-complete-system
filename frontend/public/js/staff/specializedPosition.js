function initializeAddPositionForm() {
    const form = document.getElementById('addPositionForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const positionData = {
            name: document.getElementById('positionName').value,
            positionId:document.getElementById('positionSelect').value
        };

        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/specialized-position/create', positionData);
              
            if (response.ok) {
                alert('Position added successfully!');
                toggleModal('#addPositionModal', '#modalOverlay');
                loadPositions();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add position');
            }
        } catch (error) {
            console.error('Error adding position:', error);
        }
    });
}


function initializeEditPositionForm() {
    const form = document.getElementById('editPositionForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editPositionId').value;
        const positionId = document.getElementById('editParentPosition').value;
        const name = document.getElementById('editPositionName').value;
        updatePosition(id,positionId,name);
    });
}

const updatePosition = async (id,positionId,name) => {
    const updatedData = {
        id,positionId,name
    };
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/specialized-position/edit', updatedData);
           
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
}

async function populatePositionDropdown(selectedPositionId) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/specialized-position/viewAll');

        if (response.ok) {
            const positions = await response.json();
            const positionSelect = document.getElementById('editParentPosition');

            if (positionSelect) {
                positionSelect.innerHTML = '<option value="">Select a position</option>';

                positions.forEach(position => {
                    const option = document.createElement('option');
                    option.value = position.positionElement.positionId;
                    option.textContent = position.positionElement.Name;

                    if (position.positionId === selectedPositionId) {
                        option.selected = true;
                    }

                    positionSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to load positions for dropdown.');
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}

async function populateInitialPositionDropdown() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/viewall');

        if (response.ok) {
            const positions = await response.json();
            const positionSelect = document.getElementById('positionSelect');

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
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}

populateInitialPositionDropdown();

async function loadPositions(searchTerm) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/specialized-position/viewAll');
        if (response.ok) {
            const positions = await response.json();
            const positionContainer = document.getElementById('position-container');

            if (positionContainer) {
                positionContainer.innerHTML = '';

                // Filter positions if searchTerm is provided
                const filteredPositions = searchTerm ? positions.filter(position => 
                    position.position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    position.positionElement.Name.toLowerCase().includes(searchTerm.toLowerCase())
                ) : positions;

                filteredPositions.forEach(position => {
                    const positionRow = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    const parentRow = document.createElement('td');
                    const actionsCell = document.createElement('td');

                    parentRow.textContent = position.positionElement.Name;
                    nameCell.textContent = position.position.name;

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('edit-btn');
                    editButton.onclick = () => openEditModal(position);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.onclick = () => deletePosition(position.position.id);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    positionRow.appendChild(parentRow);
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

loadPositions('');

document.getElementById('searchPosition').addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    loadPositions(searchTerm);
});


function openEditModal(position) {
    document.getElementById('editPositionId').value = position.position.id;
    document.getElementById('editPositionName').value = position.position.name;

    populatePositionDropdown(position.positionElement.positionId);
    
    toggleModal('#editPositionModal', '#modalOverlay');
}

async function deletePosition(positionId) {
    if (confirm('Are you sure you want to delete this position?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/specialized-position/delete', { id:positionId });
                
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

const filters = {
    position: '',
    searchPosition: ''
};

function setupPositionFilters() {
    Object.keys(filters).forEach(filter => {
        const element = document.getElementById(filter);
        if (element) {
            element.addEventListener('change', () => {
                filters[filter] = element.value;
                applyPositionFilters(element.value);
            });
        }
    });

    // const searchInput = document.getElementById('searchPosition');
    // if (searchInput) {
    //     searchInput.addEventListener('input', () => {
    //         filters.searchPosition = searchInput.value.trim();
    //         applyPositionFilters();
    //     });
    // }
}

async function applyPositionFilters(positionId) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/specialized-position/view-position',{positionId});
        
        if (!response.ok) {
            console.error('Failed to load positions.');
            return;
        }

        const positionsValue = await response.json();

        const positions = positionsValue.SpecializedPositions
        const parentPosition = positionsValue.Position;
        const positionContainer = document.getElementById('position-container');
        positionContainer.innerHTML = ''; 
        
            positions.forEach(position => {
                const positionRow = document.createElement('tr');
                const parentCell = document.createElement('td');
                const nameCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                parentCell.textContent = parentPosition.Name;
                nameCell.textContent = position.name;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => openEditModal({ position, positionElement });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => deletePosition(position?.id);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                positionRow.appendChild(parentCell);
                positionRow.appendChild(nameCell);
                positionRow.appendChild(actionsCell);

                positionContainer.appendChild(positionRow);
            });
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}

setupPositionFilters();


async function populatePositionDropdown() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/position/viewAll');

        if (response.ok) {
            const positions = await response.json();
            const positionSelect = document.getElementById('position');

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
    } catch (error) {
        console.error('Error fetching positions:', error);
    }
}

populatePositionDropdown();
