const loadProducts = async()=>{
    try {
        loadCategories('addCategory');
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory/viewAll');
        if(response.ok){
            const products = await response.json();
            const productsContainer = document.getElementById('products-container');
            const searchQuery = document.getElementById('searchProducts').value.toLowerCase();

            productsContainer.innerHTML = '';

            const filterProducts = products.filter(product => {
                return (
                    !searchQuery ||
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.inventory_category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
            });

            filterProducts.forEach(product=>{
                const productCell = document.createElement('tr');

                const nameCell = document.createElement('td');
                const categoryCell = document.createElement('td');
                const amountCell = document.createElement('td');
                const descriptionCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                const editButton = document.createElement('button');
                const deleteButton = document.createElement('button');

                
                nameCell.textContent = product.name;
                categoryCell.textContent = product.inventory_category.name;
                amountCell.textContent = `${product.amount} ${product.unit}`;
                descriptionCell.textContent = product.description;
                editButton.textContent = 'Edit';
                deleteButton.textContent = 'Delete';

                editButton.onclick=async()=>{
                    document.getElementById('editId').value = product.inventoryId;
                    document.getElementById('editName').value = product.name;
                    document.getElementById('editAmount').value = product.amount;
                    document.getElementById('editUnit').value = product.unit;
                    document.getElementById('editDescription').value = product.description;

                    loadCategories('editCategory', product.inventory_category);
                    toggleModal('#editModal', '#modalOverlay')
                }

                deleteButton.onclick=async()=>{
                    if(confirm("Are you sure you want to delete this item?")){
                        const deleteResponse = await fetchRequest('http://localhost:3000/api/simba-systems/inventory/delete',{inventoryId:product.inventoryId});
                          
                        if(deleteResponse.ok){
                            alert('Product deleted Sucessfully');
                            loadProducts();
                        }
                    }
                }

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);
                
                productCell.appendChild(nameCell);
                productCell.appendChild(categoryCell);
                productCell.appendChild(amountCell);
                productCell.appendChild(descriptionCell);
                productCell.appendChild(actionsCell);

                productsContainer.appendChild(productCell);
            });
        }

    } catch (error) {
        throw error;
    }
}

document.getElementById('searchProducts').addEventListener('input', loadProducts);

const createProduct = async()=>{
    try {
        const name = document.getElementById('addName').value;
        const description = document.getElementById('addDescription').value;
        const amount = document.getElementById('addAmount').value;
        const unit = document.getElementById('addUnit').value;
        const categoryId = document.getElementById('addCategory').value;

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory/create',{name, amount, unit, description, categoryId});
            
        if(response.ok){
            loadProducts();
            alert(`Product : ${name} added sucessfully`);
            toggleModal('#addModal', '#modalOverlay');
        }else{
            loadProducts();
            alert(`Product : ${name} added sucessfully`);
            toggleModal('#addModal', '#modalOverlay');
        }
    } catch (error) {
        throw error;
    }
}

const editProduct = async()=>{
    try {
        const inventoryId = document.getElementById('editId').value
        const name = document.getElementById('editName').value
        const description = document.getElementById('editDescription').value
        const amount = document.getElementById('editAmount').value
        const unit = document.getElementById('editUnit').value
        const categoryId = document.getElementById('editCategory').value

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory/edit',{ inventoryId, name, description, amount, unit, categoryId });

        if(response.ok){
            alert('Item saved sucessfully');
            toggleModal('#editModal', '#modalOverlay');
            loadProducts();
        }else{
            alert('An error ocurred, please try again later');
            toggleModal('#editModal', '#modalOverlay');
            loadProducts();
        }
    } catch (error) {
        throw error;
    }
}

const loadCategories = async(selectId, selected)=>{
    try {
        const categoryContainer = document.getElementById(selectId);
        categoryContainer.innerHTML = '';
        const option = document.createElement('option');

        if(selected){
            option.textContent = selected.name;
            option.value = selected.categoryId;
        }else{
            option.textContent = 'Select a product category'
        }

        categoryContainer.appendChild(option);

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory-category/viewAll');

        if(response.ok){
            const categories = await response.json();

            categories.forEach(category =>{
                if(selected){
                    if(category.categoryId === selected.categoryId)return;
                }
                const option = document.createElement('option');
                option.textContent = category.name;
                option.value = category.categoryId;
    
                categoryContainer.appendChild(option);
            });
        }else{
            const error = await response.json()
            throw error.error;
        }

       
    } catch (error) {
        throw error;
    }
}

loadProducts();

const getCategories = async() => {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory-category/viewAll');

        if(response.ok){
            const categories = await response.json();
            const categoryContainer = document.getElementById('category');
            categoryContainer.innerHTML = '<option value="">Filter by category</option>';

            const uniqueCategory = new Set();

            categories.forEach(category =>{
                if(!uniqueCategory.has(category.name)) {
                    uniqueCategory.add(category.name);
                    const option = document.createElement('option');
                    option.textContent = category.name;
                    option.value = category.name;
        
                    categoryContainer.appendChild(option);
                }
            });
        }else{
            const error = await response.json()
            throw error.error;
        }
    } catch (error) {
        throw error;
    }
}

getCategories();

const filters = {
    category: '',
};

function setupFilters() {
    Object.keys(filters).forEach(filter => {
        const element = document.getElementById(filter);
        if (element) {
            element.addEventListener('change', () => {
                filters[filter] = element.value;
                applyFilters();
            });
        }
    });
}

async function applyFilters() {
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory/viewAll');
        if (response.ok) {
            const products = await response.json();
            const productContainer = document.getElementById('products-container');
            productContainer.innerHTML = '';

            const filterProducts = products.filter(product => {
                return (
                    !filters.category || product.inventory_category.name === filters.category)
            });

            filterProducts.forEach(product=>{
                const productCell = document.createElement('tr');

                const nameCell = document.createElement('td');
                const categoryCell = document.createElement('td');
                const amountCell = document.createElement('td');
                const descriptionCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                const editButton = document.createElement('button');
                const deleteButton = document.createElement('button');

                
                nameCell.textContent = product.name;
                categoryCell.textContent = product.inventory_category.name;
                amountCell.textContent = `${product.amount} ${product.unit}`;
                descriptionCell.textContent = product.description;
                editButton.textContent = 'Edit';
                deleteButton.textContent = 'Delete';

                editButton.onclick=async()=>{
                    document.getElementById('editId').value = product.inventoryId;
                    document.getElementById('editName').value = product.name;
                    document.getElementById('editAmount').value = product.amount;
                    document.getElementById('editUnit').value = product.unit;
                    document.getElementById('editDescription').value = product.description;

                    loadCategories('editCategory', product.inventory_category);
                    toggleModal('#editModal', '#modalOverlay')
                }

                deleteButton.onclick=async()=>{
                    if(confirm("Are you sure you want to delete this item?")){
                        const deleteResponse = await fetchRequest('http://localhost:3000/api/simba-systems/inventory/delete',{inventoryId:product.inventoryId});
                          
                        if(deleteResponse.ok){
                            alert('Product deleted Sucessfully');
                            loadProducts();
                        }
                    }
                }

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);
                
                productCell.appendChild(nameCell);
                productCell.appendChild(categoryCell);
                productCell.appendChild(amountCell);
                productCell.appendChild(descriptionCell);
                productCell.appendChild(actionsCell);

                productContainer.appendChild(productCell);
            });
        } else {
            console.error('Failed to load products.');
        }
    } catch (error) {
        console.error('Error fetching products!', error);
    }
}

setupFilters();