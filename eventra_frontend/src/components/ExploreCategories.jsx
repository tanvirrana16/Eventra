import React from 'react';
import { ArrowUpRight, Compass, Heart, Dumbbell, Activity, Users } from 'lucide-react';

const categories = [
  {
    title: 'Travel and Outdoor',
    accentColor: 'border-b-4 border-green-600',
    hoverAccent: 'group-hover:text-green-600',
    iconBg: 'bg-green-50 text-green-600',
    icon: Compass,
    description: 'Adventure trails, camping, hiking, and excursions.'
  },
  {
    title: 'Social Activities',
    accentColor: 'border-b-4 border-orange-500',
    hoverAccent: 'group-hover:text-orange-500',
    iconBg: 'bg-orange-50 text-orange-500',
    icon: Users,
    description: 'Meetups, parties, networking, and group discussions.'
  },
  {
    title: 'Hobbies and Passions',
    accentColor: 'border-b-4 border-sky-400',
    hoverAccent: 'group-hover:text-sky-500',
    iconBg: 'bg-sky-50 text-sky-500',
    icon: Heart,
    description: 'Art, crafts, reading, cooking, and creative hobbies.'
  },
  {
    title: 'Sports and Fitness',
    accentColor: 'border-b-4 border-red-500',
    hoverAccent: 'group-hover:text-red-500',
    iconBg: 'bg-red-50 text-red-500',
    icon: Dumbbell,
    description: 'Cardio, team sports, gym sessions, and yoga.'
  },
  {
    title: 'Health and Wellbeing',
    accentColor: 'border-b-4 border-purple-500',
    hoverAccent: 'group-hover:text-purple-500',
    iconBg: 'bg-purple-50 text-purple-500',
    icon: Activity,
    description: 'Mental health, relaxation, wellness, and self-care.'
  }
];

export default function ExploreCategories() {
  return (
    <section id="services" className="py-20 bg-slate-50 font-outfit relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center md:text-left mb-12">
          <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
            What are you interested in?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
            Explore Top Categories
          </h2>
          <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto md:mx-0"></div>
        </div>

        {/* Layout: 5-column grid on desktop, horizontal scroll on mobile */}
        <div className="flex overflow-x-auto pb-4 gap-6 md:grid md:grid-cols-5 md:overflow-x-visible md:pb-0 scrollbar-none snap-x snap-mandatory">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.title}
                className={`flex-none w-64 md:w-auto snap-start bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between aspect-square group cursor-pointer ${category.accentColor}`}
              >

                {/* Top Left: Category Title */}
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2E6F40] transition-colors duration-300 leading-snug">
                    {category.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 font-normal leading-relaxed line-clamp-2 md:block hidden">
                    {category.description}
                  </p>
                </div>

                {/* Bottom section container */}
                <div className="flex items-end justify-between mt-6">
                  {/* Bottom-left: Minimal diagonal arrow */}
                  <div className={`p-2 rounded-full bg-slate-50 text-gray-400 group-hover:bg-[#2E6F40] group-hover:text-white transition-all duration-300 transform group-hover:rotate-45`}>
                    <ArrowUpRight className="h-4.5 w-4.5" />
                  </div>

                  {/* Bottom-right: Modern minimalist illustration / styled icon */}
                  <div className={`p-4 rounded-xl ${category.iconBg} transform group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 stroke-[1.5]" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Premium Divider Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200/80 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#2E6F40]/25 to-transparent pointer-events-none"></div>
    </section>
  );
}
