async function loadClasses() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/class/view-detailed');
        if (response.ok) {
            const classes = await response.json();
            const classesTable = document.getElementById('class-holder');
            classesTable.innerHTML = '';

            classes.forEach(classElement => {
                const classItem = document.createElement('tr');
                const blockName = document.createElement('td');
                const streamName = document.createElement('td');
                const teacherName = document.createElement('td');
                const actionsCell = document.createElement('td');

                blockName.textContent = classElement.Block;
                streamName.textContent = classElement.Stream;
                teacherName.textContent = classElement.Teacher;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.addEventListener('click', () => {
                    openEditClassModal(classElement);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => deleteClass(classElement.Class);

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                classItem.appendChild(blockName);
                classItem.appendChild(streamName);
                classItem.appendChild(teacherName);
                classItem.appendChild(actionsCell);

                classesTable.appendChild(classItem);
            });
        } else {
            console.error('Failed to fetch classes');
        }
    } catch (e) {
        console.error('Error fetching classes:', e);
    }
}

loadClasses();


async function deleteClass(ClassId) {
    if (confirm('Are you sure you want to delete this class?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/class/delete', { ClassId });

            if (response.ok) {
                alert('Class deleted successfully!');
                loadClasses();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete class');
            }
        } catch (error) {
            console.error('Error deleting class:', error);
            alert('Failed to delete class');
        }
    }
}

async function initializeAddClassForm() {
    const form = document.getElementById('addClassForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const classData = {
            BlockId: document.getElementById('blockSelect').value,
            blockRange:document.getElementById('blockValue').value,
            StreamId: document.getElementById('streamSelect').value,
            teacher: document.getElementById('teacherSelect').value,
        };

        // if (classData.BlockId && classData.StreamId && classData.teacher) {
            
        // } else {
        //     alert('Please fill in all required fields');
        // }
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/class/create', classData);

            if (response.ok) {
                alert('Class added successfully!');
                toggleModal('#addClassForm', '#modalOverlayClass');
                loadClasses();
                resetForm();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add class');
            }
        } catch (error) {
            console.error('Error adding class:', error);
            alert('Failed to add class. Please try again.');
        }
    });
}

function resetForm(){
    document.getElementById('blockSelect').value = "";
    document.getElementById('blockValue').value = "";
    document.getElementById('streamSelect').value = "";
    document.getElementById('teacherSelect').value = "";
}

