document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        reportTypeDropdown: document.getElementById('report-type'),
        fetchReportButton: document.getElementById('fetchReport'),
        reportTableHead: document.getElementById('reportTableHead'),
        reportTableBody: document.getElementById('reportTableBody'),
        reportPreview: document.getElementById('report-preview'),
    };

    const reportConfigurations = {
        transaction: {
            headers: ['Transaction Type', 'Transaction Mode','Date', 'Account Name', 'Amount', 'Operation',
                'Account Number','Account Balance','Bank Name','Bank Branch'],
            keys: ['transactionType', 'transactionMode','date','account.accountName', 'amount', 'operation',
                'account.accountNumber','account.balance','account.bank.Name','account.bank.Branch'],
        },
        payroll: {
            headers: ['Employee Full Name', 'Phone','Position', 'Net Salary', 'Payment Date','Payment Method',],
            keys: ['employee.FirstName + " " + employee.LastName', 'employee.Phone', 'employee.specializedPosition.name', 'NetPay', 'PayDate','PaymentMethod'],
        },
        /*
        students: {
            headers: ['Student ID', 'Name', 'Grade', 'Enrolled Date'],
            keys: ['studentId', 'name', 'grade', 'enrolledDate'],
        },
        suppliers: {
            headers: ['Supplier ID', 'Name', 'Contact', 'Address'],
            keys: ['supplierId', 'name', 'contact', 'address'],
        },
        */
    };

    const initReportGeneration = () => {
        elements.fetchReportButton.addEventListener('click', handleFetchReport);
    };

    const handleFetchReport = async () => {
        const reportType = elements.reportTypeDropdown.value;

        try {
            const reportData = await fetchReportData(reportType);
            updateReportPreview(reportData);
        } catch (error) {
            showError(error.message);
        }
    };

    const fetchReportData = async (reportType) => {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/report/generate', { reportType });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch the report');
        }

        const reportData = await response.json();
        console.log(reportData);
        return reportData;
    };

    const updateReportPreview = (data) => {
        clearTable();
    
        if (!data.reportData || data.reportData.length === 0) {
            showEmptyTableMessage();
            return;
        }
    
        const reportType = data.reportType;
        const config = reportConfigurations[reportType];

        if (!config) {
            showError(`No configuration found for report type: ${reportType}`);
            return;
        }

        createTableHeaders(config.headers);
        createTableRows(config.keys, data.reportData);

        elements.reportPreview.style.display = 'block';
    };

    const clearTable = () => {
        elements.reportTableHead.innerHTML = '';
        elements.reportTableBody.innerHTML = '';
    };

    const showEmptyTableMessage = () => {
        elements.reportTableBody.innerHTML = '<tr><td colspan="100%">No data available</td></tr>';
    };

    const createTableHeaders = (headers) => {
        const headerRow = document.createElement('tr');
        headers.forEach((header) => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        elements.reportTableHead.appendChild(headerRow);
    };

    const createTableRows = (keys, data) => {
        data.forEach((row) => {
            const rowElement = document.createElement('tr');
            keys.forEach((key) => {
                const td = document.createElement('td');
    
                if (key.includes('+')) {
                    const keysToConcatenate = key.split('+').map(k => k.trim());
                    td.textContent = keysToConcatenate
                        .map(k => getValueByPath(row, k) || ' ')
                        .join(' ');
                } else {
                    td.textContent = getValueByPath(row, key) || ' ';
                }
    
                rowElement.appendChild(td);
            });
            elements.reportTableBody.appendChild(rowElement);
        });
    };
    

    const showError = (message) => {
        alert(`Error: ${message}`);
    };

    const getValueByPath = (obj, path) => {
        return path.split('.').reduce((acc, key) => acc && acc[key], obj);
    };

    initReportGeneration();
});
