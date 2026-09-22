import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Shield,
  Film,
  Building2,
  Grid3X3,
  Calendar,
  QrCode,
  TrendingUp,
  MapPin,
  Plus,
  Power,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import api from '../api/axios';

export const AdminDashboardPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('cities'); // 'cities' | 'modules'

  // New city form state
  const [newCityName, setNewCityName] = useState('');
  const [newCityState, setNewCityState] = useState('');
  const [newCityLat, setNewCityLat] = useState('');
  const [newCityLng, setNewCityLng] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Fetch all cities including inactive for administrative control
  const { data: cities = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-cities'],
    queryFn: async () => {
      const res = await api.get('/cities?includeInactive=true');
      return res.data || [];
    },
  });

  // Mutation to add city
  const addCityMutation = useMutation({
    mutationFn: async (payload) => {
      return api.post('/cities', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      queryClient.invalidateQueries({ queryKey: ['managed-cities'] });
      setFormSuccess('New cinema city configured successfully.');
      setNewCityName('');
      setNewCityState('');
      setNewCityLat('');
      setNewCityLng('');
      setIsPopular(false);
      setFormError('');
    },
    onError: (err) => {
      setFormError(err.message || 'Failed to add city.');
    },
  });

  // Mutation to toggle active status
  const toggleCityMutation = useMutation({
    mutationFn: async (cityId) => {
      return api.delete(`/cities/${cityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      queryClient.invalidateQueries({ queryKey: ['managed-cities'] });
    },
  });

  const handleAddCity = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newCityName.trim()) {
      setFormError('City name is required.');
      return;
    }

    addCityMutation.mutate({
      name: newCityName.trim(),
      state: newCityState.trim(),
      isPopular,
      coordinates: {
        lat: parseFloat(newCityLat) || 0,
        lng: parseFloat(newCityLng) || 0,
      },
    });
  };

  const modules = [
    { title: 'City Management', icon: MapPin, phase: 'Phase 3 (Active)', desc: 'Configure regional cinema hubs, GPS coordinates & popularity' },
    { title: 'Movie Management', icon: Film, phase: 'Phase 4', desc: 'CRUD, Cloudinary poster uploads, duration & certificates' },
    { title: 'Theatres & Screens', icon: Building2, phase: 'Phase 5', desc: 'Hierarchy mapping: City -> Theatre -> Screen' },
    { title: 'Visual Seat Designer', icon: Grid3X3, phase: 'Phase 6', desc: 'Interactive grid canvas, drag-to-select, categories' },
    { title: 'Show Scheduling Engine', icon: Calendar, phase: 'Phase 8', desc: 'Conflict detection, showtime overlap check, pricing' },
    { title: 'Ticket QR Verification', icon: QrCode, phase: 'Phase 16', desc: 'Live QR scanner and ticket authentication interface' },
    { title: 'Analytics & Revenue', icon: TrendingUp, phase: 'Phase 16', desc: 'Real-time sales, occupancy ratios, and metrics' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="glow" size="sm">Admin Portal</Badge>
            <Badge variant="outline" size="sm">RBAC Protected</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Operations & Administration</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Comprehensive cinema network control center and administrative infrastructure.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('cities')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'cities' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            City Operations
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'modules' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Modules
          </button>
        </div>
      </div>

      {activeTab === 'cities' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add City Form */}
          <Card className="p-6 lg:col-span-1 h-fit space-y-4">
            <CardHeader className="p-0 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-300" />
                <CardTitle>Add Cinema Market</CardTitle>
              </div>
              <CardDescription>
                Register a new metropolitan region and GPS coordinates for geolocation matching.
              </CardDescription>
            </CardHeader>

            {formSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddCity} className="space-y-3.5">
              <Input
                label="City Name"
                placeholder="e.g. Surat, Lucknow"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                required
              />

              <Input
                label="State / Province"
                placeholder="e.g. Gujarat, Uttar Pradesh"
                value={newCityState}
                onChange={(e) => setNewCityState(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Latitude"
                  type="number"
                  step="any"
                  placeholder="21.1702"
                  value={newCityLat}
                  onChange={(e) => setNewCityLat(e.target.value)}
                />
                <Input
                  label="Longitude"
                  type="number"
                  step="any"
                  placeholder="72.8311"
                  value={newCityLng}
                  onChange={(e) => setNewCityLng(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-300 pt-1">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded bg-white/5 border border-white/10 text-white accent-white cursor-pointer w-3.5 h-3.5"
                />
                <span>Highlight in Popular Cities row</span>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={addCityMutation.isPending}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Cinema City
              </Button>
            </form>
          </Card>

          {/* Managed Cities List */}
          <Card className="p-6 lg:col-span-2 space-y-4">
            <CardHeader className="p-0 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configured Cinema Markets ({cities.length})</CardTitle>
                  <CardDescription>
                    All active and deactivated city locations within the Antigravity network.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-xs">
                  Refresh
                </Button>
              </div>
            </CardHeader>

            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : cities.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs">
                No cities found. Use the form to configure your first cinema city.
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {cities.map((city) => (
                  <div
                    key={city._id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                      city.isActive
                        ? 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        : 'bg-white/[0.01] border-white/5 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{city.name}</span>
                        {city.isPopular && <Badge variant="glow" size="sm">POPULAR</Badge>}
                        {city.isActive ? (
                          <Badge variant="success" size="sm">ACTIVE</Badge>
                        ) : (
                          <Badge variant="outline" size="sm">DISABLED</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                        {city.state && <span>{city.state}</span>}
                        {city.coordinates?.lat !== 0 && (
                          <span className="font-mono">
                            GPS: {city.coordinates?.lat?.toFixed(4)}, {city.coordinates?.lng?.toFixed(4)}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant={city.isActive ? 'ghost' : 'outline'}
                      size="sm"
                      onClick={() => toggleCityMutation.mutate(city._id)}
                      isLoading={toggleCityMutation.isPending && toggleCityMutation.variables === city._id}
                      className={city.isActive ? 'hover:text-red-400' : 'text-emerald-400'}
                      title={city.isActive ? 'Deactivate city' : 'Activate city'}
                    >
                      <Power className="w-3.5 h-3.5 mr-1" />
                      {city.isActive ? 'Deactivate' : 'Enable'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <Card key={index} hoverable className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={mod.phase.includes('Active') ? 'glow' : 'outline'} size="sm">
                    {mod.phase}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">{mod.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{mod.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
