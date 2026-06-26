'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/providers/AuthProvider';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  MapPin,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Activity,
  Shield,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for dashboard
const statsCards = [
  { label: 'Total Guards', value: '250', change: '+12', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Active On-Duty', value: '214', change: '+3', icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Late Check-Ins', value: '12', change: '-2', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Absent Today', value: '8', change: '+1', icon: UserX, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { label: 'Sites Online', value: '18', change: '0', icon: MapPin, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { label: 'Open Incidents', value: '3', change: '-1', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { label: 'High Risk Sites', value: '2', change: '0', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  { label: 'Attendance %', value: '96.2%', change: '+0.5%', icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-500/10' },
];

const attendanceTrend = [
  { day: 'Mon', rate: 94 },
  { day: 'Tue', rate: 96 },
  { day: 'Wed', rate: 97 },
  { day: 'Thu', rate: 95 },
  { day: 'Fri', rate: 93 },
  { day: 'Sat', rate: 98 },
  { day: 'Sun', rate: 96 },
];

const incidentsByType = [
  { type: 'Theft', count: 5 },
  { type: 'Trespass', count: 8 },
  { type: 'Assault', count: 2 },
  { type: 'Fire', count: 1 },
  { type: 'Medical', count: 3 },
  { type: 'Asset Damage', count: 4 },
];

const siteDistribution = [
  { name: 'Low Risk', value: 10, color: '#22c55e' },
  { name: 'Medium Risk', value: 5, color: '#f59e0b' },
  { name: 'High Risk', value: 2, color: '#ef4444' },
  { name: 'Critical', value: 1, color: '#dc2626' },
];

const recentActivities = [
  { time: '2 min ago', text: 'Guard Adamu checked in at Chevron Estate', type: 'attendance' },
  { time: '15 min ago', text: 'Incident reported: Trespass at Lekki Phase 1', type: 'incident' },
  { time: '32 min ago', text: 'Patrol completed: VGC Route Alpha', type: 'patrol' },
  { time: '1 hr ago', text: 'Guard Ibrahim transferred to Banana Island', type: 'transfer' },
  { time: '2 hrs ago', text: 'New client onboarded: Pinnacle Estates', type: 'client' },
  { time: '3 hrs ago', text: 'Late arrival: Guard Musa at Ikoyi Office', type: 'late' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Operations Command Center</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back, {user?.firstName}. Here is your real-time operational overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
              </div>
              <span className={`text-xs font-medium ${
                card.change.startsWith('+') && card.label !== 'Absent Today' && card.label !== 'Late Check-Ins'
                  ? 'text-emerald-400'
                  : card.change.startsWith('-')
                  ? card.label === 'Late Check-Ins' || card.label === 'Open Incidents' ? 'text-emerald-400' : 'text-rose-400'
                  : 'text-muted-foreground'
              }`}>
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Weekly Attendance Rate</h3>
              <p className="text-xs text-muted-foreground">7-day performance overview</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <TrendingUp className="h-3 w-3" /> 96.2% avg
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 27.9%, 16.9%)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[85, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(224, 71%, 4%)',
                  border: '1px solid hsl(215, 27.9%, 16.9%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} fill="url(#attendanceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Site Risk Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Site Risk Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">18 active sites</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={siteDistribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {siteDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(224, 71%, 4%)',
                  border: '1px solid hsl(215, 27.9%, 16.9%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {siteDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}: {item.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Incidents by Type */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Incidents by Type</h3>
              <p className="text-xs text-muted-foreground">Monthly incident breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incidentsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 27.9%, 16.9%)" />
              <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(224, 71%, 4%)',
                  border: '1px solid hsl(215, 27.9%, 16.9%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Real-Time Activity Feed</h3>
              <p className="text-xs text-muted-foreground">Live operational events</p>
            </div>
            <Activity className="h-4 w-4 text-primary animate-pulse" />
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  activity.type === 'incident'
                    ? 'bg-red-400'
                    : activity.type === 'late'
                    ? 'bg-amber-400'
                    : activity.type === 'attendance'
                    ? 'bg-emerald-400'
                    : 'bg-violet-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
