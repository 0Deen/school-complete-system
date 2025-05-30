function toggleModal(modalId, overlayId) {
    const modal = document.querySelector(modalId);
    const overlay = document.querySelector(overlayId);

    if (!modal.classList.contains('active')) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
        
        setTimeout(() => {
            modal.classList.add('active');
            overlay.classList.add('active');
        }, 10);
    } else {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        
        setTimeout(() => {
            const modals = document.querySelectorAll('.modal');
            const activeModals = Array.from(modals).filter(m => m.classList.contains('active'));
            
            if (activeModals.length === 0) {
                overlay.style.display = 'none';
            }
            modal.style.display = 'none';
        }, 300);
    }
}

