CREATE TABLE IF NOT EXISTS global_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Insert default MTP deadline setting
INSERT INTO global_settings (key, value) VALUES ('MTP_SUBMISSION_DEADLINE', '5') ON CONFLICT DO NOTHING;

-- Basic doctors & chemists table (to support MTP validation)
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    class VARCHAR(10) NOT NULL, -- 'A', 'B', 'C'
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS chemists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS mtp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month INT NOT NULL CHECK (month >= 1 AND month <= 12),
    year INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, APPROVED, REJECTED
    submitted_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    rejected_by UUID REFERENCES users(id),
    remarks TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_mtp_user_month_year UNIQUE (user_id, month, year)
);
CREATE INDEX IF NOT EXISTS idx_mtp_user_month_year ON mtp(user_id, month, year);

CREATE TABLE IF NOT EXISTS mtp_daily_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mtp_id UUID NOT NULL REFERENCES mtp(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    location_type VARCHAR(100) NOT NULL,
    doctor_ids UUID[] DEFAULT '{}',
    chemist_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_mtp_daily_plan_date UNIQUE (mtp_id, date)
);
CREATE INDEX IF NOT EXISTS idx_mtp_daily_plan_mtp_id ON mtp_daily_plan(mtp_id);

CREATE TABLE IF NOT EXISTS mtp_approval_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mtp_id UUID NOT NULL REFERENCES mtp(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    acted_by UUID NOT NULL REFERENCES users(id),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
