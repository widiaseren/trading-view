import { useEffect, useRef } from 'react';
import {
  createChart,
  type IChartApi,
  type LineData,
  type CandlestickData,
  CandlestickSeries,
  LineSeries,
} from 'lightweight-charts';

interface ChartProps {
  series: Record<string, LineData[]>;
  ohlcSeries: Record<string, CandlestickData[]>;
  chartType: 'line' | 'candlestick';
  selectedTicker?: string;
  height?: number;
}

export const Chart = ({
  series,
  ohlcSeries,
  chartType,
  selectedTicker,
  height = 320,
}: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up existing chart
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch {
        //ignore
      }
      container.innerHTML = '';
    }

    // Create chart
    const chart = createChart(container, {
      width: container.clientWidth,
      height: height - 30, // leave space for legend
      layout: {
        textColor: '#333',
        background: {
          // type: 'solid',
          color: '#ffffff',
        },
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      rightPriceScale: { borderColor: '#ccc' },
      timeScale: { borderColor: '#ccc', timeVisible: true },
    });

    chartRef.current = chart;

    if (chartType === 'candlestick') {
      if (selectedTicker && ohlcSeries[selectedTicker]?.length) {
        const candle = chart.addSeries(CandlestickSeries, {});
        candle.setData(ohlcSeries[selectedTicker]);
      }
    } else {
      const colors = [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf',
      ];

      const tickers = Object.keys(series);
      tickers.forEach((t, i) => {
        const line = chart.addSeries(LineSeries, {
          color: colors[i % colors.length],
          lineWidth: 2,
          title: t,
        });
        line.setData(series[t]);
      });

      // ✅ Create persistent legend below the chart
      const legendContainer = document.createElement('div');
      legendContainer.style.width = '100%';
      legendContainer.style.display = 'flex';
      legendContainer.style.flexWrap = 'wrap';
      legendContainer.style.justifyContent = 'center';
      legendContainer.style.alignItems = 'center';
      legendContainer.style.gap = '12px';
      legendContainer.style.padding = '8px 0';
      legendContainer.style.fontSize = '13px';
      legendContainer.style.background = '#f9fafb';
      legendContainer.style.borderTop = '1px solid #eee';
      legendContainer.style.marginTop = '4px';

      tickers.forEach((t, i) => {
        const item = document.createElement('div');
        item.innerHTML = `
          <span style="display:inline-block;width:12px;height:12px;background:${
            colors[i % colors.length]
          };margin-right:6px;border-radius:2px;"></span>
          <strong>${t}</strong>`;
        legendContainer.appendChild(item);
      });

      // ✅ append legend *after* chart
      container.appendChild(legendContainer);
      legendRef.current = legendContainer;
    }

    const handleResize = () => {
      if (container && chartRef.current) {
        try {
          chartRef.current.applyOptions({
            width: container.clientWidth,
          });
        } catch {
          //ignore
        }
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      try {
        chartRef.current?.remove();
      } catch {
        //ignore
      }
      chartRef.current = null;

      if (legendRef.current) {
        legendRef.current.remove();
        legendRef.current = null;
      }
    };
  }, [series, ohlcSeries, chartType, selectedTicker, height]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center"
      style={{ minHeight: height }}
    />
  );
};
