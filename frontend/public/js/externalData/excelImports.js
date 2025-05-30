async function importExcelFile() {
    const fileInput = document.getElementById('excelFile');
    
    if (fileInput.files.length === 0) {
        alert('Please select an Excel file to import.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('http://localhost:3000/api/simba-systems/excel/import', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Excel file imported successfully!');
            loadExcelData();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to import Excel file');
        }
    } catch (error) {
        console.error('Error importing Excel file:', error);
        alert('Failed to import Excel file. Please try again.');
    }
}

async function loadExcelData() {
    try {
        const response = await fetch('http://localhost:3000/api/simba-systems/excel/viewAll');
        if (response.ok) {
            const excelData = await response.json();
            const excelDataContainer = document.getElementById('excel-data-container');
            
            if (excelDataContainer) {
                excelDataContainer.innerHTML = '';
                excelData.forEach(data => {
                    const dataRow = document.createElement('tr');
                    
                    const nameCell = document.createElement('td');
                    nameCell.textContent = data.Name;
                    
                    const valueCell = document.createElement('td');
                    valueCell.textContent = data.Value;

                    const actionsCell = document.createElement('td');
                    
                    const editButton = document.createElement('button');
                    editButton.className = 'edit-btn';
                    editButton.textContent = 'Edit';
                    editButton.onclick = () => openEditExcelModal(data);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-btn';
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteExcelData(data.Id);

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    dataRow.appendChild(nameCell);
                    dataRow.appendChild(valueCell);
                    dataRow.appendChild(actionsCell);

                    excelDataContainer.appendChild(dataRow);
                });
            }
        } else {
            console.error('Failed to load Excel data.');
        }
    } catch (error) {
        console.error('Error fetching Excel data:', error);
    }
}

function openEditExcelModal(data) {
    document.getElementById('editExcelId').value = data.Id;
    document.getElementById('editExcelName').value = data.Name;
    document.getElementById('editExcelValue').value = data.Value;
    toggleModal('#editExcelModal', '#modalOverlay');
}

async function deleteExcelData(id) {
    if (confirm('Are you sure you want to delete this Excel data?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/simba-systems/excel/delete/${id}`, {
                method: 'POST',
            });

            if (response.ok) {
                alert('Excel data deleted successfully!');
                loadExcelData();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete Excel data');
            }
        } catch (error) {
            console.error('Error deleting Excel data:', error);
            alert('Failed to delete Excel data. Please try again.');
        }
    }
}