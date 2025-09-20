import React, { useEffect, useRef, useState } from 'react';
import type { RankHistory } from '../types';

interface RankChartProps {
  data: RankHistory[];
}

const RankChart: React.FC<RankChartProps> = ({ data = [] }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (pathRef.current && size.width > 0) {
      const pathLength = pathRef.current.getTotalLength();
      pathRef.current.style.setProperty('--path-length', `${pathLength}`);
    }
  }, [data, size]);

  const renderChart = () => {
    if (data.length < 2 || size.width === 0 || size.height === 0) {
      return null;
    }

    const { width, height } = size;
    const chartData = [...data].reverse();

    const padding = { top: 20, right: 20, bottom: 30, left: 30 };
    const accentColor = "#FBBF24";

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const minRank = 1;
    const maxRank = 20;

    const getX = (index: number) => padding.left + (index / (chartData.length - 1)) * chartWidth;
    const getY = (rank: number) => padding.top + ((rank - minRank) / (maxRank - minRank)) * chartHeight;

    const linePath = chartData.reduce((path, point, i) => {
      const isValidRank = point.rank > 0 && point.rank <= 20;
      if (isValidRank) {
        const x = getX(i);
        const y = getY(point.rank);
        const prevPoint = chartData[i - 1];
        const wasPrevPointValid = prevPoint && prevPoint.rank > 0 && prevPoint.rank <= 20;
        const command = wasPrevPointValid ? 'L' : 'M';
        return `${path} ${command} ${x},${y}`;
      }
      return path;
    }, '');
      
    const getFormattedDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" aria-label="Rank history chart">
        <title>지난 7일간 순위 변동</title>
        
        {[1, 5, 10, 15, 20].map(rank => {
          const y = getY(rank);
          return (
              <g key={`y-axis-${rank}`}>
                  <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#374151" strokeWidth="0.5" />
                  <text x={padding.left - 8} y={y + 3} fill="#9CA3AF" fontSize="10" textAnchor="end">
                      {rank}
                  </text>
              </g>
          );
        })}
  
        {chartData.map((point, i) => (
          <text key={`x-axis-${i}`} x={getX(i)} y={height - 10} fill="#9CA3AF" fontSize="10" textAnchor="middle">
            {getFormattedDate(point.date)}
          </text>
        ))}
  
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke={accentColor}
          strokeWidth="2"
          className="[stroke-dasharray:var(--path-length)] [stroke-dashoffset:var(--path-length)] animate-draw-line"
        />
  
        {chartData.map((point, i) => {
          const isValidRank = point.rank > 0 && point.rank <= 20;
          return isValidRank && (
             <circle
              key={`point-${i}`}
              cx={getX(i)}
              cy={getY(point.rank)}
              r="3"
              fill={accentColor}
              stroke="#000000"
              strokeWidth="1.5"
              className="opacity-0 animate-fade-in-point"
              style={{ animationDelay: `${500 + i * 100}ms` }}
             >
               <title>{`${getFormattedDate(point.date)}: ${point.rank}위`}</title>
             </circle>
          )
        })}
      </svg>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      {renderChart()}
    </div>
  );
};

export default RankChart;
