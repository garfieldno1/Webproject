DROP DATABASE IF EXISTS sec2_gr3_database;
CREATE DATABASE IF NOT EXISTS `sec2_gr3_database` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `sec2_gr3_database`;

CREATE TABLE users (
  User_id CHAR(8) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  FName NVARCHAR(255),
  LName NVARCHAR(255),
  Email VARCHAR(150),
  Tel VARCHAR(20),
  Gender CHAR(1),
  DateOfBirth DATE,
  LastLogin TIMESTAMP NULL,
  Address VARCHAR(255),
  Role VARCHAR(100) DEFAULT 'User',
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Status VARCHAR(20)
);

INSERT INTO users (User_id, username, password, FName, LName, Email, Tel, Gender, DateOfBirth, LastLogin, Address, Role, Status)
VALUES
('U0000001','Staff1','staffpass','Sompon','Rakdee','admin1@gmail.com','0890000001','M','2005-05-10','2025-10-30 08:00:00','Bangkok','Staff','Active'),
('U0000002','somjai','somjai1234','Somjai','Maidee','somjai@gmail.com','0890000002','F','1995-11-20','2025-10-30 08:00:00','Nan','User','Active'),
('U0000003','somying','somying1234','Somying','Deelerd','somying@gmail.com','0890000003','F','1998-03-05','2025-10-30 08:00:00','Angthong','User','Active');

CREATE TABLE LoginHistory (
  LoginHistory_ID CHAR(8) PRIMARY KEY,
  User_ID CHAR(8) NOT NULL,
  LoginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LogoutTime TIMESTAMP NULL,
  IPAddress VARCHAR(45),
  DeviceInfo VARCHAR(100),
  Status VARCHAR(20),
  FOREIGN KEY (User_ID) REFERENCES users(User_id) ON DELETE CASCADE
);

INSERT INTO LoginHistory (LoginHistory_ID, User_ID, LoginTime, LogoutTime, IPAddress, DeviceInfo, Status)
VALUES
('L0000001','U0000001','2025-10-01 08:00:00','2025-10-01 09:30:00','192.168.1.1','Chrome','Online');


