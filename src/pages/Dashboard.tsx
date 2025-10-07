import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart } from '../components/Chart';
import { fetchStockData } from '../libs/csvParser';
import { generateSeries } from '../utils/series';
import { exportDivToPDF } from '../utils/pdf';
import { filterRows } from '../utils/filter';
import type { StockRow, TickerMeta } from '../types/stock';

const Dashboard = () => {
  const [_, setMetas] = useState<TickerMeta[]>([]);
  const [rows, setRows] = useState<StockRow[]>([]);
  const exportRef = useRef<HTMLDivElement | null>(null);

  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<keyof StockRow>('date');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetchStockData().then(({ metas, rows }) => {
      setMetas(metas);
      setRows(rows);
      if (rows.length) setSelectedTickers([rows[0].ticker]);
    });
  }, []);

  const allTickers = useMemo(
    () => Array.from(new Set(rows.map((r) => r.ticker))).sort(),
    [rows]
  );

  const filteredRows = useMemo(() => {
    const data = filterRows(rows, selectedTickers, dateFrom, dateTo);
    return data.sort((a, b) =>
      sortAsc
        ? a[sortColumn] > b[sortColumn]
          ? 1
          : -1
        : a[sortColumn] < b[sortColumn]
        ? 1
        : -1
    );
  }, [rows, selectedTickers, dateFrom, dateTo, sortColumn, sortAsc]);

  const { series, ohlcSeries } = useMemo(
    () =>
      generateSeries(
        filteredRows,
        selectedTickers.length ? selectedTickers : allTickers
      ),
    [filteredRows, allTickers, selectedTickers]
  );

  const toggleSort = (col: keyof StockRow) => {
    if (sortColumn === col) setSortAsc(!sortAsc);
    else {
      setSortColumn(col);
      setSortAsc(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card shadow-md border border-gray-300" ref={exportRef}>
        <div className="card-body space-y-4">
          {/* HEADER */}
          <div className="text-center border-b pb-2">
            <h2 className="text-2xl font-bold">📈 Stock Dashboard</h2>
            <p className="text-sm text-gray-500">
              Generated on: {new Date().toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Active Filters:{' '}
              {selectedTickers.length > 0
                ? selectedTickers.join(', ')
                : 'All tickers'}
              {dateFrom && ` | From: ${dateFrom}`}
              {dateTo && ` | To: ${dateTo}`}
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 hide-on-export">
            <label className="flex items-center gap-2">
              <span>Candlestick</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={chartType === 'candlestick'}
                onChange={() => {
                  setChartType(chartType === 'line' ? 'candlestick' : 'line');
                  if (chartType === 'line') {
                    setSelectedTickers([]);
                  }
                }}
              />
            </label>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                exportDivToPDF(
                  exportRef.current,
                  `stock-dashboard-${new Date().toISOString().slice(0, 10)}.pdf`
                )
              }
            >
              Export PDF
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-wrap gap-2 hide-on-export">
              {chartType === 'line' &&
                allTickers.map((ticker) => (
                  <label key={ticker} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={selectedTickers.includes(ticker)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedTickers([...selectedTickers, ticker]);
                        else
                          setSelectedTickers(
                            selectedTickers.filter((t) => t !== ticker)
                          );
                      }}
                    />
                    {ticker}
                  </label>
                ))}
            </div>

            <div className="flex gap-4 hide-on-export">
              <div className="flex flex-col">
                <label className="label-text text-sm">Start Date</label>
                <input
                  type="date"
                  className="input input-bordered input-sm w-36"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="label-text text-sm">End Date</label>
                <input
                  type="date"
                  className="input input-bordered input-sm w-36"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="pt-4 mb-8">
            {' '}
            <Chart
              series={series}
              ohlcSeries={ohlcSeries}
              chartType={chartType}
              selectedTicker={selectedTickers[0] || allTickers[0]}
              height={340}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto pt-4">
            <table className="table table-compact w-full">
              <thead className="bg-gray-100 text-black">
                <tr>
                  {[
                    'date',
                    'ticker',
                    'open',
                    'high',
                    'low',
                    'close',
                    'volume',
                  ].map((col) => (
                    <th
                      key={col}
                      onClick={() => toggleSort(col as keyof StockRow)}
                      className="cursor-pointer select-none"
                    >
                      {col.toUpperCase()}
                      {sortColumn === col ? (sortAsc ? ' ▲' : ' ▼') : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No data for selected filters
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((r, i) => (
                    <tr key={`${r.ticker}-${r.date}-${i}`}>
                      <td>{r.date}</td>
                      <td>{r.ticker}</td>
                      <td>{r.open.toFixed(2)}</td>
                      <td>{r.high.toFixed(2)}</td>
                      <td>{r.low.toFixed(2)}</td>
                      <td>{r.close.toFixed(2)}</td>
                      <td>{r.volume.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
