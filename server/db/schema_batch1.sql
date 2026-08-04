-- MASTER DATA EXTENSIONS
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS territory_id UUID;
ALTER TABLE chemists ADD COLUMN IF NOT EXISTS territory_id UUID;

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    type VARCHAR(50) NOT NULL, -- SAMPLE, GIFT, PROMOTIONAL
    is_active BOOLEAN DEFAULT true
);

-- DCR (Daily Call Report)
CREATE TABLE IF NOT EXISTS dcr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, APPROVED
    work_type VARCHAR(100) NOT NULL,
    remarks TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_dcr_user_date UNIQUE (user_id, date)
);
CREATE INDEX IF NOT EXISTS idx_dcr_user_date ON dcr(user_id, date);

CREATE TABLE IF NOT EXISTS dcr_doctor_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dcr_id UUID NOT NULL REFERENCES dcr(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    call_time TIMESTAMP WITH TIME ZONE NOT NULL,
    in_chamber_time INT,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_dcr_doc_calls_dcr_id ON dcr_doctor_calls(dcr_id);

CREATE TABLE IF NOT EXISTS dcr_samples_given (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID NOT NULL REFERENCES dcr_doctor_calls(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LEAVES
CREATE TABLE IF NOT EXISTS leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- CASUAL, SICK, EARNED
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    manager_id UUID REFERENCES users(id),
    manager_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_leaves_user_id ON leaves(user_id);

CREATE TABLE IF NOT EXISTS leave_balances (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    balance DECIMAL(5,2) NOT NULL DEFAULT 0,
    year INT NOT NULL,
    PRIMARY KEY (user_id, type, year)
);
