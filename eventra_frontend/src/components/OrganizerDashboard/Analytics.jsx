import { 
  Users, 
  Percent 
} from 'lucide-react';

export default function Analytics({ analyticsData }) {
  const seatUtilization = analyticsData?.seat_utilization || 72.5;
  const attendanceRate = analyticsData?.attendance_rate || 84.2;

  const popularCategories = analyticsData?.popular_categories || [
    { name: 'Concert', value: 4 },
    { name: 'Workshops', value: 3 },
    { name: 'Seminars', value: 2 },
    { name: 'Festivals', value: 1 },
  ];

  const trafficSources = analyticsData?.traffic_sources || [
    { name: 'Search Engines', value: 35 },
    { name: 'Social Media', value: 45 },
    { name: 'Email Campaign', value: 12 },
    { name: 'Direct Traffic', value: 8 },
  ];

  const eventComparison = analyticsData?.event_comparison || [
    { name: 'Tech Summit', revenue: 2400 },
    { name: 'UX Bootcamp', revenue: 1800 },
    { name: 'Music Fest', revenue: 3200 },
    { name: 'Web Seminar', revenue: 950 },
    { name: 'Art Showcase', revenue: 1500 },
  ];

  // Render SVG Gauge
  const renderGauge = (value, color) => {
    const radius = 50;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute top-11 text-base font-black text-slate-800">{value}%</span>
      </div>
    );
  };

  // Render Donut Chart
  const renderDonutChart = () => {
    const radius = 40;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;

    const colors = ['#2E6F40', '#0C3B2E', '#F59E0B', '#3B82F6', '#8B5CF6'];

    return (
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg width="120" height="120" className="transform -rotate-90">
            {trafficSources.map((source, idx) => {
              const strokeOffset = circumference - (source.value / 100) * circumference;
              const dashArray = `${circumference}`;
              const dashOffset = strokeOffset;
              const rotation = (accumulatedAngle / 100) * 360;
              accumulatedAngle += source.value;

              return (
                <circle
                  key={idx}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={colors[idx % colors.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(${rotation} 60 60)`}
                  className="transition-all duration-500 hover:stroke-[15px] cursor-pointer"
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Traffic</span>
            <span className="text-sm font-black text-slate-800">100%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 gap-2.5 text-xs font-bold text-slate-600">
          {trafficSources.map((source, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
              <span>{source.name}: {source.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Horizontal Bar Chart for Event Revenue Comparison
  const renderBarChart = () => {
    const maxVal = Math.max(...eventComparison.map(d => d.revenue), 1000);

    return (
      <div className="space-y-4">
        {eventComparison.map((d, idx) => {
          const percentage = (d.revenue / maxVal) * 100;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">{d.name}</span>
                <span className="text-slate-800">${d.revenue}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${percentage}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#2E6F40] rounded-full transition-all duration-1000"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 font-outfit text-left animate-fade-in select-none">
      
      {/* ── Gauges Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Seat Utilization Gauge */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
          <div className="space-y-3 text-center sm:text-left">
            <div className="p-2.5 bg-emerald-50 text-[#2E6F40] rounded-xl w-fit mx-auto sm:mx-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Seat Booking Rate</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[200px] mt-0.5">
                Ratio of total registrations compared to the total seats available across events.
              </p>
            </div>
          </div>
          {renderGauge(seatUtilization, '#2E6F40')}
        </div>

        {/* Attendance Check-in Gauge */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
          <div className="space-y-3 text-center sm:text-left">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit mx-auto sm:mx-0">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Checked-in Attendee Rate</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[200px] mt-0.5">
                Ratio of verified attendee check-ins compared to total bookings.
              </p>
            </div>
          </div>
          {renderGauge(attendanceRate, '#2563EB')}
        </div>

      </div>

      {/* ── Lower section grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Bar Chart Comparison (7/12 width) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-md p-6">
          <div className="pb-5 border-b border-slate-50">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Event Revenue Comparison</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Earnings across top performing event programs.</p>
          </div>
          <div className="mt-6">
            {renderBarChart()}
          </div>
        </div>

        {/* Right: Donut Chart Traffic Sources (5/12 width) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col justify-between">
          <div className="pb-5 border-b border-slate-50 text-left">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Traffic Acquisition Sources</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Referral clicks on hosted event details pages.</p>
          </div>
          <div className="my-auto py-6 sm:py-0">
            {renderDonutChart()}
          </div>
        </div>

      </div>

      {/* ── Popular Categories and Statistics Row ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8">
        <div className="pb-5 border-b border-slate-100">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Category Distribution</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Overview of event volumes grouped by program category classification.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {popularCategories.map((cat, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">{cat.name}</span>
              <span className="text-xl font-black text-slate-800 block">{cat.value} Events</span>
              <span className="text-[9px] text-[#2E6F40] font-black uppercase tracking-wider block">Hosted Portal</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
