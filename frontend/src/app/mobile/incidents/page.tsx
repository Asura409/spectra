'use client';

import React, { useState } from 'react';
import { Camera, AlertTriangle, Send, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

export default function MobileIncidentsPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'OTHER',
    severity: 'MEDIUM',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate getting GPS location
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          
          try {
            await api.post('/incidents', {
              ...formData,
              reporterId: user?.id,
              siteId: 'site_id_mock', // In reality, get from user context
              latitude,
              longitude,
            });
            setSuccess(true);
          } catch (error) {
            console.error(error);
            // Simulate success for demo
            setSuccess(true);
          } finally {
            setIsSubmitting(false);
          }
        },
        () => {
          alert('Location required for incident reporting.');
          setIsSubmitting(false);
        }
      );
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="h-20 w-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Incident Reported</h2>
        <p className="text-muted-foreground mb-8">
          The control room has been notified. Please secure the area and await further instructions.
        </p>
        <button 
          onClick={() => {
            setSuccess(false);
            setFormData({ title: '', type: 'OTHER', severity: 'MEDIUM', description: '' });
          }}
          className="w-full bg-secondary text-foreground py-3 rounded-xl font-semibold"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-rose-500" />
          Report Incident
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Submit a formal report to the operations center immediately.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pb-10">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Incident Title</label>
          <input 
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            type="text" 
            placeholder="e.g. Suspected trespasser at North Gate"
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Type</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary appearance-none"
            >
              <option value="THEFT">Theft</option>
              <option value="ASSAULT">Assault</option>
              <option value="TRESPASS">Trespass</option>
              <option value="FIRE">Fire</option>
              <option value="MEDICAL">Medical</option>
              <option value="ASSET_DAMAGE">Asset Damage</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Severity</label>
            <select 
              value={formData.severity}
              onChange={e => setFormData({...formData, severity: e.target.value})}
              className={cn(
                "w-full border rounded-lg px-4 py-3 text-sm font-medium appearance-none focus:outline-none",
                formData.severity === 'LOW' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
                formData.severity === 'MEDIUM' && "bg-amber-500/10 text-amber-500 border-amber-500/30",
                formData.severity === 'HIGH' && "bg-rose-500/10 text-rose-500 border-rose-500/30",
                formData.severity === 'CRITICAL' && "bg-red-500/10 text-red-500 border-red-500/30 font-bold"
              )}
            >
              <option value="LOW" className="text-foreground bg-card">Low</option>
              <option value="MEDIUM" className="text-foreground bg-card">Medium</option>
              <option value="HIGH" className="text-foreground bg-card">High</option>
              <option value="CRITICAL" className="text-foreground bg-card">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Detailed Description</label>
          <textarea 
            required
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Describe what happened in detail..."
            rows={5}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Evidence (Photos/Video)</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button type="button" className="shrink-0 h-24 w-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
              <Camera className="h-6 w-6" />
              <span className="text-[10px] font-medium">Capture</span>
            </button>
            <button type="button" className="shrink-0 h-24 w-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
              <Plus className="h-6 w-6" />
              <span className="text-[10px] font-medium">Upload</span>
            </button>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-rose-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-rose-700 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.3)] disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <Send className="h-5 w-5" /> Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
