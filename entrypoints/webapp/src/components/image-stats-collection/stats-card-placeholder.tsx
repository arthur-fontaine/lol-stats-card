import { useEffect, useState } from 'react';
import statsCardPlaceholderImage from '../../assets/images/stats-card-placeholder.png';

export function StatsCardPlaceholder() {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg relative overflow-hidden">
      <img src={statsCardPlaceholderImage} alt="Stats Card Placeholder" className='w-full animate-pulse' />
      <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
        <svg className="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        Generating<span className='w-0'>{dots}</span>
      </span>
    </div>
  );
}
