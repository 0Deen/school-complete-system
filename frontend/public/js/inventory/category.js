const loadCategories = async()=>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory-category/viewAll');
        if(response.ok){
            const categories = await response.json();
            const categoryContainer = document.getElementById('category-container');
            const searchQuery = document.getElementById('searchCategory').value.toLowerCase();

            categoryContainer.innerHTML = '';

            const filterCategory = categories.filter(category => {
                return (!searchQuery || 
                    category.name.toLowerCase().includes(searchQuery.toLowerCase())||
                    category.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
            });

           filterCategory.forEach(category=>{
                const catRow = document.createElement('tr');

                const nameCell = document.createElement('td');
                const descriptionCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                const editButton = document.createElement('button');
                const deleteButton = document.createElement('button');

                nameCell.textContent = category.name;
                descriptionCell.textContent = category.description;
                editButton.textContent = 'Edit';
                deleteButton.textContent = 'Delete';

                editButton.onclick=()=>{
                    document.getElementById('editId').value = category.categoryId;
                    document.getElementById('editName').value = category.name;
                    document.getElementById('editDescription').value = category.description;
                    toggleModal('#editModal', '#modalOverlay')
                };

                deleteButton.onclick=async()=>{
                    if(confirm('Are you sure you want to delete this category?')){
                        const deleteResponse = await fetchRequest('http://localhost:3000/api/simba-systems/inventory-category/delete',{categoryId:category.categoryId});
                           
                        if(deleteResponse.ok){
                            alert(`${category.name} Category deleted sucessfully`);
                            loadCategories();
                        }else{
                            alert('Failed to delete category')
                        }
                    }
                };

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                catRow.appendChild(nameCell);
                catRow.appendChild(descriptionCell);
                catRow.appendChild(actionsCell);

                categoryContainer.appendChild(catRow)
            })
        }else{
            alert('An error ocurred, please try again');
        }
    } catch (error) {
        throw error;
    }
}

document.getElementById('searchCategory').addEventListener('input', loadCategories);

loadCategories();

const addCategory = async()=>{
    try {
        const name = document.getElementById('addName').value;
        const description = document.getElementById('addDescription').value;

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory-category/create',{name, description});

        if(response.ok){
            loadCategories();
            toggleModal('#addModal', '#modalOverlay');
        }else{
            alert("An error ocurrred, Please try again later");
            toggleModal('#addModal', '#modalOverlay');
        }
    } catch (error) {
        throw error;
    }
}

const editCategory = async()=>{
    try {
        const categoryId = document.getElementById('editId').value;
        const name = document.getElementById('editName').value;
        const description = document.getElementById('editDescription').value;

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory-category/edit',{categoryId, name, description});

        if(response.ok){
            alert('Category saved Succesfully');
            toggleModal('#editModal', '#modalOverlay');
            loadCategories();
        }else{
            alert('An error occurred Saving');
            toggleModal('#editModal', '#modalOverlay');
        }
    } catch (error) {
        throw error;
    }
}

