async function loadTerms() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/term/viewAll');
        if (response.ok) {
            const terms = await response.json();
            const termContainer = document.getElementById('term-holder');
            
            termContainer.innerHTML = '';

            terms.forEach(term => {
                const termRow = document.createElement('tr');

                const yearCell = document.createElement('td');
                yearCell.textContent = term.academicYear.yearName;
                
                const nameCell = document.createElement('td');
                nameCell.textContent = `Term ${term.term.value}`;
                
                const startCell = document.createElement('td');
                startCell.textContent = term.term.startDate;

                const endCell = document.createElement('td');
                endCell.textContent = term.term.endDate;

                const actionsCell = document.createElement('td');
                
                const editButton = document.createElement('button');
                editButton.className = 'edit-btn';
                editButton.textContent = 'Edit';
                editButton.onclick = () => openEditTermModal(term);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteTerm(term.term.termId);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                termRow.appendChild(yearCell);
                termRow.appendChild(nameCell);
                termRow.appendChild(startCell);
                termRow.appendChild(endCell);
                termRow.appendChild(actionsCell);

                termContainer.appendChild(termRow);
            });
        } else {
            console.error('Failed to load terms.');
        }
    } catch (e) {
        console.error('Error fetching terms:', e);
    }
}

async function openEditTermModal(term) {
    const year = term.academicYear;
    const currentTerm = term.term;

    populateYearSelect(year);
    populateTermsByYear(year, currentTerm);

    document.getElementById('editTermId').value = term.term.termId;
    document.getElementById('editStartDate').value = term.term.startDate;
    document.getElementById('editEndDate').value = term.term.endDate;

    toggleModal('#editTermForm', '#modalOverlayTerm');
}

async function deleteTerm(TermId) {
    if (confirm('Are you sure you want to delete this term?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/term/delete', { termId:TermId });

            if (response.ok) {
                alert('Term deleted successfully!');
                loadTerms();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete term');
            }
        } catch (error) {
            console.error('Error deleting term:', error);
            alert('Failed to delete term');
        }
    }
}

const loadYears = async()=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/viewAll')
        if(response.ok){
            const years = await response.json();
            const yearSelect = document.getElementById('year');
            const option = document.createElement('option');
            option.value = null;
            option.textContent = 'Select Academic year';
            yearSelect.appendChild(option)
            years.forEach(year=>{
                const yearOption = document.createElement('option');
                yearOption.value = year.id;
                yearOption.textContent = year.yearName
                yearSelect.appendChild(yearOption);
            });
        }
    } catch (error) {
        throw error
    }
}

loadYears()