CREATE TABLE Equipment (
  Equipment_ID CHAR(8) PRIMARY KEY, 
  Name VARCHAR(100) NOT NULL,
  Category VARCHAR(100),
  QuantityAvailable INT DEFAULT 0,
  RentalPrice INT,
  Location VARCHAR(255),
  Status VARCHAR(20),
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Equipment (Equipment_ID, Name, Category, QuantityAvailable, RentalPrice, Location, Status)
VALUES
('E0000001','Football','Ball',10,50,'Storage A','Available'),
('E0000002','Badminton Racket','Racket',8,30,'Storage B','Out of Stock'),
('E0000003','Ping Pong Racket','Racket',2,40,'Storage C','Maintenance');

CREATE TABLE EquipmentRental (
  EquipmentRental_ID CHAR(8) PRIMARY KEY,
  Quantity INT NOT NULL,
  RentalStartDateTime DATETIME NOT NULL,
  RentalEndDateTime DATETIME NOT NULL,
  ReturnDateTime DATETIME NULL,
  Status VARCHAR(20) NOT NULL,
  User_ID CHAR(8) NOT NULL,    
  Equipment_ID CHAR(8) NOT NULL,  
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (User_ID) REFERENCES users(User_id) ON DELETE CASCADE,
  FOREIGN KEY (Equipment_ID) REFERENCES Equipment(Equipment_ID) ON DELETE CASCADE
);

INSERT INTO EquipmentRental (EquipmentRental_ID, Quantity, RentalStartDateTime, RentalEndDateTime, ReturnDateTime, Status, User_ID, Equipment_ID)
VALUES
('ER000001','2','2025-09-01 09:00:00','2025-09-01 11:00:00','2025-11-01 11:05:00','Completed','U0000002','E0000002'),
('ER000002','4','2025-09-02 14:00:00','2025-09-02 17:00:00',NULL,'Cancelled','U0000003','E0000001'),
('ER000003','1','2025-10-25 18:00:00','2025-10-25 20:00:00','2025-10-25 20:05:12','In Use','U0000001','E0000003'),
('ER000004','5','2025-10-26 20:00:00','2025-10-26 22:00:00','2025-10-26 22:07:00','Pending','U0000001','E0000003');
CREATE TABLE Facility (
  Facility_ID CHAR(8) PRIMARY KEY,
  Name VARCHAR(100),
  Type VARCHAR(100),
  Description VARCHAR(255),
  Capacity INT,
  OpenTime TIME,
  CloseTime TIME,
  PricePerHour INT,
  Status VARCHAR(20),
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Facility (Facility_ID, Name, Type, Description, Capacity, OpenTime, CloseTime, PricePerHour, Status)
VALUES
('F0000001','Football Field 1','Football','Outdoor grass football field',30,'06:00:00','22:00:00',500,'Available'),
('F0000002','Football Field 2','Football','Outdoor grass football field',30,'06:00:00','22:00:00',500,'In Use'),
('F0000003','Football Field 3','Football','Outdoor grass football field',30,'06:00:00','22:00:00',500,'Closed'),
('F0000004','Badminton Court 1','Badminton','Indoor court with lighting',4,'08:00:00','22:00:00',300,'Available'),
('F0000005','Badminton Court 2','Badminton','Indoor court with lighting',4,'08:00:00','22:00:00',300,'In Use'),
('F0000006','Badminton Court 3','Badminton','Indoor court with lighting',4,'08:00:00','22:00:00',300,'Closed'),
('F0000007','Ping Pong Table 1','Ping Pong','Indoor table',4,'07:00:00','23:00:00',120,'Available'),
('F0000008','Ping Pong Table 2','Ping Pong','Indoor table',4,'07:00:00','23:00:00',120,'In Use'),
('F0000009','Ping Pong Table 3','Ping Pong','Indoor table',4,'07:00:00','23:00:00',120,'Closed');

CREATE TABLE Booking (
  Booking_ID CHAR(8) PRIMARY KEY, 
  BookingDateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  StartDateTime DATETIME NOT NULL,
  EndDateTime DATETIME NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Status VARCHAR(20),
  User_ID CHAR(8) NOT NULL,
  Facility_ID CHAR(8) NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES users(User_id) ON DELETE CASCADE,
  FOREIGN KEY (Facility_ID) REFERENCES Facility(Facility_ID) ON DELETE CASCADE
);

INSERT INTO Booking (Booking_ID, BookingDateTime, StartDateTime, EndDateTime, Status, User_ID, Facility_ID)
VALUES
('B0000001','2025-10-20 09:00:00','2025-10-20 09:30:00','2025-10-20 11:00:00','Completed','U0000002','F0000002'),
('B0000002','2025-10-21 10:00:00','2025-10-21 18:00:00','2025-10-21 20:00:00','In Use','U0000003','F0000003'),
('B0000003','2025-10-22 07:00:00','2025-10-22 07:30:00','2025-10-22 09:00:00','Cancelled','U0000001','F0000001');


CREATE TABLE PaymentEquipmentRental (
  PaymentEquipmentRental_ID CHAR(8) PRIMARY KEY,
  Amount INT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PaymentStatus VARCHAR(20),
  PaymentMethod VARCHAR(100),
  PaymentDate TIMESTAMP,
  EquipmentRental_ID CHAR(8),
  FOREIGN KEY (EquipmentRental_ID) REFERENCES EquipmentRental(EquipmentRental_ID) ON DELETE SET NULL
);

INSERT INTO PaymentEquipmentRental (PaymentEquipmentRental_ID, Amount, CreatedAt, PaymentStatus, PaymentMethod, PaymentDate, EquipmentRental_ID)
VALUES
('PE000001',150,'2025-11-01 11:06:00','Paid','Credit Card','2025-11-01 11:06:00','ER000001'),
('PE000002',200,'2025-10-25 19:55:00','Paid','Wallet','2025-10-25 19:55:00','ER000003');

CREATE TABLE PaymentBooking (
  PaymentBooking_ID CHAR(8) PRIMARY KEY,
  PaymentMethod VARCHAR(100),
  Amount INT,
  PaymentDate TIMESTAMP,
  PaymentStatus VARCHAR(20),
  TransactionReference VARCHAR(50),
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Booking_ID CHAR(8),
  FOREIGN KEY (Booking_ID) REFERENCES Booking(Booking_ID) ON DELETE SET NULL
);

INSERT INTO PaymentBooking (PaymentBooking_ID, PaymentMethod, Amount, PaymentDate, PaymentStatus, TransactionReference, Booking_ID)
VALUES
('PB000001','Credit Card',120,'2025-10-20 09:05:00','Paid','TRX001','B0000001'),
('PB000002','Bank Transfer',300,'2025-10-21 09:10:00','Failed','TRX002','B0000002'),
('PB000003','Bank Transfer',300,'2025-10-21 09:15:00','Paid','TRX003','B0000002');

CREATE TABLE Admin (
  Admin_ID CHAR(8) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  FName NVARCHAR(255),
  LName NVARCHAR(255),
  Email VARCHAR(150),
  Tel VARCHAR(20),
  Gender CHAR(1),
  DateOfBirth DATE,
  LastLogin TIMESTAMP NULL,
  Address VARCHAR(255),
  Role VARCHAR(100) DEFAULT 'Admin',
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Status VARCHAR(20)
);

INSERT INTO Admin (Admin_ID,username, password, FName, LName, Email, Tel, Gender, DateOfBirth, LastLogin, Address, Role, Status)
VALUES
('A0000001','superadmin','superpass','Somchai','DeeMak','admin1@gmail.com','0890000001','M','1985-11-20','2025-10-30 08:00:00','Bangkok','Admin','Active'),
('A0000002','equipmgr','equipm123','Chai','Yo','chai.mgr@gmail.com','0891000002','M','2000-09-17','2025-10-30 08:00:00','Bangkok','Admin','Active'),
('A0000003','facmgr','facm123','Nicha','Nittha','nicha.mgr@gmail.com','0891000003','F','2001-01-02','2025-10-30 08:00:00','Bangkok','Admin','Active');

CREATE TABLE Tournament (
  Tournament_ID CHAR(8) PRIMARY KEY,
  Name NVARCHAR(255),
  SportType VARCHAR(100),
  StartDate DATE,
  EndDate DATE,
  RegistrationDeadline DATE,
  Participants INT,
  Status VARCHAR(20)
);

INSERT INTO Tournament (Tournament_ID, Name, SportType, StartDate, EndDate, RegistrationDeadline, Participants, Status)
VALUES
('T0000001','UCL World Tour','Football','2026-01-10','2026-01-15','2025-12-20',16,'Scheduled'),
('T0000002','Badminton Tournament','Badminton','2025-12-05','2025-12-07','2025-11-20',32,'In Progress'),
('T0000003','Ping Pong League','Ping Pong','2026-02-20','2026-02-24','2026-01-31',8,'Cancelled');

CREATE TABLE Admin_manage_EQ (
  Admin_ID CHAR(8),
  Equipment_ID CHAR(8),
  PRIMARY KEY (Admin_ID, Equipment_ID),
  FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID) ON DELETE CASCADE,
  FOREIGN KEY (Equipment_ID) REFERENCES Equipment(Equipment_ID) ON DELETE CASCADE
);

INSERT INTO Admin_manage_EQ (Admin_ID, Equipment_ID)
VALUES
('A0000002','E0000001'),
('A0000002','E0000002'),
('A0000001','E0000003');

CREATE TABLE Admin_manage_FA (
  Admin_ID CHAR(8),
  Facility_ID CHAR(8),
  PRIMARY KEY (Admin_ID, Facility_ID),
  FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID) ON DELETE CASCADE,
  FOREIGN KEY (Facility_ID) REFERENCES Facility(Facility_ID) ON DELETE CASCADE
);

