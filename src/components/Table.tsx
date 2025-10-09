import type { StockRow, TableProps } from '../types/stock';

export const Table = ({
  toggleSort,
  sortColumn,
  sortAsc,
  filteredRows,
}: TableProps) => {
  return (
    <div className="overflow-x-auto pt-4">
      <table className="table table-compact w-full">
        <thead className="bg-gray-100 text-black">
          <tr>
            {['date', 'ticker', 'open', 'high', 'low', 'close', 'volume'].map(
              (col) => (
                <th
                  key={col}
                  onClick={() => toggleSort(col as keyof StockRow)}
                  className="cursor-pointer select-none"
                >
                  {col.toUpperCase()}
                  {sortColumn === col ? (sortAsc ? ' ▲' : ' ▼') : ''}
                </th>
              )
            )}
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
  );
};
