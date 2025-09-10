# Supabase Setup Instructions

## 1. Database Schema Setup

Run the following SQL commands in your Supabase SQL Editor to create the required tables and sample data:

```sql
-- Create the fraud_reports table
CREATE TABLE IF NOT EXISTS fraud_reports (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  amount_bdt DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_fraud_reports_created_at ON fraud_reports(created_at);

-- Create an index on mobile_number for search functionality
CREATE INDEX IF NOT EXISTS idx_fraud_reports_mobile_number ON fraud_reports(mobile_number);

-- Enable Row Level Security
ALTER TABLE fraud_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for admin dashboard)
CREATE POLICY "Allow public read access to fraud reports" 
ON fraud_reports 
FOR SELECT 
TO anon 
USING (true);

-- Create policy to allow public insert access (for form submissions)
CREATE POLICY "Allow public insert access to fraud reports" 
ON fraud_reports 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_fraud_reports_updated_at 
    BEFORE UPDATE ON fraud_reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO fraud_reports (name, mobile_number, amount_bdt) VALUES
  ('Mohammad Rahman', '01712345678', 50000.00),
  ('Fatima Khatun', '01987654321', 75000.00),
  ('Abdul Karim', '01555666777', 120000.00),
  ('Rashida Begum', '01876543210', 30000.00),
  ('Hasan Ali', '01654321098', 85000.00);
```

## 2. Environment Variables

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=https://dgpxmfuyxxpjlgbbajxj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncHhtZnV5eHhwamxnYmJhanhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDcxMjUsImV4cCI6MjA3MjQyMzEyNX0._6SxmQc-bg4h5DGFFbKfI2EfLKZhQp_FmA7E2ce8Mmk
```

## 3. Admin Access

- **Admin Pin**: ``
- Access the admin dashboard at `/admin`
- Use the pin `` to log in

## 4. Features

### Public Form
- Users can submit fraud reports
- Data is automatically saved to Supabase
- Real-time counter updates

### Admin Dashboard
- View all submitted reports
- Search functionality by name or mobile number
- Export data to CSV
- Real-time statistics

### Data Security
- Row Level Security (RLS) enabled
- Public read access for admin dashboard
- Public insert access for form submissions
- Automatic timestamp updates

## 5. Development

To start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 6. Database Management

You can manage your data through:
- Supabase Dashboard: https://supabase.com/dashboard
- SQL Editor in Supabase Dashboard
- Table Editor for direct data manipulation

## 7. API Endpoints

The application uses Supabase's auto-generated REST API:
- `GET /rest/v1/fraud_reports` - Fetch all reports
- `POST /rest/v1/fraud_reports` - Create new report
- `GET /rest/v1/fraud_reports?select=count` - Get report count
