export type Persona = 'individual' | 'company';

export interface ZakahFormData {
  // Account Details
  balanceSheetDate: string;
  persona: Persona;

  // Assets (النقد يشمل النقد + الذهب)
  cash: number;              // النقد + قيمة الذهب
  stocks: number;
  inventory: number;
  receivables: number;

  // Liabilities
  accountPayable: number;
  expenses: number;
  shortTermLoans: number;
  longTermDebt: number;

  // Gold info (فقط للمعلومات)
  goldWeightInGrams: number;  // وزن الذهب بالجرام (من Excel)
  goldPricePerGram: number;   // سعر الجرام اليومي (يدخله المستخدم فقط للمعلومة)

  // Calculated values
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  zakahAmount: number;
}
