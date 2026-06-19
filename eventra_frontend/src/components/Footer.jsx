import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function Footer({ data }) {
  // Graceful fallbacks for brand details
  const brandTitle = data?.brand?.title || "EVENTRA";
  const brandDesc = data?.brand?.description || "Join our event management community for exclusive updates, special offers, and the latest news delivered straight to your inbox.";
  const brandCopyright = data?.brand?.copyright || "© 2026 Eventra Private Limited. All Rights Reserved.";

  // Global contact details
  const globalHeading = data?.contact_global?.heading || "GLOBAL";
  const globalPhone = data?.contact_global?.phone || "+1 (323) 772-8781";
  const globalEmail = data?.contact_global?.email || "hello@eventra.live";

  // Bangladesh contact details
  const bdHeading = data?.contact_bd?.heading || "BANGLADESH";
  const bdPhone = data?.contact_bd?.phone || "+880 1703-916173";
  const bdEmail = data?.contact_bd?.email || "hello@eventrabd.com";

  // Support and Eventra menus
  const supportLinks = data?.support_links && data.support_links.length > 0 
    ? data.support_links 
    : [
        { name: "Help Center / FAQs", url: "#faqs" },
        { name: "Contact Us", url: "#contact" },
        { name: "Terms & Conditions", url: "#terms" },
        { name: "Privacy Policy", url: "#privacy" },
        { name: "Refund Policy", url: "#refund" }
      ];

  const eventraLinks = data?.eventra_links && data.eventra_links.length > 0
    ? data.eventra_links
    : [
        { name: "About Us", url: "#about" },
        { name: "Blog", url: "#blog" },
        { name: "How It Works", url: "#how" },
        { name: "Explore Events", url: "#explore" }
      ];

  return (
    <footer className="bg-[#111827] text-gray-300 font-outfit relative">
      {/* Premium top border (subtle green outline + glowing brand gradient) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/10 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#2E6F40] to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#CFFFDC] to-transparent pointer-events-none"></div>

      {/* Top Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Left Column: Brand, Desc, Contact Info (Span 6) */}
          <div className="col-span-1 md:col-span-6 space-y-6 text-left">
            <div>
              <h2 className="text-3xl font-black tracking-wider font-outfit bg-gradient-to-r from-emerald-400 via-emerald-300 to-[#CFFFDC] bg-clip-text text-transparent">
                {brandTitle}
              </h2>
              <p className="mt-3 text-sm text-gray-400 font-normal leading-relaxed max-w-md">
                {brandDesc}
              </p>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">

              {/* GLOBAL Info */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
                  {globalHeading}
                </p>
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-400">
                  <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <a href={`tel:${globalPhone.replace(/\s+/g, '')}`} className="hover:text-emerald-400 transition-colors">{globalPhone}</a>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-400">
                  <Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <a href={`mailto:${globalEmail}`} className="hover:text-emerald-400 transition-colors">{globalEmail}</a>
                </div>
              </div>

              {/* BANGLADESH Info */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
                  {bdHeading}
                </p>
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-400">
                  <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <a href={`tel:${bdPhone.replace(/\s+/g, '')}`} className="hover:text-emerald-400 transition-colors">{bdPhone}</a>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-400">
                  <Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <a href={`mailto:${bdEmail}`} className="hover:text-emerald-400 transition-colors">{bdEmail}</a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Columns: Support (Span 3) and Eventra Links (Span 3) */}
          <div className="col-span-1 md:col-span-3 text-left">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-gray-800 pb-2.5">
              SUPPORT
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm font-medium">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.url} className="text-gray-400 hover:text-emerald-400 transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Eventra Columns */}
          <div className="col-span-1 md:col-span-3 text-left">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-gray-800 pb-2.5">
              EVENTRA
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm font-medium">
              {eventraLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.url} className="text-gray-400 hover:text-emerald-400 transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright and Social Links Bar */}
      <div className="bg-[#0b0f19] py-8 border-t border-gray-800 text-gray-500 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Social icons (Inline SVGs for compatibility) */}
          <div className="flex items-center space-x-3.5">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-[#111827] text-gray-400 hover:bg-gradient-to-br hover:from-[#2E6F40] hover:to-emerald-500 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center justify-center border border-gray-800 hover:border-emerald-500/50" aria-label="Facebook">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-[#111827] text-gray-400 hover:bg-gradient-to-br hover:from-[#2E6F40] hover:to-emerald-500 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center justify-center border border-gray-800 hover:border-emerald-500/50" aria-label="Twitter">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-[#111827] text-gray-400 hover:bg-gradient-to-br hover:from-[#2E6F40] hover:to-emerald-500 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center justify-center border border-gray-800 hover:border-emerald-500/50" aria-label="Instagram">
              <svg className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-[#111827] text-gray-400 hover:bg-gradient-to-br hover:from-[#2E6F40] hover:to-emerald-500 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center justify-center border border-gray-800 hover:border-emerald-500/50" aria-label="LinkedIn">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>

          {/* Center: Legal quick links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-400">
            <a href="#terms" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#refund" className="hover:text-emerald-400 transition-colors">Return and Refund</a>
          </div>

          {/* Right: Copyright */}
          <div className="text-center md:text-right">
            <p>{brandCopyright}</p>
          </div>

        </div>
      </div>

    </footer>
  );
}
