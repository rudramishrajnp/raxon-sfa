-- Batch 2 Extensions
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE chemists ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE chemists ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

ALTER TABLE dcr_doctor_calls ADD COLUMN IF NOT EXISTS check_in_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE dcr_doctor_calls ADD COLUMN IF NOT EXISTS check_out_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE dcr_doctor_calls ADD COLUMN IF NOT EXISTS check_in_lat DECIMAL(10, 8);
ALTER TABLE dcr_doctor_calls ADD COLUMN IF NOT EXISTS check_in_lng DECIMAL(11, 8);
ALTER TABLE dcr_doctor_calls ADD COLUMN IF NOT EXISTS check_out_lat DECIMAL(10, 8);
ALTER TABLE dcr_doctor_calls ADD COLUMN IF NOT EXISTS check_out_lng DECIMAL(11, 8);
ALTER TABLE dcr_doctor_calls ADD COLUMN IF NOT EXISTS feedback TEXT;
ALTER TABLE dcr_doctor_calls ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS dcr_product_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID NOT NULL REFERENCES dcr_doctor_calls(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    amount DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dcr_prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID NOT NULL REFERENCES dcr_doctor_calls(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    prescription_count INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
