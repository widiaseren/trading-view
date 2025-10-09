import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart } from '../components/Chart';
import { fetchStockData } from '../libs/csvParser';
import { generateSeries } from '../utils/series';
import { exportDivToPDF } from '../utils/pdf';
import { filterRows } from '../utils/filter';
import { Filter } from '../components/Filter';
import { Header } from '../components/Header';
import { Table } from '../components/Table';
import type { StockRow, TickerMeta } from '../types/stock';

const Dashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          <Header
            dateFrom={dateFrom}
            dateTo={dateTo}
            selectedTickers={selectedTickers}
          />

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
                  setSelectedTickers([allTickers[0]]);
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
          <Filter
            allTickers={allTickers}
            selectedTickers={selectedTickers}
            setSelectedTickers={setSelectedTickers}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />

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
          <Table
            toggleSort={toggleSort}
            sortColumn={sortColumn}
            sortAsc={sortAsc}
            filteredRows={filteredRows}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
