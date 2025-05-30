const parentLinks = [
    {
        Dashboard: [
            { name: 'overview', subLinks: [] },
            { name: 'upcomingEvents', subLinks: [] },
        ],
    },
    {
        Students: [
            { name: 'overview', subLinks: ['overview'] },
            { name: 'allStudents', subLinks: ['admissions', 'grades'] },
        ],
    },
    {
        Academics: [
            { name: 'overview', subLinks: ['overview'] },
            { name: 'blocks', subLinks: ['blockA', 'blockB'] },
            { name: 'streams', subLinks: ['stream1', 'stream2'] },
            { name: 'classes', subLinks: ['classA', 'classB'] },
            { name: 'year', subLinks: ['2023', '2024'] },
            { name: 'terms', subLinks: ['term1', 'term2'] },
        ],
    },
    {
        Staff: [
            { name: 'overview', subLinks: ['overview'] },
            { name: 'positionManagement', subLinks: ['managers', 'staff'] },
            { name: 'specializedPositions', subLinks: ['specialRoles'] },
            { name: 'employeePayroll', subLinks: ['salaries', 'bonuses'] },
            { name: 'employeeManagement', subLinks: ['contracts', 'reviews'] },
        ],
    },
    {
        Finance: [
            { name: 'overview', subLinks: [] },
            { name: 'accounts', subLinks: ['summary', 'transactions'] },
            { name: 'banking', subLinks: ['deposits', 'withdrawals'] },
            { name: 'banks', subLinks: ['bankA', 'bankB'] },
            { name: 'miscellaneousPayments', subLinks: [] },
            { name: 'payments', subLinks: ['invoices', 'receipts'] },
            { name: 'pocketMoney', subLinks: [] },
            { name: 'studentPayment', subLinks: ['tuition', 'fees'] },
        ],
    },
    {
        Report: [
            { name: 'overview', subLinks: [] },
            { name: 'budget', subLinks: ['allocation', 'usage'] },
            { name: 'financial', subLinks: ['summary', 'details'] },
            { name: 'other', subLinks: ['miscellaneous'] },
        ],
    },
    {
        ExternalData: [
            { name: 'overview', subLinks: [] },
            { name: 'bankStatement', subLinks: ['reconciliations'] },
            { name: 'excelImports', subLinks: ['studentData', 'financeData'] },
            { name: 'syncStudents', subLinks: [] },
        ],
    },
    {
        Fees: [
            { name: 'overview', subLinks: [] },
            { name: 'bursary', subLinks: [] },
            { name: 'feeDiscount', subLinks: ['criteria', 'approval'] },
            { name: 'feeRefund', subLinks: ['policies', 'requests'] },
            { name: 'feeReminder', subLinks: [] },
            { name: 'feeStructure', subLinks: [] },
            { name: 'payFees', subLinks: ['online', 'offline'] },
        ],
    },
    {
        Inventory: [
            { name: 'overview', subLinks: [] },
            { name: 'inventoryProducts', subLinks: ['categories', 'stocks'] },
        ],
    },
    {
        Settings: [
            { name: 'overview', subLinks: [] },
            { name: 'accounts', subLinks: ['userRoles', 'permissions'] },
            { name: 'notifications', subLinks: [] },
            { name: 'preferences', subLinks: ['theme', 'layout'] },
            { name: 'privacy', subLinks: [] },
            { name: 'security', subLinks: ['passwords', 'logs'] },
        ],
    },
];

const formatText = (text) => {
    return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (match) => match.toUpperCase());
};

const renderNavBar = (activeElement) => {
    const navLinks = document.getElementById('nav-links');
    const sidebar = document.getElementById('sidebar');
    navLinks.innerHTML = '';
    sidebar.innerHTML = '';

    activeElement = activeElement.toLowerCase();

    parentLinks.forEach((parent) => {
        const parentName = Object.keys(parent)[0];
        const children = parent[parentName];

        const navLink = document.createElement('a');
        navLink.href = '#';
        navLink.innerText = formatText(parentName);
        navLink.dataset.parent = parentName.toLowerCase();
        navLink.classList.add('parent-link');
        if (parentName.toLowerCase() === activeElement) {
            navLink.classList.add('active');
        }

        navLink.addEventListener('click', (e) => {
            e.preventDefault();
            renderSidebar(parentName.toLowerCase(), children);
        });

        navLinks.appendChild(navLink);
    });

    const activeParent = parentLinks.find((parent) => Object.keys(parent)[0].toLowerCase() === activeElement);
    if (activeParent) {
        renderSidebar(activeElement, activeParent[Object.keys(activeParent)[0]]);
    }
};

const renderSidebar = (parentName, children) => {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    children.forEach((child) => {
        const childLink = document.createElement('a');
        childLink.href = '#';
        childLink.innerText = formatText(child.name);
        childLink.classList.add('child-link');
        childLink.dataset.child = child.name.toLowerCase();

        const subLinksContainer = document.createElement('div');
        subLinksContainer.classList.add('sub-links-container');
        subLinksContainer.style.display = 'none';

        child.subLinks.forEach((subLink) => {
            const subLinkElement = document.createElement('a');
            subLinkElement.href = `../../html/${parentName}/${child.name}/${subLink}.html`;
            subLinkElement.innerText = formatText(subLink);
            subLinkElement.classList.add('sub-link');
            subLinksContainer.appendChild(subLinkElement);
        });

        childLink.addEventListener('click', (e) => {
            e.preventDefault();

            subLinksContainer.style.display =
                subLinksContainer.style.display === 'none' ? 'block' : 'none';
        });

        sidebar.appendChild(childLink);
        sidebar.appendChild(subLinksContainer);
    });
};
