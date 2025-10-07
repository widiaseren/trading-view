export type StockRow = {
  date: string; // YYYY-MM-DD
  ticker: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type TickerMeta = {
  ticker: string;
  name?: string;
  sector?: string;
  subsector?: string;
  listedDate?: string;
};

export type csvDataType = {
  portdate?: string;
  portid?: string;
  opening?: string;
  high?: string;
  low?: string;
  closing?: string;
  volume?: string;
  portname?: string;
  sector?: string;
  subsector?: string;
  listeddate?: string;
};