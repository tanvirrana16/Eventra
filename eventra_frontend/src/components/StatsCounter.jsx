import React, { useState, useEffect } from 'react';
import { Calendar, Users, ShieldCheck, Award } from 'lucide-react';

const statsData = [
  {
    target: 200,
    suffix: '+',
    label: 'TOTAL EVENTS',
    icon: Calendar,
    gradient: 'from-[#2563EB] to-[#3B82F6]',
    glowColor: 'hover:shadow-blue-500/10',
    borderColor: 'hover:border-blue-500/10',
    iconBg: 'bg-blue-50 text-blue-600',
    labelColor: 'group-hover:text-blue-600',
    cornerGradient: 'from-blue-400 to-transparent',
    borderGlow: 'group-hover:border-blue-500/30'
  },
  {
    target: 15400,
    suffix: '+',
    label: 'PARTICIPANTS',
    icon: Users,
    gradient: 'from-[#2E6F40] to-emerald-500',
    glowColor: 'hover:shadow-emerald-500/10',
    borderColor: 'hover:border-emerald-500/10',
    iconBg: 'bg-emerald-50 text-emerald-600',
    labelColor: 'group-hover:text-emerald-700',
    cornerGradient: 'from-emerald-400 to-transparent',
    borderGlow: 'group-hover:border-emerald-500/30'
  },
  {
    target: 85,
    suffix: '+',
    label: 'ORGANIZERS',
    icon: ShieldCheck,
    gradient: 'from-[#D97706] to-[#F59E0B]',
    glowColor: 'hover:shadow-amber-500/10',
    borderColor: 'hover:border-amber-500/10',
    iconBg: 'bg-amber-50 text-amber-600',
    labelColor: 'group-hover:text-amber-600',
    cornerGradient: 'from-amber-400 to-transparent',
    borderGlow: 'group-hover:border-amber-500/30'
  },
  {
    target: 12800,
    suffix: '+',
    label: 'CERTIFICATES Issued',
    icon: Award,
    gradient: 'from-[#7C3AED] to-[#EC4899]',
    glowColor: 'hover:shadow-purple-500/10',
    borderColor: 'hover:border-purple-500/10',
    iconBg: 'bg-purple-50 text-purple-600',
    labelColor: 'group-hover:text-purple-600',
    cornerGradient: 'from-purple-400 to-transparent',
    borderGlow: 'group-hover:border-purple-500/30'
  }
];

function SingleStat({ 
  target, 
  suffix, 
  label, 
  icon: Icon, 
  gradient, 
  iconBg, 
  glowColor, 
  borderColor, 
  labelColor, 
  cornerGradient, 
  borderGlow 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    
    let start = 0;
    const duration = 2200; // 2.2 seconds (smooth medium speed)
    const frameRate = 20; // 20ms per frame (50 FPS)
    const totalSteps = duration / frameRate;
    const increment = target / totalSteps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className={`group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1.5 flex flex-col justify-between items-center text-center overflow-hidden cursor-pointer ${borderColor} ${glowColor}`}>
      
      {/* Animated corner borders */}
      <div className={`absolute top-0 left-0 w-8 h-[1.5px] bg-gradient-to-r ${cornerGradient} transition-all group-hover:w-16 duration-700 z-30`}></div>
      <div className={`absolute top-0 left-0 w-[1.5px] h-8 bg-gradient-to-b ${cornerGradient} transition-all group-hover:h-16 duration-700 z-30`}></div>
      
      <div className={`absolute bottom-0 right-0 w-8 h-[1.5px] bg-gradient-to-l ${cornerGradient} transition-all group-hover:w-16 duration-700 z-30`}></div>
      <div className={`absolute bottom-0 right-0 w-[1.5px] h-8 bg-gradient-to-t ${cornerGradient} transition-all group-hover:h-16 duration-700 z-30`}></div>

      {/* Glowing border outline */}
      <div className={`absolute inset-0 rounded-2xl border border-transparent pointer-events-none z-30 transition-all duration-700 ${borderGlow}`}></div>

      {/* Interactive Background Gradient highlight on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/10 via-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Top right floating background indicator for abstract depth */}
      <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-slate-50/50 opacity-40 group-hover:bg-emerald-500/5 group-hover:scale-150 transition-all duration-700 pointer-events-none"></div>

      {/* Styled Top Icon */}
      <div className={`p-3 rounded-xl ${iconBg} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xs`}>
        <Icon className="h-5.5 w-5.5 stroke-[1.8]" />
      </div>

      {/* Center Count */}
      <div className="mt-4 flex flex-col items-center">
        <span className={`text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r ${gradient} bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300`}>
          {target === 0 ? '0' : count.toLocaleString()}{suffix}
        </span>
        
        {/* Label */}
        <span className={`text-xxs sm:text-xs font-black text-gray-400 tracking-widest mt-2.5 uppercase leading-none transition-colors duration-300 ${labelColor}`}>
          {label}
        </span>
      </div>

      {/* Subtle indicator bar at the bottom of the card */}
      <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${gradient} group-hover:w-full transition-all duration-500`}></div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section id="about" className="py-16 bg-white font-outfit relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid layout for individual card items */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {statsData.map((stat) => (
            <SingleStat 
              key={stat.label}
              target={stat.target} 
              suffix={stat.suffix} 
              label={stat.label} 
              icon={stat.icon}
              gradient={stat.gradient}
              iconBg={stat.iconBg}
              glowColor={stat.glowColor}
              borderColor={stat.borderColor}
            />
          ))}
        </div>

      </div>

      {/* Premium Divider Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200/80 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#2E6F40]/25 to-transparent pointer-events-none"></div>
    </section>
  );
}
