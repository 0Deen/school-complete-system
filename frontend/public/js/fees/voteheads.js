async function loadVoteheads() {
    try {
        fetchYear('addYear');

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/voteHead/viewAll');

        if (response.ok) {
            const voteHeads = await response.json();
            const voteHeadContainer = document.getElementById('votehead-container');
            const searchQuery = document.getElementById('searchVoteheads').value.toLowerCase();
            
            voteHeadContainer.innerHTML = '';

            const filteredVoteheads = voteHeads.filter(votehead => 
                (!searchQuery || 
                    votehead.Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    votehead.term.academic_year.yearName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    votehead.Amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    votehead.term.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    votehead.Priority.toString().includes(searchQuery)
                )
            );
            

            filteredVoteheads.forEach(voteHead => {
                const voteHeadRow = document.createElement('tr');

                const nameCell = document.createElement('td');
                const amountCell = document.createElement('td');
                const yearCell = document.createElement('td');
                const termCell = document.createElement('td');
                const prorityCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                nameCell.textContent = voteHead.Name;
                amountCell.textContent = voteHead.Amount;
                yearCell.textContent = voteHead.term.academic_year.yearName
                termCell.textContent = `Term ${voteHead.term.value}`
                prorityCell.textContent = voteHead.Priority

                const editButton = document.createElement('button');
                editButton.className = 'edit-btn';
                editButton.textContent = 'Edit';
                editButton.onclick = () => {
                    document.getElementById('editVoteheadId').value = voteHead.id;
                    document.getElementById('editName').value = voteHead.Name;
                    document.getElementById('editAmount').value = voteHead.Amount;
                    document.getElementById('editPriority').value = voteHead.Priority;
                    fetchYear('editYear', voteHead.term);
                    toggleModal('#editModal', '#modalOverlay');
                }

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = async() => {
                    if (confirm('Are you sure you want to delete this vote head?')) {
                        try {
                            const deleteResponse = await fetchRequest('http://localhost:3000/api/simba-systems/votehead/delete', {id:voteHead.id});
                
                            if (deleteResponse.ok) {
                                loadVoteheads();
                                alert('Vote head deleted successfully!');
                            } else {
                                const error = await deleteResponse.json();
                                throw new Error(error.message || 'Failed to delete vote head');
                            }
                        } catch (error) {
                            console.error('Error deleting vote head:', error);
                            alert('Failed to delete vote head');
                        }
                    }else{
                        return
                    }
                };

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                voteHeadRow.appendChild(nameCell);
                voteHeadRow.appendChild(amountCell);
                voteHeadRow.appendChild(yearCell);
                voteHeadRow.appendChild(termCell);
                voteHeadRow.appendChild(prorityCell);
                voteHeadRow.appendChild(actionsCell);

                voteHeadContainer.appendChild(voteHeadRow);
            });
        } else {
            console.error('Failed to load vote heads.');
        }
    } catch (error) {
        console.error('Error fetching vote heads:', error);
    }
}

document.getElementById('searchVoteheads').addEventListener('input', loadVoteheads);


const fetchYear = async(selectId, selected)=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/viewAll');
        if(response.ok){
            const years = await response.json();
            const yearContainer = document.getElementById(selectId);
            yearContainer.addEventListener('change',()=>{
                if(!selected){
                    fetchTerms('addTerm',  yearContainer.value);
                }
            });
            yearContainer.innerHTML = '';
            const option = document.createElement('option');
            if(selected){
                fetchTerms('editTerm', selected.academic_year.id ,selected);
                option.value = selected.academic_year.id;
                option.textContent = selected.academic_year.yearName;
            }else{
                option.textContent = 'Select Year';
            }
            yearContainer.appendChild(option);

            years.forEach(year=>{
                if(selected){
                    if(selected.academic_year.id === year.id)return;
                }
                const option = document.createElement('option');
                option.value = year.id;
                option.textContent = year.yearName;
                yearContainer.appendChild(option);
            })
        }
    } catch (error) {
        throw error
    }
}

const fetchTerms = async(selectId, yearId ,selected)=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/term/viewYear',{yearId});
           
        if(response.ok){
            const terms = (await response.json()).terms;
            const termContainer = document.getElementById(selectId);
            termContainer.innerHTML = '';
            const option = document.createElement('option');
            if(selected){
                option.value = selected.termId;
                option.textContent = `Term ${selected.value}`;
            }else{
                option.textContent = 'Select Term';
            }
            termContainer.appendChild(option);

            terms.forEach(term=>{
                if(selected){
                    if(selected.termId === term.termId)return;
                }
                const option = document.createElement('option');
                option.value = term.termId;
                option.textContent = `Term ${term.value}`;
                termContainer.appendChild(option);
            })
        }
    } catch (error) {
        throw error
    }
}

loadVoteheads();

