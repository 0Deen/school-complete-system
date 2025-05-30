
CREATE TABLE `bursaries` (
  `BursaryID` int NOT NULL AUTO_INCREMENT,
  `StudentID` varchar(20) DEFAULT NULL,
  `BursaryAmount` decimal(10,2) DEFAULT NULL,
  `AwardDate` date DEFAULT NULL,
  `BursaryStatus` enum('Active','Expired') DEFAULT 'Active',
  PRIMARY KEY (`BursaryID`),
  KEY `bursaries_ibfk_1` (`StudentID`),
  CONSTRAINT `bursaries_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`)
);

CREATE TABLE `cashbook` (
  `CashbookID` int NOT NULL AUTO_INCREMENT,
  `Date` date DEFAULT NULL,
  `AmountInflow` decimal(10,2) DEFAULT NULL,
  `AmountOutflow` decimal(10,2) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Balance` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`CashbookID`)
);


CREATE TABLE `donations` (
  `DonationID` int NOT NULL AUTO_INCREMENT,
  `DonorName` varchar(100) DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `DonationDate` date DEFAULT NULL,
  `Purpose` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`DonationID`)
);

CREATE TABLE `employee` (
  `EmployeeID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Position` varchar(100) DEFAULT NULL,
  `Salary` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`EmployeeID`)
);
CREATE TABLE `expenditures` (
  `ExpenditureID` int NOT NULL AUTO_INCREMENT,
  `Type` enum('Invoice','Voucher') NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `PaymentStatus` enum('Paid','Unpaid') DEFAULT 'Unpaid',
  PRIMARY KEY (`ExpenditureID`)
);

CREATE TABLE `fees` (
  `FeeID` int NOT NULL AUTO_INCREMENT,
  `StudentID` varchar(20) DEFAULT NULL,
  `Term` varchar(10) DEFAULT NULL,
  `AmountDue` decimal(10,2) NOT NULL,
  `AmountPaid` decimal(10,2) DEFAULT NULL,
  `DueDate` date DEFAULT NULL,
  `PaymentMode` enum('Cash','Bank Transfer','Mobile Payments') NOT NULL,
  `PaymentDate` date DEFAULT NULL,
  `PaymentStatus` enum('Paid','Unpaid') DEFAULT 'Unpaid',
  PRIMARY KEY (`FeeID`),
  KEY `fees_ibfk_1` (`StudentID`),
  CONSTRAINT `fees_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`)
);

CREATE TABLE `ledger` (
  `LedgerID` int NOT NULL AUTO_INCREMENT,
  `AccountType` enum('Income','Expense') NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  PRIMARY KEY (`LedgerID`)
);

CREATE TABLE `payroll` (
  `PayrollID` int NOT NULL AUTO_INCREMENT,
  `EmployeeID` int DEFAULT NULL,
  `Salary` decimal(10,2) DEFAULT NULL,
  `Bonus` decimal(10,2) DEFAULT NULL,
  `Deductions` decimal(10,2) DEFAULT NULL,
  `NetPay` decimal(10,2) DEFAULT NULL,
  `PayDate` date DEFAULT NULL,
  PRIMARY KEY (`PayrollID`),
  KEY `EmployeeID` (`EmployeeID`),
  CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`) ON DELETE CASCADE
);


CREATE TABLE `procurement` (
  `ProcurementID` int NOT NULL AUTO_INCREMENT,
  `SupplierID` int DEFAULT NULL,
  `Item` varchar(100) DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `Status` enum('Ordered','Delivered','Paid') DEFAULT 'Ordered',
  `OrderDate` date DEFAULT NULL,
  `DeliveryDate` date DEFAULT NULL,
  PRIMARY KEY (`ProcurementID`),
  KEY `SupplierID` (`SupplierID`),
  CONSTRAINT `procurement_ibfk_1` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`SupplierID`) ON DELETE CASCADE
);

CREATE TABLE `smslogs` (
  `SMSID` int NOT NULL AUTO_INCREMENT,
  `RecipientPhoneNumber` varchar(15) DEFAULT NULL,
  `MessageContent` text,
  `SentDate` datetime DEFAULT NULL,
  `Status` enum('Sent','Failed') DEFAULT 'Sent',
  PRIMARY KEY (`SMSID`)
);

CREATE TABLE `students` (
  `StudentID` varchar(20) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Class` varchar(20) NOT NULL,
  `ParentPhoneNumber` varchar(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`StudentID`)
);

CREATE TABLE `supplier` (
  `SupplierID` int NOT NULL AUTO_INCREMENT,
  `SupplierName` varchar(100) DEFAULT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`SupplierID`)
);

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','bursar','teacher','accountant','procurement','student','parent') DEFAULT 'student',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
);