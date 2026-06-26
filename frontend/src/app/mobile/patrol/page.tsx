'use client';

import React, { useState } from 'react';
import { Map, ScanLine, CheckCircle2, ChevronRight, Play, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const mockCheckpoints = [
  { id: '1', name: 'Main Gate', status: 'scanned', time: '10:05 AM' },
  { id: '2', name: 'Perimeter Wall North', status: 'scanned', time: '10:15 AM' },
  { id: '3', name: 'Admin Building', status: 'pending', time: null },
  { id: '4', name: 'Generator House', status: 'pending', time: null },
  { id: '5', name: 'Perimeter Wall South', status: 'pending', time: null },
];

export default function MobilePatrolPage() {
  const [isActive, setIsActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const startPatrol = () => {
    setIsActive(true);
    // In real app: call /patrols/start
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate camera delay
    setTimeout(() => {
      setIsScanning(false);
      alert('Checkpoint Admin Building Scanned Successfully!');
    }, 2000);
  };

  if (!isActive) {
    return (
      <div className="p-4 flex flex-col h-full">
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-foreground">Patrol Routes</h1>
          <p className="text-sm text-muted-foreground mt-1">Select a route to begin your patrol.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-colors shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Map className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Standard Perimeter</h3>
                  <p className="text-xs text-muted-foreground">5 Checkpoints • ~45 mins</p>
                </div>
              </div>
            </div>
            <button 
              onClick={startPatrol}
              className="w-full mt-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 fill-current" /> Start Patrol
            </button>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-4 opacity-75 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <Map className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Night Shift Alpha</h3>
                  <p className="text-xs text-muted-foreground">8 Checkpoints • ~1 hr 20 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-4 mt-2">
        <div>
          <h1 className="text-lg font-bold text-foreground">Standard Perimeter</h1>
          <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Patrol in progress (15m 20s)
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">2<span className="text-sm text-muted-foreground font-normal">/5</span></p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Scanned</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-6">
        <div className="h-full bg-primary w-2/5 rounded-full transition-all duration-500" />
      </div>

      {/* Checkpoints List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {mockCheckpoints.map((cp, idx) => (
          <div key={cp.id} className={cn(
            "p-4 rounded-xl border flex items-center justify-between transition-colors",
            cp.status === 'scanned' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-card border-border",
            cp.id === '3' && "border-primary shadow-[0_0_10px_rgba(139,92,246,0.1)]" // Next up
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                cp.status === 'scanned' ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground text-muted-foreground"
              )}>
                {cp.status === 'scanned' ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <div>
                <p className={cn("text-sm font-semibold", cp.status === 'scanned' ? "text-emerald-500" : "text-foreground")}>
                  {cp.name}
                </p>
                {cp.time && <p className="text-xs text-emerald-500/70">{cp.time}</p>}
                {cp.id === '3' && <p className="text-xs text-primary font-medium mt-0.5">Next Checkpoint</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scanner Button Fixed at Bottom */}
      <div className="pt-4 border-t border-border mt-auto">
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="w-full bg-primary text-primary-foreground h-14 rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg"
        >
          {isScanning ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <ScanLine className="h-6 w-6" /> Scan Next Checkpoint
            </>
          )}
        </button>
      </div>
    </div>
  );
}
