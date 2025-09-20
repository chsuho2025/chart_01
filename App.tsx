import React, { useState, useEffect, useCallback } from 'react';
import type { Song, ProcessedSong } from './types';
import { fetchKoreanMusicChart } from './services/geminiService';
import Header from './components/Header';
import MusicChart from './components/MusicChart';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [songs, setSongs] = useState<ProcessedSong[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRank, setExpandedRank] = useState<number | null>(null);
  
  // Hardcoded update time as per user request
  const lastUpdated = new Date('2025-09-20T08:00:00+09:00');

  const processChartData = (chartData: Song[]): ProcessedSong[] => {
    return chartData.map(song => {
      let rankChange: number | 'NEW' = 0;
      if (song.rankHistory && song.rankHistory.length > 1) {
        const todayRank = song.rankHistory[0]?.rank;
        const yesterdayRank = song.rankHistory[1]?.rank;

        if (yesterdayRank === 0 || yesterdayRank > 20) {
          rankChange = 'NEW';
        } else if (todayRank !== undefined && yesterdayRank !== undefined) {
          rankChange = yesterdayRank - todayRank; // Positive is rise, negative is fall
        }
      }
      
      let trendStatus: 'rising' | 'falling' | 'neutral' = 'neutral';
      if (song.isRising) {
        trendStatus = 'rising';
      } else if (typeof rankChange === 'number' && rankChange <= -5) {
        trendStatus = 'falling';
      }

      return { ...song, rankChange, trendStatus };
    });
  };

  const loadChartData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setExpandedRank(null);
    try {
      const chartData = await fetchKoreanMusicChart();
      const processedData = processChartData(chartData as Song[]);
      setSongs(processedData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);
  
  const handleToggleExpand = (rank: number) => {
    setExpandedRank(prevRank => (prevRank === rank ? null : rank));
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <Header lastUpdated={lastUpdated} />
        <main className="mt-8">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadChartData} />
          ) : (
            <MusicChart 
              songs={songs}
              expandedRank={expandedRank}
              onToggleExpand={handleToggleExpand}
            />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;