import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const CityHeaderWidget = () => {
  const { selectedCity, openCityModal } = useCity();

  return (
    <button
      onClick={openCityModal}
      type="button"
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.04] border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/[0.07] transition-all group"
      title="Change Cinema City"
    >
      <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-white/20 transition-colors">
        <MapPin className="w-3 h-3 text-zinc-300 group-hover:text-white" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider leading-none">
          City
        </span>
        <span className="text-xs font-bold text-white leading-tight">
          {selectedCity?.name || 'Select City'}
        </span>
      </div>
      <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors ml-0.5" />
    </button>
  );
};
