 async function loadFees(){
    try {
        fetchYear('addYear');
        fetchAccounts('addAccount');

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/fee/view-all-detailed');

        if(response.ok){
            const fees = await response.json();

            const feesContainer = document.getElementById('fees-container');
            const searchQuery = document.getElementById('searchFees').value.toLowerCase();

            feesContainer.innerHTML = '';

            const filteredFees = fees.filter(fee => {
                return (
                    (!searchQuery || 
                        fee.Fee.Ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fee.Fee.AmountPaid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fee.Fee.PaymentDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fee.Fee.PaymentMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fee.Fee.StudentID.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fee.Year.yearName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fee.Term.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fee.Student.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        fee.Student.LastName.toLowerCase().includes(searchQuery.toLowerCase())
                    ));
            });
            

            filteredFees.forEach(fee => {
            const feeRow = document.createElement('tr');

            const studentCell = document.createElement('td');
            const refCell = document.createElement('td');
            const yearCell = document.createElement('td');
            const termCell = document.createElement('td');
            const amountCell = document.createElement('td');
            const methodCell = document.createElement('td');
            const dateCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            studentCell.textContent = fee.Student.StudentID
            refCell.textContent = fee.Fee.Ref
            yearCell.textContent = fee.Year.yearName
            termCell.textContent = fee.Term.value
            amountCell.textContent = fee.Fee.AmountPaid
            methodCell.textContent = fee.Fee.PaymentMode
            dateCell.textContent = (fee.Fee.PaymentDate).split('T')[0]
            
            const editButton = document.createElement('button');
            editButton.className = 'edit-btn';
            editButton.textContent = 'Edit';
            editButton.onclick = () => {
                document.getElementById('editFeeId').value = fee.Fee.FeeId;
                document.getElementById('editStudentId').value = fee.Student.StudentID;
                document.getElementById('editRef').value = fee.Fee.Ref;
                document.getElementById('editAmount').value = fee.Fee.AmountPaid;
                document.getElementById('editMethod').value = fee.Fee.PaymentMode;
                fetchYear('editYear', fee.Term, fee.Year);
                fetchAccounts('editAccount', fee.Account);
                toggleModal('#editFeeModal', '#modalOverlay');
            }

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = async() => {
                if (confirm('Are you sure you want to delete this fee?')) {
                    try {
                        const response = await fetchRequest(`http://localhost:3000/api/simba-systems/fee/delete`,{FeeId:fee.Fee.FeeId});
            
                        if (response.ok) {
                            alert('Fee deleted successfully!');
                            loadFees();
                        } else {
                            const error = await response.json();
                            throw new Error(error.message || 'Failed to delete fee');
                        }
                    } catch (error) {
                        console.error('Error deleting fee:', error);
                        alert('Failed to delete fee. Please try again.');
                    }
                }
            }

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            feeRow.appendChild(studentCell);
            feeRow.appendChild(refCell);
            feeRow.appendChild(yearCell);
            feeRow.appendChild(termCell);
            feeRow.appendChild(amountCell);
            feeRow.appendChild(methodCell);
            feeRow.appendChild(dateCell);
            feeRow.appendChild(actionsCell);

            feesContainer.appendChild(feeRow);
            });
        }else{
            console.error('Failed to load fees.');
        }
    } catch (error) {
        console.error('Error fetching fees:', error);
    }
}

document.getElementById('searchFees').addEventListener('input', loadFees);

