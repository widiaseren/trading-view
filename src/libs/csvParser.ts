// libs/csvParser.ts
import Papa from "papaparse";
import type { StockRow, TickerMeta, csvDataType } from "../types/stock";

export const fetchStockData = async (): Promise<{ metas: TickerMeta[]; rows: StockRow[] }> => {
  // adjust paths if you use different filenames (user said data1 & data2)
  const [metaRes, priceRes] = await Promise.all([
    fetch("/msequity.csv"),
    fetch("/trequity.csv"),
  ]);

  const [metaCsv, priceCsv] = await Promise.all([metaRes.text(), priceRes.text()]);

  const metaParsed = Papa.parse(metaCsv, { header: true, skipEmptyLines: true });
  const priceParsed = Papa.parse(priceCsv, { header: true, skipEmptyLines: true });

  const metas: TickerMeta[] = (metaParsed.data as any[])
    .filter(Boolean)
    .map((r) => ({
      ticker: String(r.portid || "").trim(),
      name: String(r.portname || "").trim(),
      sector: String(r.sector || "").trim(),
      subsector: String(r.subsector || "").trim(),
      listedDate: String(r.listeddate || "").trim(),
    }))
    .filter((m) => !!m.ticker);

  const rows: StockRow[] = (priceParsed.data as csvDataType[])
    .filter(Boolean)
    .map((r) => ({
      date: String(r.portdate || "").slice(0, 10),
      ticker: String(r.portid || "").trim(),
      open: Number(String(r.opening || "0").replace(/,/g, "")) || 0,
      high: Number(String(r.high || "0").replace(/,/g, "")) || 0,
      low: Number(String(r.low || "0").replace(/,/g, "")) || 0,
      close: Number(String(r.closing || "0").replace(/,/g, "")) || 0,
      volume: Number(String(r.volume || "0").replace(/,/g, "")) || 0,
    }))
    .filter((r) => !!r.ticker && !!r.date);

  return { metas, rows };
};
