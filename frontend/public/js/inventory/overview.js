const animateCount = (elementId, from, to, duration) => {
    const startTime = performance.now();

    function animate() {
        const currentTime = performance.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const count = Math.floor(from + (to - from) * progress);

        document.getElementById(elementId).textContent = count;

        if(progress < 1) {
            requestAnimationFrame(animate);
        } else {
            document.getElementById(elementId).textContent = to;
        }
    }

    requestAnimationFrame(animate);
}

const populateCounts = async() =>{
    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/inventory/get-count');

        if(response.ok){
            const data = await response.json();

            animateCount('totalProducts', 0, data.totalProducts || 0, 1500);
            animateCount('totalCategories', 0 , data.totalCategories || 0, 1500);

        const supplierResponse = await fetchRequest('http://localhost:3000/api/simba-systems/supplier/get-count');
        if (supplierResponse.ok) {
            const data = await supplierResponse.json();

           animateCount('totalSuppliers', 0, data.totalSuppliers || 0, 1500);
        }
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

populateCounts();