const populateDropdowns = async () => {
    try {
        const blockResponse = await fetchRequest('http://localhost:3000/api/simba-systems/block/viewAll');
        if (blockResponse.ok) {
            const blocks = await blockResponse.json();
            const blockSelect = document.getElementById('blockSelect');
            
            blockSelect.innerHTML = "<option value=''>Select Block</option>";
            blocks.forEach(block => {
                const option = document.createElement('option');
                option.value = block.BlockId;
                option.textContent = block.Name;
                blockSelect.appendChild(option);
            });
            blockSelect.addEventListener('change',()=>{
                populateBlockRange(blocks,blockSelect.value,'blockValue')
            });
        } else {
            console.error('Failed to fetch blocks');
        }

        const streamResponse = await fetchRequest('http://localhost:3000/api/simba-systems/stream/viewAll');
        if (streamResponse.ok) {
            const streams = await streamResponse.json();
            const streamSelect = document.getElementById('streamSelect');
            streamSelect.innerHTML = "<option value=''>Select Stream</option>";
            streams.forEach(stream => {
                const option = document.createElement('option');
                option.value = stream.StreamId;
                option.textContent = stream.Name;
                streamSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch streams');
        }

        const employeeResponse = await fetchRequest('http://localhost:3000/api/simba-systems/employee/viewAll');
        if (employeeResponse.ok) {
            const employees = await employeeResponse.json();
            const teacherSelect = document.getElementById('teacherSelect');
            teacherSelect.innerHTML = "<option value=''>Select Teacher</option>";
            employees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.EmployeeID;
                option.textContent = `${employee.FirstName} ${employee.LastName}`; 
                teacherSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch teachers');
        }
    } catch (error) {
        console.error('Error populating dropdowns:', error);
        alert('Error fetching dropdown options');
    }
};

const populateBlockRange = async (blocks, selected, selectId, classItem) => {
    try {
        const blockRange = classItem?.BlockRange || null;
        const blockValue = document.getElementById(selectId);
        blockValue.innerHTML = '';

        if (blockRange && !blocks) {
            const option = document.createElement('option');
            option.value = blockRange;
            option.textContent = blockRange;
            blockValue.appendChild(option);
            return;
        }

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Block Level';
        blockValue.appendChild(defaultOption);

        if (!blocks) return;

        const selectedBlock = blocks.find(block => block.BlockId === selected);
        if (!selectedBlock) return;

        for (let i = selectedBlock.startRange; i <= selectedBlock.endRange; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            blockValue.appendChild(option);
        }
    } catch (error) {
        console.error('Error populating block range:', error);
        throw error;
    }
};

populateDropdowns();

const openEditClassModal = async (classElement) => {
    try {
        const classResponse = await fetchRequest('http://localhost:3000/api/simba-systems/class/view-detailed-class',{ ClassId: classElement.Class });

        if (classResponse.ok) {
            const classItem = await classResponse.json();
            await populateBlockSelect(classItem);
            await populateBlockRange(null,null,'editBlockValue', classItem.Class)
            await populateStreamSelect(classItem.Stream);
            await populateTeacherSelect(classItem.Teacher);

            document.getElementById('editClassId').value = classElement.Class;
        } else {
            console.error('Failed to fetch detailed class data');
        }
    } catch (error) {
        console.error('Error fetching detailed class data:', error);
    }

    toggleModal('#editClassForm', '#modalOverlayEdit');
};

const populateBlockSelect = async (classItem) => {
    try {
        const Block = await classItem.Block;
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/block/viewAll');
        if (response.ok) {
            const blocks = await response.json();
            const blockSelect = document.getElementById('editBlockSelect');
            blockSelect.innerHTML = '';

            const savedOption = document.createElement('option');
            savedOption.value = Block.id;
            savedOption.textContent = Block.name;
            savedOption.selected = true;
            blockSelect.appendChild(savedOption);

            blocks.forEach(block => {
                if (block.BlockId === Block.id) return; 
                const option = document.createElement('option');
                option.value = block.BlockId;
                option.textContent = `${block.Name}`;
                blockSelect.appendChild(option);
            });

            blockSelect.addEventListener('change',()=>{
                populateBlockRange(blocks,blockSelect.value,'editBlockValue', classItem.Class);
            });
        } else {
            console.error('Failed to fetch blocks');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const populateStreamSelect = async (Stream) => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/stream/viewAll');
        if (response.ok) {
            const streams = await response.json();
            const streamSelect = document.getElementById('editStreamSelect');
            streamSelect.innerHTML = '';

            const savedOption = document.createElement('option');
            savedOption.value = Stream.id;
            savedOption.textContent = Stream.name;
            savedOption.selected = true;
            streamSelect.appendChild(savedOption);

            streams.forEach(stream => {
                if (stream.StreamId === Stream.id) return;
                const option = document.createElement('option');
                option.value = stream.StreamId;
                option.textContent = stream.Name;
                streamSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch streams');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const populateTeacherSelect = async (teacher) => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/employee/viewAll');
        if (response.ok) {
            const employees = await response.json();
            const teacherSelect = document.getElementById('editTeacherSelect');
            teacherSelect.innerHTML = ''; 
      
            const savedOption = document.createElement('option');
            savedOption.value = teacher.id;
            savedOption.textContent = `${teacher.fname} ${teacher.lname}`;
            savedOption.selected = true;
            teacherSelect.appendChild(savedOption);
       
            employees.forEach(employee => {
                if (employee.EmployeeID === teacher.id) return;

                const option = document.createElement('option');
                option.value = employee.EmployeeID;
                option.textContent = `${employee.FirstName} ${employee.LastName}`;
                teacherSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch teachers');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

function initializeEditClassForm() {
    const form = document.getElementById('editClassForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const ClassId =  document.getElementById('editClassId').value
        const BlockId =  document.getElementById('editBlockSelect').value
        const BlockRange = document.getElementById('editBlockValue').value
        const StreamId =  document.getElementById('editStreamSelect').value
        const TeacherId =  document.getElementById('editTeacherSelect').value

        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/class/edit', {ClassId, BlockId, BlockRange, StreamId,teacher:TeacherId});

            if (response.ok) {
                alert('Class updated successfully!');
                toggleModal('#editClassForm', '#modalOverlayEdit');
                loadClasses();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update class');
            }
        } catch (error) {
            console.error('Error updating class:', error);
            alert('Failed to update class. Please try again.');
        }
    });
}

const filters = {
    class: ''
}

function setupFilters() {
    const searchInput = document.getElementById('searchClass');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filters.classItem = searchInput.value.trim();
            applyClassFilters();
        });
    }
}

async function applyClassFilters() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/class/view-detailed');
        if (response.ok) {
            const classElements = await response.json();

            const classContainer = document.getElementById('class-holder');
            classContainer.innerHTML = '';

            const filteredClasses = classElements.filter(classItem => {
                return (
                    (!filters.classItem || 
                        (classItem.Block && typeof classItem.Block === 'string' && classItem.Block.toLowerCase().includes(filters.classItem.toLowerCase())) || 
                        (classItem.Stream && typeof classItem.Stream === 'string' && classItem.Stream.toLowerCase().includes(filters.classItem.toLowerCase())) ||
                        (classItem.Teacher && typeof classItem.Teacher === 'string' && classItem.Teacher.toLowerCase().includes(filters.classItem.toLowerCase()))
                    )
                );
            });

            if (filteredClasses.length === 0) {
                classContainer.innerHTML = '<tr><td colspan="4">No classes found.</td></tr>';
                return;
            }

            filteredClasses.forEach(classItem => {
                const classRow = document.createElement('tr');

                const blockCell = document.createElement('td');
                const streamCell = document.createElement('td');
                const teacherCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                blockCell.textContent = classItem.Block || 'No block available';
                streamCell.textContent = classItem.Stream || 'No stream available';
                teacherCell.textContent = classItem.Teacher || 'No teacher available';

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.addEventListener('click', () => {
                    openEditClassModal(classItem);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.addEventListener('click', () => {
                    confirmDeleteClass(classItem.Class);
                });

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                classRow.appendChild(blockCell);
                classRow.appendChild(streamCell);
                classRow.appendChild(teacherCell);
                classRow.appendChild(actionsCell);

                classContainer.appendChild(classRow);
            });
        } else {
            console.error('Failed to load classes.');
        }
    } catch (error) {
        console.error('Error fetching classes!', error);
    }
}

setupFilters();

