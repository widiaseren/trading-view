export type StockRow = {
  date: string;
  ticker: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export interface RawMetaRow {
  portid?: string;
  portname?: string;
  sector?: string;
  subsector?: string;
  listeddate?: string;
}

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