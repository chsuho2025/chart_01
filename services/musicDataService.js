// 실제 kworb.net 데이터를 기반으로 한 트렌드 리퍼블릭 차트
const SPOTIFY_DATA = [
  { rank: 1, streams: 169035, change: 9251, title: "HUNTR/X - Golden", artist: "HUNTR/X" },
  { rank: 2, streams: 67595, change: 2218, title: "Saja Boys - Soda Pop", artist: "Saja Boys" },
  { rank: 3, streams: 66798, change: 2172, title: "IVE - XOXZ", artist: "IVE" },
  { rank: 4, streams: 51871, change: 4467, title: "BLACKPINK - 뛰어", artist: "BLACKPINK" },
  { rank: 5, streams: 46198, change: -353, title: "TREASURE - PARADISE", artist: "TREASURE" },
  { rank: 6, streams: 43709, change: 2460, title: "마크툽(MAKTUB) - 시작의 아이", artist: "마크툽(MAKTUB)" },
  { rank: 7, streams: 41997, change: 908, title: "Saja Boys - Your Idol", artist: "Saja Boys" },
  { rank: 8, streams: 40805, change: 280, title: "ALLDAY PROJECT - FAMOUS", artist: "ALLDAY PROJECT" },
  { rank: 9, streams: 39490, change: -714, title: "WOODZ - Drowning (Live)", artist: "WOODZ" },
  { rank: 10, streams: 39163, change: 44, title: "Don Toliver - Lose My Mind (feat. Doja Cat)", artist: "Don Toliver" },
  { rank: 11, streams: 36940, change: 5279, title: "aespa - Whiplash", artist: "aespa" },
  { rank: 12, streams: 34793, change: 547, title: "HUNTR/X - How It's Done", artist: "HUNTR/X" },
  { rank: 13, streams: 32569, change: 1477, title: "Lim Young-woong - Eternal Moment", artist: "Lim Young-woong" },
  { rank: 14, streams: 32430, change: 2862, title: "Woody - Sadder Than Yesterday", artist: "Woody" },
  { rank: 15, streams: 32257, change: 422, title: "LEE CHANHYUK - 멸종위기사랑", artist: "LEE CHANHYUK" },
  { rank: 16, streams: 31635, change: 2711, title: "aespa - Dirty Work", artist: "aespa" },
  { rank: 17, streams: 30908, change: 961, title: "ZO ZAZZ - 모르시나요", artist: "ZO ZAZZ" },
  { rank: 18, streams: 28339, change: -114, title: "NCT WISH - COLOR", artist: "NCT WISH" },
  { rank: 19, streams: 28143, change: 3350, title: "ALLDAY PROJECT - WICKED", artist: "ALLDAY PROJECT" },
  { rank: 20, streams: 28072, change: 858, title: "ILLIT - 빌려온 고양이 (Do the Dance)", artist: "ILLIT" }
];

const YOUTUBE_DATA = [
  { rank: 1, streams: 2495147, change: 82384 },
  { rank: 2, streams: 1382331, change: 46202 },
  { rank: 3, streams: 981975, change: -94202 },
  { rank: 4, streams: 969696, change: 8334 },
  { rank: 5, streams: 889861, change: 111189 },
  { rank: 6, streams: 883589, change: -4969 },
  { rank: 7, streams: 846951, change: -72966 },
  { rank: 8, streams: 726568, change: -8027 },
  { rank: 9, streams: 719484, change: 9484 },
  { rank: 10, streams: 634251, change: -2604 },
  { rank: 11, streams: 500563, change: 3455 },
  { rank: 12, streams: 497674, change: -8411 },
  { rank: 13, streams: 491133, change: -20831 },
  { rank: 14, streams: 462965, change: -207 },
  { rank: 15, streams: 458929, change: 1837 },
  { rank: 16, streams: 457165, change: 7177 },
  { rank: 17, streams: 409036, change: 11609 },
  { rank: 18, streams: 386318, change: -64651 },
  { rank: 19, streams: 345105, change: -9566 },
  { rank: 20, streams: 336198, change: 0 }
];

// 리퍼블릭 인덱스 계산 함수
function calculateRepublicIndex(spotifyStreams, youtubeStreams, shortsEstimate = 0) {
  const spotifyScore = Math.min((spotifyStreams / 200000) * 100, 100);
  const youtubeScore = Math.min((youtubeStreams / 3000000) * 100, 100);
  
  // Shorts 추정치 (1위=50점, 20위=12점)
  return (spotifyScore * 0.35) + (youtubeScore * 0.45) + (shortsEstimate * 0.20);
}

// 급상승 판단 함수
function isHotSong(spotifyChange, youtubeChange) {
  return spotifyChange > 2000 || youtubeChange > 50000 || 
         (spotifyChange > 1000 && youtubeChange > 20000);
}

// 가짜 순위 히스토리 생성 (7일간)
function generateRankHistory(currentRank) {
  const history = [];
  const today = new Date('2025-09-05');
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    let rank = currentRank;
    if (i > 0) {
      // 과거 순위는 약간의 변동 추가
      rank += Math.floor(Math.random() * 6) - 3; // -3 ~ +3 변동
      rank = Math.max(1, Math.min(25, rank)); // 1-25 범위 유지
    }
    
    history.push({
      date: date.toISOString().split('T')[0],
      rank: rank
    });
  }
  
  return history;
}

// 메인 데이터 수집 함수
export const fetchRealMusicChart = async () => {
  // 실제 API 호출 시뮬레이션 (0.5초 지연)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const chartData = [];
  
  for (let i = 0; i < 20; i++) {
    const spotify = SPOTIFY_DATA[i];
    const youtube = YOUTUBE_DATA[i];
    const shortsEstimate = Math.max(0, 50 - (i * 2)); // Shorts 추정치
    
    const republicIndex = calculateRepublicIndex(
      spotify.streams, 
      youtube.streams, 
      shortsEstimate
    );
    
    const isHot = isHotSong(spotify.change, youtube.change);
    
    chartData.push({
      rank: i + 1,
      title: spotify.title,
      artist: spotify.artist,
      isRising: isHot,
      isHot: isHot,
      republicIndex: republicIndex.toFixed(1),
      spotifyStreams: spotify.streams,
      spotifyChange: spotify.change,
      youtubeStreams: youtube.streams,
      youtubeChange: youtube.change,
      shortsEstimate: shortsEstimate,
      rankHistory: generateRankHistory(i + 1),
      youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(spotify.artist + ' ' + spotify.title.split(' - ')[1] || spotify.title + ' MV')}`
    });
  }
  
  // 리퍼블릭 인덱스 순으로 재정렬
  chartData.sort((a, b) => parseFloat(b.republicIndex) - parseFloat(a.republicIndex));
  
  // 순위 재할당
  chartData.forEach((item, index) => {
    item.rank = index + 1;
  });
  
  return chartData;
};
