import { ZakahStatus } from '../enums/ZakahStatus';

export interface ZakahIndividualRecordResponse {

  nisabAmount: string | number;
  
  id: number;
  status: ZakahStatus;

  // Individual Assets
  cash: number;
  gold: number;
  silver: number;
  stocks: number;
  bonds: number;

  // Zakah Info
  goldPrice: number;
  // Main Info
  totalAssets: number;
  zakahAmount: number;
  calculationDate: string;
}

export interface ZakahIndividualRecordSummaryResponse {
  balanceSheetDate: string | number | Date;
  id: number;
  status: ZakahStatus;
  zakahAmount: number;
  calculationDate: string;
}