async function addVotehead() {
    try {
        const Name = document.getElementById('addName').value;
        const Amount = document.getElementById('addAmount').value;
        const termId = document.getElementById('addTerm').value;
        const Priority = document.getElementById('addPriority').value;

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/votehead/create',{ Name, Amount, termId, Priority});

        if (response.ok) {
            alert('Votehead item added successfully!');
            toggleModal('#addModal', '#modalOverlay');
            loadVoteheads();
            resetVoteheads();
        } else {
            alert('Failed to add vote head. Please try again.');
            const error = await response.json();
            throw new Error(error.message || 'Failed to add Vote Head');
        }
    } catch (error) {
        console.error('Error adding vote head:', error);
        alert('Failed to add vote head. Please try again.');
    }
}

const resetVoteheads = async() => {
    document.getElementById('addName').value = '';
    document.getElementById('addAmount').value = '';
    document.getElementById('addTerm').value = '';
    document.getElementById('addPriority').value = '';
}

const editVotehead = async()=>{
    try {
        const id = document.getElementById('editVoteheadId').value
        const Name = document.getElementById('editName').value
        const Amount = document.getElementById('editAmount').value
        const termId = document.getElementById('editTerm').value
        const Priority = document.getElementById('editPriority').value

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/votehead/edit',{id, Name, Amount, termId, Priority });
          
        if(response.ok){
            loadVoteheads();
            alert('Votehead Updated Sucessfully');
            toggleModal('#editModal', '#modalOverlay');
        }else{
            alert('An error ocurred, please try again');
        }
    } catch (error) {
        alert('An error ocurred, please try again');
        throw error;
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

const filters = {
    term: '',
    year: ''
};

function setupFilters() {
    const termSelect = document.getElementById('term');
    const yearSelect = document.getElementById('year');

    if (termSelect) {
        termSelect.addEventListener('change', () => {
            filters.term = termSelect.value.trim(); 
            applyFilters();
        });
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', () => {
            filters.year = yearSelect.value.trim();
        
            if (termSelect) {
                termSelect.selectedIndex = 0;
                filters.term = '';
            }

            applyFilters();
        });
    }
}


async function applyFilters() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/votehead/view-detailed', filters);

        if (response.ok) {
            const voteheads = await response.json();

            const voteheadContainer = document.getElementById('votehead-container');
            voteheadContainer.innerHTML = '';

            if (voteheads.length === 0) {
                const emptyMessage = document.createElement('tr');
                const emptyMessageCell = document.createElement('td');
                emptyMessageCell.colSpan = 6;
                emptyMessageCell.textContent = 'No voteheads found for the selected filters.';
                emptyMessage.appendChild(emptyMessageCell);
                voteheadContainer.appendChild(emptyMessage);
                return;
            }

            voteheads.forEach(votehead => {
                const voteHeadRow = document.createElement('tr');

                const nameCell = document.createElement('td');
                const amountCell = document.createElement('td');
                const yearCell = document.createElement('td');
                const termCell = document.createElement('td');
                const prorityCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                nameCell.textContent = votehead.Name;
                amountCell.textContent = votehead.Amount;
                yearCell.textContent = votehead.term.academic_year.yearName;
                termCell.textContent = `Term ${votehead.term.value}`;
                prorityCell.textContent = votehead.Priority;

                const editButton = document.createElement('button');
                editButton.className = 'edit-btn';
                editButton.textContent = 'Edit';
                editButton.onclick = () => {
                    document.getElementById('editVoteheadId').value = votehead.id;
                    document.getElementById('editName').value = votehead.Name;
                    document.getElementById('editAmount').value = votehead.Amount;
                    document.getElementById('editPriority').value = votehead.Priority;
                    fetchYear('editYear', votehead.term);
                    toggleModal('#editModal', '#modalOverlay');
                };

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = async () => {
                    if (confirm('Are you sure you want to delete this vote head?')) {
                        try {
                            const deleteResponse = await fetchRequest('http://localhost:3000/api/simba-systems/votehead/delete', { id: votehead.id });
                            
                            if (deleteResponse.ok) {
                                loadVoteheads();
                                alert('Vote head deleted successfully!');
                            } else {
                                const error = await deleteResponse.json();
                                throw new Error(error.message || 'Failed to delete vote head');
                            }
                        } catch (error) {
                            console.error('Error deleting vote head:', error);
                            alert('Failed to delete vote head');
                        }
                    }
                };

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                voteHeadRow.appendChild(nameCell);
                voteHeadRow.appendChild(amountCell);
                voteHeadRow.appendChild(yearCell);
                voteHeadRow.appendChild(termCell);
                voteHeadRow.appendChild(prorityCell);
                voteHeadRow.appendChild(actionsCell);

                voteheadContainer.appendChild(voteHeadRow);
            });
        } else {
            console.error('Error fetching voteheads:', await response.json());
        }
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

setupFilters();

