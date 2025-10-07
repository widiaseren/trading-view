import type { StockRow } from "../types/stock";

export const filterRows = (
  rows: StockRow[],
  selectedTickers: string[],
  dateFrom?: string,
  dateTo?: string
): StockRow[] => {
  return rows.filter((r) => {
    // --- Filter by ticker ---
    const matchTicker =
      selectedTickers.length === 0 || selectedTickers.includes(r.ticker);

    // --- Filter by date range ---
    const matchFrom = dateFrom ? r.date >= dateFrom : true;
    const matchTo = dateTo ? r.date <= dateTo : true;

    return matchTicker && matchFrom && matchTo;
  });
};