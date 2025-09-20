import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-300 font-semibold">데이터를 불러오는 중입니다...</p>
        <p className="text-gray-500">잠시만 기다려 주세요.</p>
    </div>
  );
};

export default LoadingSpinner;