document.getElementById('year').addEventListener('change', async () => {
    const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/view', { id: document.getElementById('year').value });

    if (response.ok) {
        const year = await response.json();
        const termDropdown = document.getElementById('term');

        termDropdown.innerHTML = '';

        const dummyOption = document.createElement('option');
        dummyOption.value = '';
        dummyOption.textContent = 'Select Term';
        termDropdown.appendChild(dummyOption);
        
        const termsCount = parseInt(year.year.terms); 

        for (let i = 1; i <= termsCount; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Term ${i}`;
            termDropdown.appendChild(option);
        }
    } else {
        console.log("Failed to fetch data:", response.status);
    }
});

async function initializeAddTerm() {
    const newTerm = {
        academicYear:document.getElementById('year').value,
        value: document.getElementById('term').value,
        startDate:document.getElementById('startDate').value,
        endDate:document.getElementById('endDate').value
    };

    if (!newTerm.value || !newTerm.academicYear || !newTerm.startDate || !newTerm.endDate) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/term/create', newTerm);

        if (response.ok) {
            alert('Term added successfully!');
            toggleModal('#addTermForm', '#modalOverlayTerm');
            loadTerms();
            resetTerm();
        } else {
            console.error('Failed to add term');
            alert('Failed to add term. Please try again.');
        }
    } catch (error) {
        console.error('Error adding term:', error);
        alert('Failed to add term. Please try again.');
    }
}

loadTerms();

const resetTerm = () => {
    document.getElementById('year').value = '';
    document.getElementById('term').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
}

const populateYearSelect = async (Year) => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/viewAll');
        if (response.ok) {
            const years = await response.json();

            const yearSelect = document.getElementById('editYear');
            yearSelect.innerHTML = '';

            const savedOption = document.createElement('option');
            savedOption.value = Year.id;
            savedOption.textContent = Year.value || Year.yearName;
            savedOption.selected = true;
            yearSelect.appendChild(savedOption);

            years.forEach(year => {
                if (year.id === Year.id) return;
                
                const option = document.createElement('option');
                option.value = year.id;
                option.textContent = year.yearName;
                yearSelect.appendChild(option);
            });

            yearSelect.disabled = true;
        } else {
            console.error('Failed to fetch years');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const populateTermsByYear = async (year, currentTerm) => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/term/viewbyyear',{ yearId: year.id });
            
        if (!response.ok) {
            throw new Error('Failed to fetch terms for year');
        }

        const { terms } = await response.json();
        const termSelect = document.getElementById('editTermName');
        
        termSelect.innerHTML = '';

        addTermOption(termSelect, currentTerm.value, `Term ${currentTerm.value}`, true);

        const totalTerms = year.terms;

        for (let i = 1; i <= totalTerms; i++) {
            if (i != currentTerm.value) {
                addTermOption(termSelect, i, `Term ${i}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading terms. Please try again later.');
    }
};

const addTermOption = (selectElement, value, textContent, isSelected = false) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = textContent;
    option.selected = isSelected;
    selectElement.appendChild(option);
};

async function initializeEditTerm() {
    const updatedTerm = {
        termId: document.getElementById('editTermId').value,
        academicYear: document.getElementById('editYear').value,
        value: document.getElementById('editTermName').value,
        startDate: document.getElementById('editStartDate').value,
        endDate: document.getElementById('editEndDate').value
    };

    if (!updatedTerm.value || !updatedTerm.academicYear || !updatedTerm.startDate || !updatedTerm.endDate) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/term/edit', updatedTerm);
            
        if (response.ok) {
            alert('Term updated successfully!');
            toggleModal('#editTermForm', '#modalOverlayTerm');
            loadTerms();
        } else {
            const error = await response.json();
            console.error('Failed to update term:', error);
            alert('Failed to update term. Please try again.');
        }
    } catch (error) {
        console.error('Error updating term:', error);
        alert('Failed to update term. Please try again.');
    }
}

const filters = {
    term: ''
};

function setupFilters() {
    const searchTermInput = document.getElementById('searchTerm');

    if (searchTermInput) {
        searchTermInput.addEventListener('input', () => {
            filters.term = searchTermInput.value.trim();
            applyTermFilter(); 
        });
    }
}

async function applyTermFilter() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/term/viewAll');
        if (response.ok) {
            const terms = await response.json();
            
            const termContainer = document.getElementById('term-holder');
            termContainer.innerHTML = '';

            const filteredTerms = terms.filter(term => {
                return !filters.term || (term.term && term.term.value && term.term.value.includes(filters.term.toLowerCase()));
            });

            if (filteredTerms.length === 0) {
                termContainer.innerHTML = '<tr><td colspan="5">No terms found.</td></tr>';
                return;
            }

            filteredTerms.forEach(term => {
                const termRow = document.createElement('tr');

                const yearCell = document.createElement('td');
                
                const nameCell = document.createElement('td');
                
                const startCell = document.createElement('td');

                const endCell = document.createElement('td');
                endCell.textContent = term.term.endDate;

                yearCell.textContent = term.academicYear.yearName;
                nameCell.textContent = `Term ${term.term.value}`;
                startCell.textContent = term.term.startDate;


                const actionsCell = document.createElement('td');
                
                const editButton = document.createElement('button');
                editButton.className = 'edit-btn';
                editButton.textContent = 'Edit';
                editButton.onclick = () => openEditTermModal(term);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteTerm(term.term.termId);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                termRow.appendChild(yearCell);
                termRow.appendChild(nameCell);
                termRow.appendChild(startCell);
                termRow.appendChild(endCell);
                termRow.appendChild(actionsCell);

                termContainer.appendChild(termRow);
            });
        } else {
            console.error('Failed to load terms.');
        }
    } catch (error) {
        console.error('Error fetching terms!', error);
    }
}


// Initialize the filter setup
setupFilters();
