import type { StockRow } from "../types/stock";
import type { LineData, CandlestickData } from "lightweight-charts";

export const generateSeries = (rows: StockRow[], tickers: string[]) => {
  const series: Record<string, LineData[]> = {};
  const ohlcSeries: Record<string, CandlestickData[]> = {};

  tickers.forEach((t) => {
    const tickerRows = rows
      .filter((r) => r.ticker === t)
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    series[t] = tickerRows.map((r) => ({ time: r.date, value: r.close }));
    ohlcSeries[t] = tickerRows.map((r) => ({
      time: r.date,
      open: r.open,
      high: r.high,
      low: r.low,
      close: r.close,
    }));
  });

  return { series, ohlcSeries };
};