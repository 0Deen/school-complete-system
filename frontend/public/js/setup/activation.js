function activateSystem() {
    const activationCode = document.getElementById('activationCode').value;
    const activationMessage = document.getElementById('activationMessage');

    if (!activationCode) {
        activationMessage.textContent = 'Please enter an activation code.';
        activationMessage.style.color = 'red';
        return;
    }

    fetch('http://localhost:3000/api/simba-system/activation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activationCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('activationStatus').innerHTML = '<p>Your system is currently <strong>activated</strong>.</p>';
            activationMessage.textContent = 'Activation successful!';
            activationMessage.style.color = 'green';
        } else {
            activationMessage.textContent = 'Invalid activation code. Please try again.';
            activationMessage.style.color = 'red';
        }
    })
    .catch(error => {
        activationMessage.textContent = 'An error occurred during activation. Please try again later.';
        activationMessage.style.color = 'red';
    });
}