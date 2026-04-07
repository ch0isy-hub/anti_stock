export type Sector = "IT" | "금융" | "헬스케어" | "에너지" | "소비재" | "산업재" | "기타";

export interface StockRecord {
  id: string;
  symbol: string;
  sector: Sector | string;
  purchaseDate: string;
  purchasePrice: number;
  quantity: number;
  totalAmount: number;
}

export interface PortfolioSummary {
  totalInvestment: number;
  totalStocks: number;
  sectorAllocation: Record<string, number>;
}