const fetchYear = async(selectId, selected, Year)=>{
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
                fetchTerms('editTerm', selected.academicYear ,selected);
                option.value = selected.academicYear;
                option.textContent = Year.yearName;
            }else{
                option.textContent = 'Select Year';
            }
            yearContainer.appendChild(option);

            years.forEach(year=>{
                if(selected){
                    if(selected.academicYear === year.id)return;
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

const fetchAccounts=async(selectedId,selected )=>{
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

loadFees();

async function addFees(){
    try {
        const StudentID = document.getElementById('addStudentId').value;
        const Ref = document.getElementById('addRef').value;
        const Term = document.getElementById('addTerm').value;
        const AmountPaid = document.getElementById('addAmount').value;
        const PaymentMode = document.getElementById('addMethod').value;
        const accountId = document.getElementById('addAccount').value;
        
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/fee/create', {StudentID, Ref, Term, AmountPaid, PaymentMode, accountId});

        if(response.ok){
            loadFees();
            alert('Fees added successfully');
            toggleModal('#addFeesModal', '#modalOverlay');
            resetFee();
        }else{
            const error = await response.json();
            throw new Error(error.error|| 'Failed to add Fees');
        }
    } catch (error) {
        console.error('error adding fees', error);
        alert('Failed to add Fees. Please try again.');
    }
}

const resetFee = () => {
    document.getElementById('addStudentId').value = '';
    document.getElementById('addRef').value = '';
    document.getElementById('addTerm').value = '';
    document.getElementById('addAmount').value = '';
    document.getElementById('addMethod').value = '';
    document.getElementById('addAccount').value = '';
}

const editFees =async ()=>{
    try {
        const FeeId = document.getElementById('editFeeId').value;
        const StudentID = document.getElementById('editStudentId').value;
        const Ref = document.getElementById('editRef').value;
        const Term = document.getElementById('editTerm').value;
        const AmountPaid = document.getElementById('editAmount').value;
        const PaymentMode = document.getElementById('editMethod').value;
        const accountId = document.getElementById('editAccount').value;
        
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/fee/edit', {FeeId, StudentID, Ref, Term, AmountPaid, PaymentMode, accountId});

        if(response.ok){
            loadFees();
            alert('Changes Saved successfully');
            toggleModal('#editFeeModal', '#modalOverlay');
        }else{
            const error = await response.json();
            throw new Error(error.error|| 'Failed to add Fees');
        }
    } catch (error) {
        console.error('error edit fees', error);
        alert('Failed to edit Fees. Please try again.');
    }
}

const populateStudents = async() => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/viewAll');

        if(response.ok){
            const students = await response.json();

            const studentContainer = document.getElementById('addStudentId');
            studentContainer.innerHTML = '<option value="">Select Student</option>';

            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.StudentID;
                option.textContent = `${student.FirstName} ${student.LastName}`;

                studentContainer.appendChild(option);
            });
        }
    } catch (error) {
        throw error
    }
}

populateStudents();

const populateMode = async() =>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/fee/viewAll');

        if(response.ok){
            const fees = await response.json();

            const feesContainer = document.getElementById('mode');
            feesContainer.innerHTML = '<option value="">Filter by Payment Mode</option>';

            fees.forEach(fee => {
                const option = document.createElement('option');
                option.value = fee.PaymentMode;
                option.textContent = fee.PaymentMode;

                feesContainer.appendChild(option);
            });
        }
    } catch (error) {
        throw error;
    }
}

populateMode();

const loadYears = async()=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/viewAll')
        if(response.ok){
            const years = await response.json();
            const yearSelect = document.getElementById('year');
            yearSelect.innerHTML= '<option value="">Filter by Year</option>';
            
            const uniqueYear = new Set();

            years.forEach(year=>{
                if(!uniqueYear.has(year.yearName)){
                    uniqueYear.add(year.yearName);

                    const yearOption = document.createElement('option');
                    yearOption.value = year.yearName;
                    yearOption.textContent = year.yearName
                    yearSelect.appendChild(yearOption);
                }
            });
        }
    } catch (error) {
        throw error
    }
}

loadYears()

const loadTerms = async()=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/term/viewAll')
        if(response.ok){
            const terms = await response.json();
            const termSelect = document.getElementById('term');
            termSelect.innerHTML= '<option value="">Filter by Term</option>';
            
            const uniqueTerm = new Set();

            terms.forEach(term=>{
                if(!uniqueTerm.has(term.term.value)){
                    uniqueTerm.add(term.term.value);

                    const option = document.createElement('option');
                    option.value = term.term.value;
                    option.textContent = `Term ${term.term.value}`;
                    termSelect.appendChild(option);
                }
            });
        }
    } catch (error) {
        throw error
    }
}

