import React from 'react';
import { Film } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useCity } from '../context/CityContext';

export const MoviesPage = () => {
  const { selectedCity } = useCity();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" size="sm">{selectedCity?.name || 'All Cities'}</Badge>
            <Badge variant="glow" size="sm">Phase 4 / Phase 9 Preview</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Now Showing & Premieres</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse currently running cinematic experiences, showtimes, and book your seats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Interstellar', 'Oppenheimer', 'Dune: Part Two'].map((title, idx) => (
          <Card key={idx} hoverable className="overflow-hidden">
            <div className="h-48 bg-gradient-to-t from-obsidian-900 via-obsidian-800 to-zinc-900 relative flex items-center justify-center border-b border-white/10">
              <Film className="w-12 h-12 text-zinc-700" />
              <Badge variant="glow" size="sm" className="absolute top-3 right-3">IMAX</Badge>
            </div>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>Sci-Fi / Adventure / Drama</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-500">
                Full movie discovery catalogue, showtime filters, and Cloudinary poster integration scheduled for Phase 4 & Phase 9.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
