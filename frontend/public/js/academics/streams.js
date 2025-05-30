function initializeAddStreamForm() {
    const form = document.getElementById('addStreamForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const streamData = {
            StreamName: document.getElementById('streamName').value.trim()
        };

        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/stream/create', {Name: streamData.StreamName});
            
            if (response.ok) {
                alert('Stream added successfully!');
                document.getElementById('streamName').value = '';
                toggleModal('#addStreamForm', '#addStreamModal');
                loadStreams();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add stream');
            }
        } catch (error) {
            console.error('Error adding stream:', error);
            alert('Failed to add stream. Please try again.');
        }
    });
}

async function loadStreams() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/stream/viewAll');

        if (response.ok) {
            const streams = await response.json();
            const streamContainer = document.getElementById('stream-container');
            
            if (streamContainer) {
                streamContainer.innerHTML = '';

                streams.forEach(stream => {
                    const streamRow = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    const actionsCell = document.createElement('td');

                    nameCell.textContent = stream.Name;

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('edit-btn');
                    editButton.onclick = () => openEditStreamModal(stream);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.onclick = () => deleteStream(stream.StreamId);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    streamRow.appendChild(nameCell);
                    streamRow.appendChild(actionsCell);

                    streamContainer.appendChild(streamRow);
                });
            }
        } else {
            console.error('Failed to load streams.');
        }
    } catch (e) {
        console.error('Error fetching streams:', e);
    }
}

loadStreams();

function openEditStreamModal(stream) {
        document.getElementById('editStreamId').value = stream.StreamId; 

        const streamNameInput = document.getElementById('editStreamName');
        if (streamNameInput) {
            streamNameInput.value = stream.Name;
        } else {
            console.error('Element with id "editStreamName" not found.');
            return;
        }

        toggleModal('#editStreamForm', '#addStreamModal');
}

function initializeEditStreamForm() {
    const form = document.getElementById('editStreamForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedStream = {
            StreamId: document.getElementById('editStreamId').value,
            Name: document.getElementById('editStreamName').value.trim()
        };

        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/stream/edit', updatedStream);

            if (response.ok) {
                alert('Stream updated successfully!');
                toggleModal('#editStreamForm', '#addStreamModal')
                loadStreams();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update stream');
            }
        } catch (error) {
            console.error('Error updating stream:', error);
            alert('Failed to update stream. Please try again.');
        }
    });
}

async function deleteStream(StreamId) {
    if (confirm('Are you sure you want to delete this stream?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/stream/delete', { StreamId });

            if (response.ok) {
                alert('Stream deleted successfully!');
                loadStreams();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete stream');
            }
        } catch (error) {
            console.error('Error deleting stream:', error);
            alert('Failed to delete stream');
        }
    }
}

const filters={
    stream: ''
}

function setupFilters() {

    const searchInput = document.getElementById('searchStream');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filters.searchStream = searchInput.value.trim();
            applyStreamFilters();
        });
    }
}

async function applyStreamFilters() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/stream/viewAll');
        if (response.ok) {
            const streams = await response.json();
            const streamContainer = document.getElementById('stream-container');
            streamContainer.innerHTML = '';

            const filteredStreams = streams.filter(stream => {
                return (
                    (!filters.searchStream || 
                        stream.Name.toLowerCase().includes(filters.searchStream.toLowerCase()))
                );
            });

            if (filteredStreams.length === 0) {
                streamContainer.innerHTML = '<tr><td colspan="2">No streams found.</td></tr>';
                return;
            }

            filteredStreams.forEach(stream => {
                const streamRow = document.createElement('tr');

                const nameCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                nameCell.textContent = stream.Name;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => openEditStreamModal(stream);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => confirmDeleteStream(stream.StreamId);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                streamRow.appendChild(nameCell);
                streamRow.appendChild(actionsCell);

                streamContainer.appendChild(streamRow);
            });
        } else {
            console.error('Failed to load streams.');
        }
    } catch (error) {
        console.error('Error fetching streams!', error);
    }
}

setupFilters();
