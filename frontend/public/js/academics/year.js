async function loadYears() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/viewAll');
        if (response.ok) {
            const years = await response.json();

            const yearContainer = document.getElementById('year-container');
            
            yearContainer.innerHTML = '';
            years.forEach(year => {
                const yearRow = document.createElement('tr');
                
                const nameCell = document.createElement('td');
                nameCell.textContent = year.yearName;
                
                const startDateCell = document.createElement('td');
                startDateCell.textContent = year.startDate;

                const endDateCell = document.createElement('td');
                endDateCell.textContent = year.endDate;

                const termCell = document.createElement('td');
                termCell.textContent = year.terms;

                const actionsCell = document.createElement('td');
                
                const editButton = document.createElement('button');
                editButton.className = 'edit-btn';
                editButton.textContent = 'Edit';
                editButton.onclick = () => openEditYearModal(year);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteYear(year.id);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                yearRow.appendChild(nameCell);
                yearRow.appendChild(startDateCell);
                yearRow.appendChild(endDateCell);
                yearRow.appendChild(termCell);
                yearRow.appendChild(actionsCell);

                yearContainer.appendChild(yearRow);
            });
        } else {
            console.error('Failed to load years.');
        }
    } catch (e) {
        console.error('Error fetching years:', e);
    }
}

function openEditYearModal(year) {
    document.getElementById('editYearId').value = year.id;
    document.getElementById('editYearName').value = year.yearName;
    document.getElementById('editStartDate').value = year.startDate;
    document.getElementById('editEndDate').value = year.endDate;
    document.getElementById('editTerm').value = year.terms;
    toggleModal('#editYearForm', '#modalOverlayYear');
}

async function initializeEditYear(){
    try {
        const id =  document.getElementById('editYearId').value
        const yearName = document.getElementById('editYearName').value
        const startDate = document.getElementById('editStartDate').value
        const endDate =  document.getElementById('editEndDate').value
        const terms = document.getElementById('editTerm').value

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/edit',{ id, yearName, startDate, endDate, terms});

        if(response.ok){
            alert("Year Updated Sucessfully");
            toggleModal('#editYearForm', '#modalOverlayYear');
            loadYears();
        }
    } catch (error) {
        throw error
    }
}

async function deleteYear(YearId) {
    if (confirm('Are you sure you want to delete this year?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/delete', {id:YearId});
                
            if (response.ok) {
                alert('Year deleted successfully!');
                loadYears();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete year');
            }
        } catch (error) {
            console.error('Error deleting year:', error);
            alert('Failed to delete year');
        }
    }
}

async function initializeAddYear() {
    const newYear = {
        yearName: document.getElementById('yearName').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        terms: document.getElementById('terms').value,
    };

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/create', newYear);

        if (response.ok) {
            alert('Year added successfully!');
            toggleModal('#addYearForm', '#modalOverlayYear');
            loadYears();
            resetYears();
        } else {
            console.error('Failed to add year');
            alert('Failed to add year. Please try again.');
        }
    } catch (error) {
        console.error('Error adding year:', error);
        alert('Failed to add year. Please try again.');
    }
}

loadYears();

const resetYears = async() => {
    document.getElementById('yearName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('terms').value = '';
}

const filters = {
    year: ''
};

function setupFilters() {
    const searchYearInput = document.getElementById('searchYear');

    if (searchYearInput) {
        searchYearInput.addEventListener('input', () => {
            filters.year = searchYearInput.value.trim();
            applyYearFilter(); 
        });
    }
}

async function applyYearFilter() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/viewAll');
        if (response.ok) {
            const years = await response.json();

            const yearContainer = document.getElementById('year-container');
            yearContainer.innerHTML = '';

            const filteredYears = years.filter(year => {
                return !filters.year || year.yearName.toLowerCase().includes(filters.year.toLowerCase());
            });

            if (filteredYears.length === 0) {
                yearContainer.innerHTML = '<tr><td colspan="3">No years found</td></tr>';
                return;
            }

            filteredYears.forEach(year => {
                const yearRow = document.createElement('tr');
                
                const nameCell = document.createElement('td');
                nameCell.textContent = year.yearName;
                
                const startDateCell = document.createElement('td');
                startDateCell.textContent = year.startDate;

                const endDateCell = document.createElement('td');
                endDateCell.textContent = year.endDate;

                const termCell = document.createElement('td');
                termCell.textContent = year.terms;

                const actionsCell = document.createElement('td');
                
                const editButton = document.createElement('button');
                editButton.className = 'edit-btn';
                editButton.textContent = 'Edit';
                editButton.onclick = () => openEditYearModal(year);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteYear(year.id);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                yearRow.appendChild(nameCell);
                yearRow.appendChild(startDateCell);
                yearRow.appendChild(endDateCell);
                yearRow.appendChild(termCell);
                yearRow.appendChild(actionsCell);

                yearContainer.appendChild(yearRow);
            });
        } else {
            console.error('Failed to load years.');
        }
    } catch (error) {
        console.error('Error fetching years!', error);
    }
}


setupFilters();