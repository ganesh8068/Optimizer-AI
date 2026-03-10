import React, { useMemo } from 'react';

interface ContributionGraphProps {
  data: Record<string, number>; // { "YYYY-MM-DD": count }
  year?: number;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({ data, year = new Date().getFullYear() }) => {
  // Generate 365 days of data for the year
  const days = useMemo(() => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const result: { date: string; count: number }[] = [];
    
    // Adjust start date to the first Sunday to align the grid properly (like GitHub)
    const dayOfWeek = startDate.getDay();
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - dayOfWeek);

    for (let d = new Date(firstSunday); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      // Only show actual days of the year, pad the start with empty slots
      if (d < startDate) {
        result.push({ date: "", count: -1 });
      } else {
        result.push({ date: dateStr, count: data[dateStr] || 0 });
      }
    }
    return result;
  }, [data, year]);

  const getColorClass = (count: number) => {
    if (count === -1) return "bg-transparent"; // Padding
    if (count === 0) return "bg-slate-800/40 border border-slate-700/50";
    if (count <= 2) return "bg-emerald-900 border border-emerald-800/50";
    if (count <= 4) return "bg-emerald-700 border border-emerald-600/50";
    if (count <= 6) return "bg-emerald-500 border border-emerald-400/50";
    return "bg-emerald-400 border border-emerald-300/50 drop-shadow-[0_0_2px_rgba(52,211,153,0.5)]";
  };

  const getTooltipContent = (date: string, count: number) => {
    if (!date) return "";
    const formattedDate = new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const problemText = count === 1 ? 'problem' : 'problems';
    return count === 0 ? `No problems on ${formattedDate}` : `${count} ${problemText} on ${formattedDate}`;
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Group days into weeks for column-based rendering
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="w-full pb-2">
      <div className="inline-block w-full">
        <div className="flex text-[10px] font-bold text-slate-500 mb-2 pl-6">
          {months.map((month, i) => (
             <div key={month} style={{ width: 'calc(100% / 12)' }} className="text-left">{month}</div>
          ))}
        </div>
        
        <div className="flex gap-1 xl:gap-1.5 justify-between">
          <div className="flex flex-col gap-1 xl:gap-1.5 text-[9px] font-bold text-slate-500 justify-between pr-2 py-0.5">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          
          <div className="flex gap-1 xl:gap-1.5 flex-1 justify-between">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1 xl:gap-1.5">
                {week.map((day, dayIdx) => (
                  <div 
                    key={`${weekIdx}-${dayIdx}`}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[2px] transition-colors duration-200 group relative ${getColorClass(day.count)}`}
                  >
                    {day.count !== -1 && (
                      <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] whitespace-nowrap rounded z-10 font-medium tracking-wide shadow-xl after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-800">
                        {getTooltipContent(day.date, day.count)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 mt-4 text-[10px] font-bold text-slate-500">
          <span>Less</span>
          <div className="flex gap-1 text-[10px]">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-800/40 border border-slate-700/50"></div>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-900 border border-emerald-800/50"></div>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700 border border-emerald-600/50"></div>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 border border-emerald-400/50"></div>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-300/50 drop-shadow-[0_0_2px_rgba(52,211,153,0.5)]"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
