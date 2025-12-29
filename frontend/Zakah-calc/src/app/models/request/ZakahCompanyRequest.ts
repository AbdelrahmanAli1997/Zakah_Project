export interface ZakahCompanyRecordRequest {
  balance_sheet_date: string; // dd-MM-yyyy

  // Assets
  cashEquivalents: number;
  investment: number;
  inventory: number;
  accountsReceivable: number;

  // Liabilities
  accountsPayable: number;
  accruedExpenses: number;
  shortTermLiability: number;
  yearly_long_term_liabilities: number;

  // Zakah Info
  goldPrice: number;
}
