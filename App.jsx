import Header from './components/Header';
import MusicChart from './components/MusicChart';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';

const App = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRank, setExpandedRank] = useState(null);
  
  // 2025년 9월 5일 오전 8시 업데이트 (실제 데이터 기준)
  const lastUpdated = new Date('2025-09-05T08:00:00+09:00');

  const processChartData = (chartData) => {
    return chartData.map(song => {
      let rankChange = 0;
      
      // 급상승 판단 로직
      if (song.spotifyChange > 2000 || song.youtubeChange > 50000) {
        rankChange = 'NEW';
      } else if (song.spotifyChange > 1000 || song.youtubeChange > 20000) {
        rankChange = Math.floor(Math.random() * 5) + 3; // 3-7위 상승 시뮬레이션
      } else {
        rankChange = Math.floor(Math.random() * 5) - 2; // -2~+2 변동
      }
      
      let trendStatus = 'neutral';
      if (song.isHot || rankChange === 'NEW' || rankChange > 3) {
        trendStatus = 'rising';
      } else if (rankChange < -3) {
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
      const chartData = await fetchRealMusicChart();
      const processedData = processChartData(chartData);
      setSongs(processedData);
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);
  
  const handleToggleExpand = (rank) => {
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
      
