'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Download, Filter, Calendar } from 'lucide-react';

const monthlyIncidentsData = [
  { month: 'Jan', theft: 4, trespass: 6, assault: 1 },
  { month: 'Feb', theft: 3, trespass: 4, assault: 2 },
  { month: 'Mar', theft: 6, trespass: 8, assault: 0 },
  { month: 'Apr', theft: 2, trespass: 3, assault: 1 },
  { month: 'May', theft: 5, trespass: 7, assault: 3 },
  { month: 'Jun', theft: 1, trespass: 2, assault: 0 },
];

const guardPerformanceData = [
  { week: 'W1', attendance: 95, alertness: 90, compliance: 92 },
  { week: 'W2', attendance: 96, alertness: 91, compliance: 94 },
  { week: 'W3', attendance: 94, alertness: 89, compliance: 91 },
  { week: 'W4', attendance: 97, alertness: 93, compliance: 95 },
];

const siteRiskData = [
  { name: 'Chevron', riskScore: 45, guards: 50, incidents: 4 },
  { name: 'Banana Island', riskScore: 85, guards: 120, incidents: 12 },
  { name: 'Lekki Phase 1', riskScore: 65, guards: 30, incidents: 8 },
  { name: 'VGC', riskScore: 25, guards: 20, incidents: 1 },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Deep dive into operational metrics and performance trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary rounded-lg border border-border px-3 py-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm font-medium text-foreground">Last 6 Months</span>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Download className="h-4 w-4" /> Export PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Trends */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4">Incident Trends by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyIncidentsData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 27.9%, 16.9%)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(224, 71%, 4%)', border: '1px solid hsl(215, 27.9%, 16.9%)', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="theft" name="Theft" stackId="a" fill="#3b82f6" />
              <Bar dataKey="trespass" name="Trespass" stackId="a" fill="#f59e0b" />
              <Bar dataKey="assault" name="Assault" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Guard Performance */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4">Guard Workforce Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={guardPerformanceData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 27.9%, 16.9%)" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(224, 71%, 4%)', border: '1px solid hsl(215, 27.9%, 16.9%)', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="alertness" name="Alertness %" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="compliance" name="Compliance %" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Site Risk Correlation */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-foreground mb-4">Site Risk vs Incident Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={siteRiskData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="guardGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 27.9%, 16.9%)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(224, 71%, 4%)', border: '1px solid hsl(215, 27.9%, 16.9%)', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="riskScore" name="Risk Score (0-100)" stroke="#ef4444" fill="url(#riskGradient)" />
              <Area type="monotone" dataKey="guards" name="Deployed Guards" stroke="#3b82f6" fill="url(#guardGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
