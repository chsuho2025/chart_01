import React from 'react';
import type { ProcessedSong } from '../types';
import ChartItem from './ChartItem';

interface MusicChartProps {
  songs: ProcessedSong[];
  expandedRank: number | null;
  onToggleExpand: (rank: number) => void;
}

const MusicChart: React.FC<MusicChartProps> = ({ songs, expandedRank, onToggleExpand }) => {
  return (
    <div className="space-y-2">
      {songs.map((song) => (
        <ChartItem 
          key={song.rank} 
          song={song}
          isExpanded={expandedRank === song.rank}
          onToggleExpand={() => onToggleExpand(song.rank)}
        />
      ))}
    </div>
  );
};

export default MusicChart;