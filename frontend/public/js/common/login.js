const login = async () => {
    try {
        localStorage.clear();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetchRequest('http://localhost:3000/api/simba-systems/user/login', { email, password });

        if (response.ok) {
            const data = await response.json();
            const expires = new Date();
            expires.setTime(expires.getTime() + 60 * 60 * 1000);
            const token = {
                token:data.cookie,
                expiry:1
            }
            localStorage.setItem('token', JSON.stringify(token));

            window.location.href = '../dashboard/overview.html';
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
        }
    } catch (error) {
        console.error('Error occurred during login:', error);
    }
};