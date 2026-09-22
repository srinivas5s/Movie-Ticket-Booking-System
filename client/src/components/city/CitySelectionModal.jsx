import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Crosshair,
  X,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

export const CitySelectionModal = () => {
  const {
    isModalOpen,
    closeCityModal,
    selectedCity,
    changeCity,
    availableCities,
    popularCities,
    detectUserLocation,
    isDetectingLocation,
    locationError,
  } = useCity();

  const [searchQuery, setSearchQuery] = useState('');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeCityModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeCityModal]);

  // Filtered cities list based on search
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return availableCities;
    const q = searchQuery.toLowerCase().trim();
    return availableCities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.state && c.state.toLowerCase().includes(q))
    );
  }, [availableCities, searchQuery]);

  // Alphabetically grouped cities for easy browsing
  const groupedCities = useMemo(() => {
    const sorted = [...filteredCities].sort((a, b) => a.name.localeCompare(b.name));
    const groups = {};
    for (const city of sorted) {
      const firstLetter = city.name[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(city);
    }
    return groups;
  }, [filteredCities]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-obsidian-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-white"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-wider text-zinc-300">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              <span>Cinema Network Region</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Select Your Cinema Location
            </h2>
            <p className="text-xs text-zinc-400">
              Filter showtimes, regional releases, and physical screens by city.
            </p>
          </div>

          <button
            onClick={closeCityModal}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Location Error Warning */}
          {locationError && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{locationError}</span>
            </div>
          )}

          {/* Top Actions: Search + Auto Detect */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by city name or state (e.g. Mumbai, Karnataka)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-white/40 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Geolocation Trigger */}
            <Button
              variant="secondary"
              size="md"
              onClick={detectUserLocation}
              isLoading={isDetectingLocation}
              leftIcon={<Crosshair className="w-4 h-4 text-zinc-300" />}
              className="w-full sm:w-auto shrink-0 text-xs"
            >
              Detect My Location
            </Button>
          </div>

          {/* Popular Cities Grid */}
          {!searchQuery && popularCities.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <span>Popular Cinema Metros</span>
                <span className="text-[10px] text-zinc-600 font-normal">Quick Select</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {popularCities.map((city) => {
                  const isSelected = selectedCity?.name?.toLowerCase() === city.name.toLowerCase();
                  return (
                    <button
                      key={city._id || city.name}
                      onClick={() => changeCity(city)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-glow-subtle'
                          : 'bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span className="truncate">{city.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full / Filtered City List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/10 pb-2">
              <span>{searchQuery ? `Search Results (${filteredCities.length})` : 'All Managed Cities'}</span>
            </div>

            {filteredCities.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <MapPin className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">
                  No cinema locations match "<span className="text-white">{searchQuery}</span>".
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedCities).map(([letter, cities]) => (
                  <div key={letter} className="space-y-2">
                    <span className="text-xs font-extrabold text-zinc-500 font-mono">
                      {letter}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cities.map((city) => {
                        const isSelected = selectedCity?.name?.toLowerCase() === city.name.toLowerCase();
                        return (
                          <button
                            key={city._id || city.name}
                            onClick={() => changeCity(city)}
                            className={`text-left px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-white/20 text-white font-semibold border-white/30'
                                : 'bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 hover:text-white border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="truncate">
                              <span className="block font-medium truncate">{city.name}</span>
                              {city.state && (
                                <span className="block text-[10px] text-zinc-500 truncate">
                                  {city.state}
                                </span>
                              )}
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-obsidian-950/60 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Current active region: <strong className="text-zinc-200">{selectedCity?.name}</strong></span>
          <Button variant="ghost" size="sm" onClick={closeCityModal} className="text-xs">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
