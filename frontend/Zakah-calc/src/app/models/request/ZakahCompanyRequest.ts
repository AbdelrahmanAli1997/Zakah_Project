// src/app/models/request/ZakahCompanyRequest.ts
export interface ZakahCompanyRecordRequest {
  balanceSheetDate: string;

  // Assets
  cashEquivalents: number;
  investment: number;
  inventory: number;
  accountsReceivable: number;

  // Liabilities
  accountsPayable: number;
  accruedExpenses: number;
  shortTermLiability: number;
  yearlyLongTermLiabilities: number;

  // Zakah Info
  goldPrice: number;
}
