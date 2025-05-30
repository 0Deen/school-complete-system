const fetchRequest = async (route, body = null) => {
    const token = localStorage.getItem('token');

    if (body) {
        body = { ...body, token };
    } else {
        body = { token };
    }

/*     console.log('Body', body)
    console.log('Route', route)
    console.log('token' , token) */

    const response = await fetch(route, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return response;
};
     