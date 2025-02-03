-- Create Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    size VARCHAR(50) NOT NULL,
    body_color VARCHAR(50) NOT NULL,
    watt DECIMAL(5, 2) NOT NULL,
    lumens INT NOT NULL,
    cct VARCHAR(50) NOT NULL,
    beam_angle VARCHAR(50) NOT NULL,
    input_power VARCHAR(50) NOT NULL,
    driver VARCHAR(50) NOT NULL,
    unit_amount DECIMAL(10, 2) NOT NULL,
    factor DECIMAL(10, 2) NOT NULL,
    cost_omr DECIMAL(10, 3) NOT NULL,
    sale_omr DECIMAL(10, 3) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Purchases Table
CREATE TABLE purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    purchase_price DECIMAL(10, 3) NOT NULL,
    purchase_date DATE NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create Sales Table
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    sale_price DECIMAL(10, 3) NOT NULL,
    sale_date DATE NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create Stock Table
CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    total_purchased INT DEFAULT 0,
    total_sold INT DEFAULT 0,
    available_stock INT DEFAULT 0,
    cost_value DECIMAL(10, 3) DEFAULT 0.000,
    sale_value DECIMAL(10, 3) DEFAULT 0.000,
    FOREIGN KEY (product_id) REFERENCES products(id)
); 