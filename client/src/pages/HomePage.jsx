import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Film,
  Server,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sliders,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import api from '../api/axios';

export const HomePage = () => {
  const [testInput, setTestInput] = useState('');

  // Live health query to verify backend connection
  const { data: health, isLoading, isError, refetch } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const res = await api.get('/health');
      return res.data;
    },
    retry: 1,
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        {/* Subtle background glow circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-300">
              Antigravity Design System Active
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Cinematic Booking Reimagined In{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500">
              Pure Obsidian
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Engineered with modern MERN architecture, atomic concurrency seat locking, dynamic screen canvas designer, and high-performance micro-interactions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/movies">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Movies
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="secondary" size="lg" leftIcon={<Layers className="w-4 h-4" />}>
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Backend & Environment Health Card */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health verification card */}
          <Card hoverable className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-zinc-300" />
                  <CardTitle>API Health Status</CardTitle>
                </div>
                {isLoading ? (
                  <Badge variant="outline" size="sm">Checking...</Badge>
                ) : isError ? (
                  <Badge variant="danger" size="sm">Offline</Badge>
                ) : (
                  <Badge variant="success" size="sm">Operational</Badge>
                )}
              </div>
              <CardDescription>
                Real-time connection verification with Node.js Express backend.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="flex items-center gap-3 py-4 text-zinc-400 text-xs">
                  <Spinner size="sm" />
                  <span>Connecting to backend at /api/v1/health...</span>
                </div>
              ) : isError ? (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Backend Server Offline</span>
                  </div>
                  <p className="text-[11px] text-red-400">
                    Ensure the backend is running (`npm run dev:server`).
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2 text-xs">
                    Retry Connection
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">Service</span>
                    <span className="text-zinc-200 font-mono">{health?.service}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">Version</span>
                    <span className="text-zinc-200 font-mono">v{health?.version}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">Database Engine</span>
                    <span className="text-zinc-200 capitalize font-mono">
                      {health?.database?.state || 'checking'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">Uptime</span>
                    <span className="text-zinc-200 font-mono">{Math.floor(health?.uptime || 0)}s</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Antigravity Design System UI Primitives Showcase */}
          <Card hoverable className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zinc-300" />
                <CardTitle>Design System Primitives</CardTitle>
              </div>
              <CardDescription>
                Verified Antigravity Dark Obsidian UI components built for Phase 1.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Button Variants */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Button Variants
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary Glass</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                  <Button variant="ghost" size="sm">Ghost</Button>
                  <Button variant="danger" size="sm">Danger</Button>
                  <Button variant="glow" size="sm">Glow Accent</Button>
                  <Button variant="primary" size="sm" isLoading>Loading</Button>
                </div>
              </div>

              {/* Badge Variants */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Micro-Badges (Seat Categories & Status)
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="glow">RECLINER</Badge>
                  <Badge variant="default">EXECUTIVE</Badge>
                  <Badge variant="outline">PREMIUM</Badge>
                  <Badge variant="category">NORMAL</Badge>
                  <Badge variant="success">AVAILABLE</Badge>
                  <Badge variant="warning">LOCKED (4:59)</Badge>
                  <Badge variant="danger">BOOKED</Badge>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Interactive Glass Input
                </span>
                <div className="max-w-md">
                  <Input
                    label="Quick Search Preview"
                    placeholder="Type to test metallic border focus..."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    helperText={testInput ? `Active query: "${testInput}"` : 'Input maintains sleek obsidian backdrop blur.'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Architectural Tenets */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Film className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-white">
              Screen vs Seat Architecture
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Physical layouts attach to Screens rather than shows or theatres. Seat capacity is derived dynamically from the active coordinate matrix.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-white">
              5-Minute Atomic Locking
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Seat booking state (AVAILABLE, LOCKED, BOOKED) resides strictly on the Show instance, protected by atomic MongoDB mutations against race conditions.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-white">
              Snapshot Integrity
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Historical bookings preserve immutable ticket data, pricing, and seat labels so future changes never corrupt past customer reservations.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};
