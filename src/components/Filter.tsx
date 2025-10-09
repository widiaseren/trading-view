import type { FilterProps } from '../types/stock';

export const Filter = ({
  allTickers,
  selectedTickers,
  setSelectedTickers,
  dateTo,
  setDateTo,
  dateFrom,
  setDateFrom,
}: FilterProps) => {
  return (
    <div className="flex flex-wrap justify-between gap-4">
      <div className="flex flex-wrap gap-2 hide-on-export">
        {allTickers.map((ticker) => (
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
  );
};
