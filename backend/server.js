const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const dbinit = require('./db/init');
const systemJob = require('./job/system');

const routesUtils = require('./utils/routesUtils');

const setupRoutes = require('./routes/setupRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const blockRoutes = require('./routes/blockRoutes');
const classRoutes = require('./routes/classRoutes');
const streamRoutes = require('./routes/streamRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const positionRoutes = require('./routes/positionRoutes');
const yearRoutes = require('./routes/yearRoutes');
const termRoutes = require('./routes/termRoutes');
const specializedPositionRoutes = require('./routes/specializedPositionRoutes');
const accountRoutes = require('./routes/accountRoutes');
const bankRoutes = require('./routes/bankRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const voteheadRoutes = require('./routes/voteheadRoutes');
const feeRoutes = require('./routes/feeRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const inventoryCategoryRoutes = require('./routes/inventoryCategoryRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bursaryRoutes = require('./routes/bursaryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const eventsRoutes = require('./routes/eventRoutes');
});
