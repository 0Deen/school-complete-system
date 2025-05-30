const testConnection = async()=>{
    try {
        const host = document.getElementById('dbHost').value;
        const port = document.getElementById('dbPort').value;
        const user = document.getElementById('dbUser').value;
        const password = document.getElementById('dbPassword').value;
        const database = document.getElementById('dbName').value;
        const statusDiv = document.getElementById('status');

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/setup/test',{host, port, user, password, database});
        if(response.ok){
            statusDiv.textContent = 'Database connection sucessful';
            statusDiv.style.color = 'green'
        }else{
            statusDiv.textContent = 'Database connection unsucessful';
            statusDiv.style.color = 'red'
        }
    } catch (error) {
        console.log("Error", error)
        throw error;
    }
}

const saveSetup = async()=>{
    try {
        const host = document.getElementById('dbHost').value;
        const port = document.getElementById('dbPort').value;
        const user = document.getElementById('dbUser').value;
        const password = document.getElementById('dbPassword').value;
        const database = document.getElementById('dbName').value;
        const statusDiv = document.getElementById('status');

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/setup/save',{host, port, user, password, database});
        if(response.ok){
            statusDiv.textContent = 'Database connection sucessful';
            statusDiv.style.color = 'green'
            window.location.href = ''
        }else{
            statusDiv.textContent = 'Database connection unsucessful';
            statusDiv.style.color = 'red'
        }
    } catch (error) {
        console.log("Error", error)
        throw error;
    }
}