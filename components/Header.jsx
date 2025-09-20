import React, { useState, useEffect } from 'react';

interface HeaderProps {
  lastUpdated: Date;
}

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전 업데이트';

  const intervals: { [key: string]: number } = {
    년: 31536000,
    달: 2592000,
    일: 86400,
    시간: 3600,
    분: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const count = Math.floor(diffInSeconds / seconds);
    if (count > 0) {
      return `${count}${unit} 전 업데이트`;
    }
  }
  return '방금 전 업데이트';
};


const Header: React.FC<HeaderProps> = ({ lastUpdated }) => {
  const [relativeTime, setRelativeTime] = useState(getRelativeTime(lastUpdated));

  useEffect(() => {
    // Update the relative time every minute
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(lastUpdated));
    }, 60000);

    return () => clearInterval(interval);
  }, [lastUpdated]);


  return (
    <header className="text-left border-b border-gray-800 pb-6">
      <div>
        <h1 className="text-5xl font-black text-white tracking-[0.2em] uppercase">REPUBLIC</h1>
        <p className="text-amber-400 mt-1 font-semibold text-xl tracking-wider">TREND CHART</p>
      </div>
      <p className="text-gray-500 text-xs mt-3">
        {relativeTime} (based on YouTube & Instagram trends)
      </p>
    </header>
  );
};

export default Header;
