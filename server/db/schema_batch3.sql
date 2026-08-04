-- Expense Rules
CREATE TABLE IF NOT EXISTS expense_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(50) NOT NULL,
    location_type VARCHAR(50) NOT NULL, -- HQ, EX_HQ, OUTSTATION, TRANSIT
    max_da DECIMAL(10, 2) NOT NULL,
    max_ta DECIMAL(10, 2) NOT NULL,
    UNIQUE (role, location_type)
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    location_type VARCHAR(50) NOT NULL,
    ta DECIMAL(10, 2) DEFAULT 0,
    da DECIMAL(10, 2) DEFAULT 0,
    misc DECIMAL(10, 2) DEFAULT 0,
    misc_remarks TEXT,
    total DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    is_high_flag BOOLEAN DEFAULT false,
    manager_id UUID REFERENCES users(id),
    manager_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, date)
);

-- Expense Bills
CREATE TABLE IF NOT EXISTS expense_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Secondary Sales
CREATE TABLE IF NOT EXISTS secondary_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- STOCKIST, RETAILER
    entity_id UUID NOT NULL, -- UUID string
    product_id UUID NOT NULL REFERENCES products(id),
    entry_date DATE NOT NULL,
    quantity INT NOT NULL,
    value DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stock Management
CREATE TABLE IF NOT EXISTS user_stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    month INT NOT NULL,
    year INT NOT NULL,
    opening_stock INT DEFAULT 0,
    closing_stock INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id, month, year)
);

-- Insert some default rules
INSERT INTO expense_rules (role, location_type, max_da, max_ta) VALUES
('MR', 'HQ', 150, 100),
('MR', 'EX_HQ', 250, 200),
('MR', 'OUTSTATION', 400, 300)
ON CONFLICT DO NOTHING;