loadTerms();

const filters = {
    mode: '',
    term: '',
    year: ''
};

function setupModeFilters() {
    Object.keys(filters).forEach(filter => {
        const element = document.getElementById(filter);
        if (element) {
            element.addEventListener('change', () => {
                filters[filter] = element.value;
                applyModeFilters();
            });
        }
    });
}

async function applyModeFilters() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/fee/view-all-detailed');

        if (!response.ok) {
            console.error('Failed to load payment data.');
            return;
        }

        const paymentData = await response.json();

        const feesContainer = document.getElementById('fees-container');
        feesContainer.innerHTML = '';

        const modeFilter = document.getElementById('mode').value.toLowerCase();
        const termFilter = document.getElementById('term').value.toLowerCase();
        const yearFilter = document.getElementById('year').value.toLowerCase();

        const filteredData = paymentData.filter(data => {
            return (
                (!modeFilter || data.Fee.PaymentMode.toLowerCase().includes(modeFilter)) &&
                (!termFilter || data.Term.value.toLowerCase().includes(termFilter)) &&
                (!yearFilter || data.Year.yearName.toLowerCase().includes(yearFilter))
            );
        });

        filteredData.forEach(data => {
            const feeRow = document.createElement('tr');

            const studentCell = document.createElement('td');
            const refCell = document.createElement('td');
            const yearCell = document.createElement('td');
            const termCell = document.createElement('td');
            const amountCell = document.createElement('td');
            const methodCell = document.createElement('td');
            const dateCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            studentCell.textContent = data.Student.StudentID;
            refCell.textContent = data.Fee.Ref;
            yearCell.textContent = data.Year.yearName;
            termCell.textContent = data.Term.value;
            amountCell.textContent = data.Fee.AmountPaid;
            methodCell.textContent = data.Fee.PaymentMode;
            dateCell.textContent = data.Fee.PaymentDate.split('T')[0];

            const editButton = document.createElement('button');
            editButton.className = 'edit-btn';
            editButton.textContent = 'Edit';
            editButton.onclick = () => {
                document.getElementById('editFeeId').value = data.Fee.FeeId;
                document.getElementById('editStudentId').value = data.Student.StudentID;
                document.getElementById('editRef').value = data.Fee.Ref;
                document.getElementById('editAmount').value = data.Fee.AmountPaid;
                document.getElementById('editMethod').value = data.Fee.PaymentMode;
                fetchYear('editYear', data.Term, data.Year);
                fetchAccounts('editAccount', data.Account);
                toggleModal('#editFeeModal', '#modalOverlay');
            };

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = async () => {
                if (confirm('Are you sure you want to delete this fee?')) {
                    try {
                        const deleteResponse = await fetchRequest(
                            `http://localhost:3000/api/simba-systems/fee/delete`,
                            { FeeId: data.Fee.FeeId }
                        );

                        if (deleteResponse.ok) {
                            alert('Fee deleted successfully!');
                            loadFees();
                        } else {
                            const error = await deleteResponse.json();
                            throw new Error(error.message || 'Failed to delete fee');
                        }
                    } catch (error) {
                        console.error('Error deleting fee:', error);
                        alert('Failed to delete fee. Please try again.');
                    }
                }
            };

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            feeRow.appendChild(studentCell);
            feeRow.appendChild(refCell);
            feeRow.appendChild(yearCell);
            feeRow.appendChild(termCell);
            feeRow.appendChild(amountCell);
            feeRow.appendChild(methodCell);
            feeRow.appendChild(dateCell);
            feeRow.appendChild(actionsCell);

            feesContainer.appendChild(feeRow);
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
}


setupModeFilters();