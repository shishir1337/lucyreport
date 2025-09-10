-- Apply the update policy to existing Supabase database
-- Run this in your Supabase SQL editor

-- Create policy to allow public update access (for admin editing)
CREATE POLICY "Allow public update access to fraud reports" 
ON fraud_reports 
FOR UPDATE 
TO anon 
USING (true) 
WITH CHECK (true);
