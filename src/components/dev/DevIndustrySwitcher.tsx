import { useState } from 'react';
import { getAllIndustries } from '@/config/industries';
import { setDevIndustryOverride, useIndustryConfig } from '@/hooks/useIndustryConfig';

export function DevIndustrySwitcher() {
  const [collapsed, setCollapsed] = useState(false);
  const currentConfig = useIndustryConfig();
  const industries = getAllIndustries();

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-[9999] bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg hover:bg-yellow-400"
      >
        DEV: {currentConfig.label}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white rounded-lg shadow-2xl border border-yellow-500 p-3 w-56">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-yellow-400">DEV Industry</span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-gray-400 hover:text-white text-xs"
        >
          minimize
        </button>
      </div>
      <div className="space-y-1">
        {industries.map((ind) => (
          <button
            key={ind.slug}
            onClick={() => setDevIndustryOverride(ind.slug)}
            className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
              currentConfig.slug === ind.slug
                ? 'bg-yellow-500 text-black font-semibold'
                : 'hover:bg-gray-700'
            }`}
          >
            {ind.label}
          </button>
        ))}
        <button
          onClick={() => setDevIndustryOverride(null)}
          className="w-full text-left px-2 py-1.5 rounded text-xs text-gray-400 hover:bg-gray-700 mt-1 border-t border-gray-700 pt-2"
        >
          Reset (use tenant default)
        </button>
      </div>
    </div>
  );
}
