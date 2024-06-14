
CREATE SCHEMA IF NOT EXISTS `travelDB` DEFAULT CHARACTER SET utf8mb3 ;
USE `travelDB` ;

CREATE TABLE IF NOT EXISTS `travelDB`.`Countries`(
	country_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(255),
    commentary VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS `travelDB`.`Cities`(
	city_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255),
    country_id INT NOT NULL,
    commentary VARCHAR(255),
		FOREIGN KEY(country_id)
        REFERENCES Countries(country_id)
);

CREATE TABLE IF NOT EXISTS `travelDB`.`Positions` (
    position_id INT AUTO_INCREMENT PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL,
    position_description VARCHAR(255),
    month_salary INT unsigned
);

-- Создание таблицы для туристических агентств
CREATE TABLE IF NOT EXISTS TravelAgencies (
    agency_id INT AUTO_INCREMENT PRIMARY KEY,
    agency_name VARCHAR(100) NOT NULL,
    agency_city_id INT NOT NULL,
    agency_address VARCHAR(255),
    working_hours VARCHAR(100),
    -- Дополнительные поля для времени работы, если это необходимо
    CONSTRAINT
		FOREIGN KEY(agency_city_id)
        REFERENCES Cities(city_id)
);

-- Создание таблицы для сотрудников
CREATE TABLE IF NOT EXISTS `travelDB`.`Employees` (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    middlename VARCHAR(50),
    salary INT UNSIGNED,
    phone_number int,
    position_id  INT NOT NULL,
    agency_id  INT NOT NULL,
    CONSTRAINT
		FOREIGN KEY (position_id) 
        REFERENCES Positions(position_id),
	CONSTRAINT
		FOREIGN KEY (agency_id) 
        REFERENCES TravelAgencies(agency_id) 
);



CREATE TABLE IF NOT EXISTS `travelDB`.`Discounts` (
    discount_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    discount_percentage DECIMAL(5, 2),
    discount_description VARCHAR(255)
);



CREATE TABLE IF NOT EXISTS `travelDB`.`Clients`(
	client_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    middlename VARCHAR(50),
    age INT UNSIGNED NOT NULL,
    email VARCHAR(50),
    phone_number VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS `travelDB`.`Hotels`(
	hotel_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(50) NOT NULL, 
    hotel_city_id INT NOT NULL, 
    rating DECIMAL(2,1) NOT NULL,
    one_night_price INT UNSIGNED NOT NULL,
    CONSTRAINT
		FOREIGN KEY(hotel_city_id)
        REFERENCES Cities(city_id)
);

CREATE TABLE IF NOT EXISTS `travelDB`.`TravelVoucher` (
	voucher_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL ,
    client_id  INT NOT NULL, 
    days_of_stay INT UNSIGNED NOT NULL,
    departure_date DATE NOT NULL,
    price INT UNSIGNED NOT NULL ,
    CONSTRAINT
		FOREIGN KEY (client_id)
        REFERENCES Clients(client_id),
    CONSTRAINT
		FOREIGN KEY (hotel_id)
        REFERENCES Hotels(hotel_id)
);

CREATE TABLE IF NOT EXISTS `travelDB`.`Sales` (
    sale_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    voucher_id INT NOT NULL,
    sale_date DATE NOT NULL,
    discount_id INT,
    CONSTRAINT
		FOREIGN KEY (voucher_id)
        REFERENCES TravelVoucher(voucher_id),
    CONSTRAINT
		FOREIGN KEY (discount_id)
        REFERENCES Discounts(discount_id)
);


