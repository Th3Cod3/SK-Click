CREATE TABLE invoices (
	id INT NOT NULL AUTO_INCREMENT,
	invoice_number VARCHAR(15) NOT NULL UNIQUE,
	contact_person INT NULL,
	company_id INT NULL,
	person_id INT NULL,
	invoice_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	invoice_description VARCHAR(1000) NULL,
	invoice_type INT NOT NULL,
	total DECIMAL(11,4),
	open_balance DECIMAL(11,4),
	voided_by INT NULL,
	voided_at TIMESTAMP NULL,
	last_edit_by INT NOT NULL,
	created_by INT NOT NULL,
	deleted_at TIMESTAMP NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);

CREATE TABLE invoice_payments (
	id INT NOT NULL AUTO_INCREMENT,
	invoice_id INT NOT NULL,
	user_id INT NOT NULL,
	payment_amount DECIMAL(11,4),
	payment_nota VARCHAR(1000) NULL,
	payment_methode INT NOT NULL,
	payment_date DATE NOT NULL,
	last_edit_by INT NOT NULL,
	created_by INT NOT NULL,
	deleted_at TIMESTAMP NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);

CREATE TABLE invoice_items (
	id INT NOT NULL AUTO_INCREMENT,
	service_id INT NOT NULL,
	price DECIMAL(11,4) NOT NULL,
	invoice_id INT NOT NULL,
	last_edit_by INT NOT NULL,
	created_by INT NOT NULL,
	deleted_at TIMESTAMP NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);
