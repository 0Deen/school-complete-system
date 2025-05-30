const parentLinks = [
    { Dashboard: ['overview','upcomingEvents'] },
    { Students: ['overview','allStudents'] },
    { Academics: ['overview','blocks','streams','classes','year','terms'] },
    { Staff: ['overview', 'positionManagement', 'specializedPositions', 'employeePayroll', 'employeeManagement'] },
    { Finance: ['overview','banks','accounts','transactions',/* 'miscellaneousPayments','payments',
        'pocketMoney','purchaseOrders' */,'studentPayment','supplierPayment','suppliers'] },
    { Report: ['overview','budget','financial','other','payments','students','suppliers'] },
    { ExternalData: ['overview','bankStatement','excelImports','syncStudents'] },
    { Fees: ['overview','bursary','feeDiscount','feeRefund','feeReminder','feeStructure','payFees','voteheads']},
    { Inventory: ['overview','inventoryProducts'] },
    { Settings: ['overview','accounts','notifications','preferences','privacy','security'] }
];

const formatText = (text) => {
    return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (match) => match.toUpperCase());
};

const renderNavBar = (activeElement) => {
    activeElement = activeElement.toLowerCase()

    const links = parentLinks.map(parent => Object.keys(parent)[0]);
    const navLinks = document.getElementById('nav-links');
    const sidebar = document.getElementById('sidebar');

    navLinks.innerHTML = '';
    sidebar.innerHTML = '';

    links.forEach(link => {
        const linkElement = document.createElement('a');
        
        const children = parentLinks.find(parent => Object.keys(parent)[0] === link)[link];
        const firstChild = children ? children[0] : '';

        linkElement.href = `/${link.toLowerCase()}/${firstChild.toLowerCase()}`;
        linkElement.dataset.page = firstChild.toLowerCase();
        linkElement.innerText = link;

        if (link.toLowerCase() === activeElement) {
            linkElement.classList.add('active');
        }

        linkElement.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `../../html/${link.toLowerCase()}/${firstChild}.html`;
        });

        navLinks.appendChild(linkElement);
    });

    const activeParent = parentLinks.find(parent => Object.keys(parent)[0].toLowerCase() === activeElement);

    if (activeParent) {
        const children = activeParent[Object.keys(activeParent)[0]];
    
        children.forEach((child, index) => {
            const sidebarLink = document.createElement('a');
            sidebarLink.href = '#';
            sidebarLink.innerText = child.charAt(0).toUpperCase() + child.slice(1);
    
            sidebarLink.onclick = (e) => {
                e.preventDefault();
                window.location.href = `../../html/${activeElement.toLowerCase()}/${child}.html`;
            };
    
            sidebar.appendChild(sidebarLink);
        });
    
        const currentUrl = window.location.pathname;
        const linkUrl = currentUrl.split('/').pop().replace('.html', '');
    
        const allSidebarLinks = sidebar.querySelectorAll('a');
    
        allSidebarLinks.forEach(link => {
            if (link.innerText.toLowerCase() === linkUrl.toLowerCase()) {
                allSidebarLinks.forEach(link => link.classList.remove('active'));
    
                link.classList.add('active');
            }
        });
    }
};