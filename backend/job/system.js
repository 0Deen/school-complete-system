const schedule = require('node-schedule');

const start = () => {
    const checkDates = () => {
        const termEndDate = new Date('2024-12-20');
        const yearEndDate = new Date('2024-12-31');
        const now = new Date();

        if (now >= termEndDate) {
            console.log(`Term end reached: ${termEndDate.toDateString()}`);
            termEnd();
        }

        if (now >= yearEndDate) {
            console.log(`Year end reached: ${yearEndDate.toDateString()}`);
            yearEnd();
        }
    };

    const termEnd = () => {

    };

    const yearEnd = () => {
        
    };

    console.log('System Job started');
    checkDates();

    schedule.scheduleJob('0 0 * * *', () => {
        checkDates();
    });
};

module.exports = { start };