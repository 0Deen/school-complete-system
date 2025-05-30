async function loadSuppliers() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/supplier/viewAll');

        if (response.ok) {
            const suppliers = await response.json();

            const supplierContainer = document.getElementById('supplier-container');
            const searchQuery = document.getElementById('searchSupplier').value.toLowerCase();

            supplierContainer.innerHTML = '';

            const suppliersFilter = suppliers.filter(supplier => {
                return (
                    !searchQuery ||
                    supplier.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    supplier.phone.includes(searchQuery) ||
                    supplier.products.toLowerCase().includes(searchQuery.toLowerCase())
                );
            });            

            suppliersFilter.forEach(supplier => {
                const supplierRow = document.createElement('tr');

                const nameCell = document.createElement('td');
                const phoneCell = document.createElement('td');
                const emailCell = document.createElement('td');
                const productCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                nameCell.textContent = supplier.Name;
                phoneCell.textContent = supplier.phone;
                emailCell.textContent = supplier.email;
                productCell.textContent = supplier.products;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => {
                    document.getElementById('editId').value = supplier.supplierId;
                    document.getElementById('editName').value = supplier.Name;
                    document.getElementById('editPhone').value = supplier.phone;
                    document.getElementById('editEmail').value = supplier.email;
                    document.getElementById('editProducts').value = supplier.products;

                    toggleModal('#editModal', '#modalOverlay');
                }

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = async () => {
                    if (confirm('Are you sure you want to delete this supplier?')) {
                        try {
                            const deleteResponse = await fetchRequest(`http://localhost:3000/api/simba-systems/supplier/delete`, {supplierId:supplier.supplierId});
                               
                            if (deleteResponse.ok) {
                                alert('Supplier deleted successfully!');
                                loadSuppliers();
                            } else {
                                alert('Failed to delete supplier');
                                const error = await deleteResponse.json();
                                throw new Error(error.message || 'Failed to delete supplier');
                            }
                        } catch (error) {
                            console.error('Error deleting supplier:', error);
                            alert('Failed to delete supplier');
                        }
                    }
                }

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                supplierRow.appendChild(nameCell);
                supplierRow.appendChild(phoneCell);
                supplierRow.appendChild(emailCell);
                supplierRow.appendChild(productCell);
                supplierRow.appendChild(actionsCell);

                supplierContainer.appendChild(supplierRow);
            });
        } else {
            console.error('Failed to load suppliers.');
        }
    } catch (error) {
        console.error('Error fetching suppliers:', error);
    }
}

document.getElementById('searchSupplier').addEventListener('input', loadSuppliers);

loadSuppliers();

async function addSupplier() {
    try {
        const Name = document.getElementById('addName').value;
        const phone = document.getElementById('addPhone').value;
        const email = document.getElementById('addEmail').value;
        const products = document.getElementById('addProducts').value;

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/supplier/create',{ Name, phone, email, products });
            
        if (response.ok) {
            alert('Supplier added successfully!');
            toggleModal('#addModal', '#modalOverlay');
            loadSuppliers();
        } else {
            alert('Failed to add supplier. Please try again.');
            const error = await response.json();
            throw new Error(error.message || 'Failed to add supplier');
        }
    } catch (error) {
        console.error('Error adding supplier:', error);
        alert('Failed to add supplier. Please try again.');
    }
}

async function editSupplier() {
    try {
        const supplierId = document.getElementById('editId').value;
        const Name = document.getElementById('editName').value;
        const phone = document.getElementById('editPhone').value;
        const email = document.getElementById('editEmail').value;
        const products = document.getElementById('editProducts').value;

        const response = await fetchRequest(`http://localhost:3000/api/simba-systems/supplier/edit`, {supplierId, Name, phone, email, products});

        if (response.ok) {
            alert('Supplier updated successfully!');
            toggleModal('#editModal', '#modalOverlay');
            loadSuppliers();
        } else {
            alert('Failed to update supplier. Please try again.');
            const error = await response.json();
            throw new Error(error.message || 'Failed to update supplier');
        }
    } catch (error) {
        console.error('Error updating supplier:', error);
        alert('Failed to update supplier. Please try again.');
    }
}

async function deleteSupplier(supplierId) {
    
}

const populateSuppliers = async () => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/supplier/viewall');
        
        if (response.ok) {
            const suppliers = await response.json();

            const supplierSelect = document.getElementById('supplier');
            
            supplierSelect.innerHTML = '<option value="">Filter by supplier</option>';
            
            const uniqueSuppliers = new Set();
            
            suppliers.forEach(supplier => {
                if (!uniqueSuppliers.has(supplier.products)) {
                    uniqueSuppliers.add(supplier.products);

                    const option = document.createElement('option');
                    option.textContent = supplier.products;
                    option.value = supplier.supplierId;
                    supplierSelect.appendChild(option);
                }
            });
        } else {
            console.error(`Failed to fetch suppliers: ${response.status}`);
        }
    } catch (error) {
        console.error('An error occurred while populating suppliers:', error);
    }
};

populateSuppliers();

const filters = {
    supplier: '',
};

function setupSupplierFilters() {
    Object.keys(filters).forEach(filter => {
        const element = document.getElementById(filter);
        if (element) {
            element.addEventListener('change', () => {
                filters[filter] = element.value;
                applySupplierFilters(element.value);
            });
        }
    });
}

async function applySupplierFilters(supplierId) {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/supplier/view', { supplierId });

        if (!response.ok) {
            console.error('Failed to load suppliers.');
            return;
        }

        const supplier = await response.json();

        const suppliers = Array.isArray(supplier) ? supplier : [supplier];

        const suppliersContainer = document.getElementById('supplier-container');
        suppliersContainer.innerHTML = '';

        suppliers.forEach(supplier => {
            const supplierRow = document.createElement('tr');

            const nameCell = document.createElement('td');
            const phoneCell = document.createElement('td');
            const emailCell = document.createElement('td');
            const productsCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            nameCell.textContent = supplier.Name;
            phoneCell.textContent = supplier.phone;
            emailCell.textContent = supplier.email;
            productsCell.textContent = supplier.products;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.onclick = () => {
                document.getElementById('supplierId').value = supplier.supplierId;
                document.getElementById('editSupplierName').value = supplier.Name;
                document.getElementById('editSupplierPhone').value = supplier.phone;
                document.getElementById('editSupplierEmail').value = supplier.email;
                document.getElementById('editSupplierProducts').value = supplier.products;
                toggleModal('#editModal', '#modalOverlay');
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteSupplier(supplier.supplierId);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            supplierRow.appendChild(nameCell);
            supplierRow.appendChild(phoneCell);
            supplierRow.appendChild(emailCell);
            supplierRow.appendChild(productsCell);
            supplierRow.appendChild(actionsCell);

            suppliersContainer.appendChild(supplierRow);
        });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
    }
}

setupSupplierFilters();
