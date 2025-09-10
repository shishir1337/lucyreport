export interface FraudReport {
  id: number
  name: string
  mobile_number: string
  amount_bdt: number
  created_at: string
  updated_at: string
}

export interface FraudReportInsert {
  name: string
  mobile_number: string
  amount_bdt: number
}

export interface Database {
  public: {
    Tables: {
      fraud_reports: {
        Row: FraudReport
        Insert: FraudReportInsert
        Update: Partial<FraudReportInsert>
      }
    }
  }
}
