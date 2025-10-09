import type { FilterProps } from '../types/stock';

export type HeaderProps = Pick<
  FilterProps,
  'selectedTickers' | 'dateFrom' | 'dateTo'
>;

export const Header = ({ selectedTickers, dateFrom, dateTo }: HeaderProps) => {
  return (
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
  );
};
