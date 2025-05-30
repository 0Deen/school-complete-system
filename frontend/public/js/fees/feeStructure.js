document.addEventListener('DOMContentLoaded', () => {
    const populateYearSelect = async () => {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/year/viewAll');
            if (response.ok) {
                const years = await response.json();
                const yearSelect = document.getElementById('year-select');
                yearSelect.innerHTML = '<option value="">Select Year</option>';

                years.forEach(year => {
                    const option = document.createElement('option');
                    option.value = year.id;
                    const startYear = new Date(year.startDate).getFullYear();
                    const endYear = new Date(year.endDate).getFullYear();
                    option.textContent = `${startYear}/${endYear}`;
                    yearSelect.appendChild(option);
                });
            } else {
                console.error('Failed to fetch years.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const generateFeeStructure = async () => {
        const yearId = document.getElementById('year-select').value;
        if (!yearId) {
            alert('Please select a year.');
            return;
        }

        try {
            const response = await fetchRequest(`http://localhost:3000/api/simba-systems/votehead/viewYear`, { yearId });

            if (response.ok) {
                const data = await response.json();
                const pdfContainer = document.getElementById('pdf-container');
                pdfContainer.innerHTML = '';

                const letterHead = document.createElement('div');
                letterHead.className = 'letter-head';
                letterHead.innerHTML = `
                    <div class="letter-head-title">
                        <div id="logo"><img src="../../../public/assets/logo/SIMBA BLACK 2.png" alt="LOGO"></div>
                    </div>
                    <div class="letter-head-details">
                        <div id="address">P.O. Box 12345, City</div>
                        <div class="contact-info">
                            <div class="phone">Phone: +123 456 789</div>
                            <div class="email">Email: info@simbasystems.com</div>
                        </div>
                    </div>
                `;
                pdfContainer.appendChild(letterHead);

                const yearTitle = document.createElement('h3');
                yearTitle.textContent = `Fee Structure for ${data.year.yearName} (${new Date(data.year.startDate).getFullYear()}-${new Date(data.year.endDate).getFullYear()})`;
                pdfContainer.appendChild(yearTitle);

                data.terms.sort((a, b) => a.value - b.value);

                let totalYearAmount = 0;

                data.terms.forEach(term => {
                    const termSection = document.createElement('div');
                    termSection.className = 'term-section';

                    const termTitle = document.createElement('h4');
                    termTitle.textContent = `Term ${term.value}`;
                    termSection.appendChild(termTitle);

                    let totalTermAmount = 0;
                    if (data.voteheads.length === 0) {
                        const noVoteheadsMessage = document.createElement('p');
                        noVoteheadsMessage.textContent = 'No voteheads available for this term.';
                        termSection.appendChild(noVoteheadsMessage);
                    } else {
                        const voteheadTable = document.createElement('table');
                        voteheadTable.className = 'votehead-table';
                        voteheadTable.innerHTML = `
                            <thead>
                                <tr>
                                    <th>Votehead Name</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.voteheads
                                    .filter(votehead => votehead.termId === term.termId)
                                    .map(votehead => {
                                        const amount = parseFloat(votehead.Amount);
                                        totalTermAmount += amount;
                                        return `
                                        <tr>
                                            <td>${votehead.Name}</td>
                                            <td>${amount}</td>
                                        </tr>
                                    `;
                                    })
                                    .join('')}
                            </tbody>
                        `;
                        termSection.appendChild(voteheadTable);
                    }

                    const totalTermElement = document.createElement('p');
                    totalTermElement.classList.add('total-term');

                    const totalLabel = document.createElement('span');
                    totalLabel.classList.add('total-label'); 
                    totalLabel.textContent = `Total`;

                    const totalValue = document.createElement('span');
                    totalValue.classList.add('total-value');
                    totalValue.textContent = totalTermAmount;

                    totalTermElement.appendChild(totalLabel);
                    totalTermElement.appendChild(totalValue);

                    termSection.appendChild(totalTermElement);

                    totalYearAmount += totalTermAmount;

                    pdfContainer.appendChild(termSection);
                });

                const totalYearElement = document.createElement('h4');
                totalYearElement.classList.add('total-year');

                const yearLabel = document.createElement('span');
                yearLabel.classList.add('year-label');
                yearLabel.textContent = 'Year Total';

                const yearValue = document.createElement('span');
                yearValue.classList.add('year-value'); 
                yearValue.textContent = totalYearAmount;

                totalYearElement.appendChild(yearLabel);
                totalYearElement.appendChild(yearValue);

                pdfContainer.appendChild(totalYearElement);


                const footer = document.createElement('div');
                footer.className = 'footer';
                footer.innerHTML = `<div id="gen-date">Generated on: ${new Date().toLocaleDateString()}</div>`;
                pdfContainer.appendChild(footer);
            } else {
                console.error('Failed to fetch fee structure.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    document.getElementById('generateFeeStructureButton').addEventListener('click', function() { 
        generateFeeStructure();
        
        document.getElementById('printFeeStructureButton').style.display = 'inline-block';
    });

    document.getElementById('printFeeStructureButton').addEventListener('click', function () {
        const contentToPrint = document.getElementById('pdf-container').cloneNode(true);
        const printWindow = window.open('', '', 'height=600,width=800');
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../../styles/fees.css';
        
        printWindow.document.write('<html><head><title>Fee Structure</title>');
        printWindow.document.write(link.outerHTML);
        printWindow.document.write('</head><body>');
        printWindow.document.write(contentToPrint.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
    
        printWindow.onload = function () {
            printWindow.print();
        };
    });
    

    populateYearSelect();
});