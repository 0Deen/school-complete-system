const saveUser = async()=>{
    try {
        const firstName = document.getElementById('fname').value;
        const lastName = document.getElementById('lname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const cPass = document.getElementById('cpassword').value;
        const status = document.getElementById('status');

        if(!firstName || !lastName || !email || !phone || !password || !cPass){
            status.textContent = "Please fill in all the fields";
            status.style.color = 'red';
            return;
        }

        if(password !== cPass){
            status.textContent = "Passwords Don't match";
            status.style.color = 'red';
            return;
        }

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/setup/initialize',{firstName, lastName, email, phone, password});
        if(response.ok){
            status.textContent = "Operation Successful";
            status.style.color = 'green';
            window.location.href = ''
        }else{
            status.textContent = "An error ocurred, please try again later";
            status.style.color = 'red';
        }

    } catch (error) {
        throw error
    }
}