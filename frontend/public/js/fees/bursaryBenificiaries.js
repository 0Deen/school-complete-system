const populateFilters = async () => {
    try {
        const classResponse = await fetchRequest('http://localhost:3000/api/simba-systems/class/view-detailed');
        const streamResponse = await fetchRequest('http://localhost:3000/api/simba-systems/stream/viewAll');

        if (classResponse.ok && streamResponse.ok) {
            const classes = await classResponse.json();
            const streams = await streamResponse.json();

            const classSelect = document.getElementById('classSelect');
            classSelect.innerHTML = '<option value="">All Classes</option>';
            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.Class;
                option.textContent = `${cls.Block} ${cls.Stream}`;
                classSelect.appendChild(option);
            });

            const streamSelect = document.getElementById('streamSelect');
            streamSelect.innerHTML = '<option value="">All Streams</option>';
            streams.forEach(stream => {
                const option = document.createElement('option');
                option.value = stream.StreamId;
                option.textContent = stream.Name;
                streamSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error populating filters:', error);
    }
};

const filterStudents = async () => {
    const classId = document.getElementById('classSelect').value;
    const gender = document.getElementById('genderSelect').value;
    const streamId = document.getElementById('streamSelect').value;

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/student/viewAll');
        if (response.ok) {
            let students = await response.json();

            if (classId) {
                students = students.filter(student => student.ClassID === classId);
            }
            if (gender) {
                students = students.filter(student => student.Gender === gender);
            }
            if (streamId) {
                students = students.filter(student => student.StreamID === streamId);
            }

            const studentSelect = document.getElementById('studentSelect');
            studentSelect.innerHTML = '<option value="">--select student--</option>';
            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.StudentID;
                option.textContent = `${student.FirstName} ${student.LastName}`;
                studentSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching or filtering students:', error);
    }
};

const populateBursariesAndAccounts = async () => {
    try {
        const [bursaryResponse, accountResponse] = await Promise.all([
            fetchRequest('http://localhost:3000/api/simba-systems/bursary/viewAll'),
            fetchRequest('http://localhost:3000/api/simba-systems/account/viewAll')
        ]);

        if (bursaryResponse.ok && accountResponse.ok) {
            const bursaries = await bursaryResponse.json();
            const accounts = await accountResponse.json();

            const bursarySelect = document.getElementById('bursarySelect');
            bursarySelect.innerHTML = '<option value="">Select Bursary</option>';
            bursaries.forEach(bursary => {
                const option = document.createElement('option');
                option.value = bursary.Bursary.bursaryId;
                option.textContent = bursary.Bursary.source;
                bursarySelect.appendChild(option);
            });

            const fromAccountSelect = document.getElementById('fromAccountSelect');
            const toAccountSelect = document.getElementById('toAccountSelect');
            fromAccountSelect.innerHTML = '<option value="">Select From Account</option>';
            toAccountSelect.innerHTML = '<option value="">Select To Account</option>';
            accounts.forEach(account => {
                const fromOption = document.createElement('option');
                fromOption.value = account.accountId;
                fromOption.textContent = account.accountName;

                const toOption = document.createElement('option');
                toOption.value = account.accountId;
                toOption.textContent = account.accountName;

                fromAccountSelect.appendChild(fromOption);
                toAccountSelect.appendChild(toOption);
            });
        }
    } catch (error) {
        console.error('Error populating bursaries or accounts:', error);
    }
};

const allocateBursary = async () => {
    const selectedStudents = Array.from(document.getElementById('studentSelect').selectedOptions).map(option => option.value);
    const bursaryId = document.getElementById('bursarySelect').value;
    const allocationAmount = document.getElementById('allocationAmount').value;
    const fromAccountId = document.getElementById('fromAccountSelect').value;
    const toAccountId = document.getElementById('toAccountSelect').value;

    if (!bursaryId || !allocationAmount || !fromAccountId || !toAccountId || selectedStudents.length === 0) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/bursary/allocate', {
            method: 'POST',
            body: {
                bursaryId,
                allocationAmount,
                fromAccountId,
                toAccountId,
                studentIds: selectedStudents
            }
        });

        if (response.ok) {
            alert('Bursary allocated successfully!');
            toggleModal('#allocateBursaryModal', '#modalOverlay');
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to allocate bursary');
        }
    } catch (error) {
        console.error('Error allocating bursary:', error);
        alert('Failed to allocate bursary.');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    populateBursariesAndAccounts();
    filterStudents();
});
