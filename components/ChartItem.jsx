import React from 'react';
import type { ProcessedSong } from '../types';
import RankChart from './RankChart';

interface ChartItemProps {
  song: ProcessedSong;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const RankChangeIndicator: React.FC<{ change: number | 'NEW' }> = ({ change }) => {
  if (change === 'NEW') {
    // Reduced font size and weight for a more subtle appearance, adjusted padding for alignment.
    return <span className="text-[9px] font-normal text-amber-400 tracking-tight px-1">NEW</span>;
  }
  if (change === 0) {
    return <span className="text-xs font-bold text-gray-500">-</span>;
  }
  if (change > 0) {
    // Use yellow for rise, consistent with theme
    return <span className="flex items-center text-xs font-bold text-amber-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>{change}</span>;
  }
  // Use gray for fall
  return <span className="flex items-center text-xs font-bold text-gray-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>{Math.abs(change)}</span>;
};

const TrendRibbon: React.FC<{ status: 'rising' | 'falling' }> = ({ status }) => {
  if (status === 'rising') {
    return (
      <div className="absolute top-0 left-0 text-xs font-bold text-black bg-amber-400 px-2 py-0.5 rounded-br-lg rounded-tl-lg z-10">
        유행중
      </div>
    );
  }
  if (status === 'falling') {
    return (
      <div className="absolute top-0 left-0 text-xs font-bold text-white bg-gray-700 px-2 py-0.5 rounded-br-lg rounded-tl-lg z-10">
        유행지남
      </div>
    );
  }
  return null;
}

const ChartItem: React.FC<ChartItemProps> = ({ song, isExpanded, onToggleExpand }) => {
  const rankColor = song.rank <= 3 ? 'text-amber-400' : 'text-gray-400';
  const rankFontSize = song.rank <= 3 ? 'text-3xl' : 'text-2xl';

  const cardClasses = `
    relative bg-black rounded-lg transition-all duration-300 ease-in-out overflow-hidden border
    ${song.trendStatus === 'rising' ? 'border-amber-400/50 animate-glowing-border' : 'border-gray-900'}
  `;

  return (
    <div className={cardClasses}>
      {song.trendStatus !== 'neutral' && <TrendRibbon status={song.trendStatus} />}
      <div 
        className="flex items-center p-4 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-start w-20">
          <span className={`font-bold ${rankFontSize} ${rankColor} w-8 text-center`}>{song.rank}</span>
          <div className="w-8 flex justify-center">
            <RankChangeIndicator change={song.rankChange} />
          </div>
        </div>
        
        <div className="flex-grow mx-2 overflow-hidden">
          <p className="text-white font-semibold truncate">{song.title}</p>
          <p className="text-gray-400 text-sm truncate">{song.artist}</p>
        </div>
        
        <div className="flex items-center space-x-4 ml-4">
          <button className="text-gray-400 hover:text-white p-2" aria-expanded={isExpanded} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
             <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>

      <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
        <div className={`bg-black/50 p-4 border-t border-gray-800 transition-opacity duration-300 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-300">지난 7일간 순위 변동</h3>
                 <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" title="Watch on YouTube" className="bg-gray-700 hover:bg-gray-600 text-white font-semibold text-xs p-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
            </div>
          <div className="h-40">
            {isExpanded && <RankChart data={song.rankHistory} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartItem;