INSERT INTO Admin_manage_FA (Admin_ID, Facility_ID)
VALUES
('A0000003','F0000001'),
('A0000003','F0000002'),
('A0000001','F0000003');

CREATE TABLE Admin_monitor_LH (
  Admin_ID CHAR(8),
  LoginHistory_ID CHAR(8),
  PRIMARY KEY (Admin_ID, LoginHistory_ID),
  FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID) ON DELETE CASCADE,
  FOREIGN KEY (LoginHistory_ID) REFERENCES LoginHistory(LoginHistory_ID) ON DELETE CASCADE
);

INSERT INTO Admin_monitor_LH (Admin_ID, LoginHistory_ID)
VALUES
('A0000001','L0000001');


CREATE TABLE User_enroll_T (
  User_ID CHAR(8),
  Tournament_ID CHAR(8),
  PRIMARY KEY (User_ID, Tournament_ID),
  FOREIGN KEY (User_ID) REFERENCES users(User_id) ON DELETE CASCADE,
  FOREIGN KEY (Tournament_ID) REFERENCES Tournament(Tournament_ID) ON DELETE CASCADE
);

INSERT INTO User_enroll_T (User_ID, Tournament_ID)
VALUES
('U0000002','T0000002'),
('U0000003','T0000001'),
('U0000001','T0000003');