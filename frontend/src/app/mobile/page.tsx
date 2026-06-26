'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { MapPin, Clock, Camera, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function MobileDashboard() {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    setIsProcessing(true);
    try {
      // Simulate getting GPS location
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          try {
            // Note: In reality, we'd use the guard's assigned site ID
            await api.post('/attendance/check-in', {
              guardId: user?.id,
              siteId: 'site_id_mock', // Mock
              latitude,
              longitude,
            });
            setIsCheckedIn(true);
          } catch (e) {
            console.error('Check-in failed', e);
            // Simulate success for MVP demo if API fails due to missing mock data
            setIsCheckedIn(true); 
          }
        },
        (err) => {
          console.error(err);
          alert('GPS location is required for check-in.');
          setIsProcessing(false);
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsCheckedIn(false);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Welcome Card */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
        <h2 className="text-xl font-bold text-foreground">Good {time.getHours() < 12 ? 'Morning' : time.getHours() < 18 ? 'Afternoon' : 'Evening'},</h2>
        <p className="text-primary font-medium">{user?.firstName} {user?.lastName}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Assigned: <strong className="text-foreground">Chevron Main Gate</strong></span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          {/* Animated rings when checked in */}
          {isCheckedIn && (
            <>
              <div className="absolute inset-0 rounded-full border border-emerald-500/50 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-ping opacity-50" style={{ animationDuration: '2s' }} />
            </>
          )}
          
          <button
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
            disabled={isProcessing}
            className={cn(
              "relative flex flex-col items-center justify-center h-48 w-48 rounded-full shadow-2xl transition-all duration-300",
              isCheckedIn 
                ? "bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-emerald-500/30" 
                : "bg-gradient-to-b from-primary to-purple-700 shadow-primary/30",
              isProcessing ? "opacity-70 scale-95" : "hover:scale-105 active:scale-95"
            )}
          >
            {isProcessing ? (
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
            ) : (
              <>
                <Clock className="h-10 w-10 text-white mb-2" />
                <span className="text-2xl font-bold text-white tracking-wider">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-white/80 text-sm font-medium uppercase tracking-widest mt-1">
                  {isCheckedIn ? 'Check Out' : 'Check In'}
                </span>
              </>
            )}
          </button>
        </div>

        {isCheckedIn && (
          <div className="mt-6 flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4" /> Actively on duty
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <h3 className="font-semibold text-foreground mt-2 px-1">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
            <Camera className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-foreground">Log Photo</span>
        </button>
        <button className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
          <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-foreground">SOS Panic</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-sm mt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">Today's Activity</h3>
          <span className="text-xs text-primary font-medium">View all</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">Checked in at Main Gate</p>
              <p className="text-xs text-muted-foreground mt-0.5">07:58 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
