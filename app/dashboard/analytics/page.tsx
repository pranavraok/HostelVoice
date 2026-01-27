'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { analyticsApi, ApiError, DashboardStats } from '@/lib/api'
import { TrendingUp, TrendingDown, Users, AlertCircle, CheckCircle, Clock, Loader2, RefreshCw, Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)

    try {
      const response = await analyticsApi.getDashboard()
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load analytics'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Extract values from backend response structure
  const totalIssues = dashboardData?.issues?.total || 0
  const pendingIssues = dashboardData?.issues?.pending || 0
  const resolvedIssues = totalIssues - pendingIssues
  const issuesTrend = dashboardData?.issues?.trend || 0
  const totalUsers = dashboardData?.users?.total || 0
  const pendingApprovals = dashboardData?.users?.pending_approvals || 0
  const activeAnnouncements = dashboardData?.announcements?.active || 0
  const openLostFound = dashboardData?.lost_found?.open || 0
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0

  const metrics = [
    {
      label: 'Total Issues',
      value: totalIssues,
      change: issuesTrend,
      trend: issuesTrend >= 0 ? 'up' as const : 'down' as const,
      icon: AlertCircle
    },
    {
      label: 'Resolved Issues',
      value: resolvedIssues,
      change: resolutionRate,
      trend: 'up' as const,
      icon: CheckCircle
    },
    {
      label: 'Active Users',
      value: totalUsers,
      change: 0,
      trend: 'up' as const,
      icon: Users
    },
    {
      label: 'Announcements',
      value: activeAnnouncements,
      change: 0,
      trend: 'up' as const,
      icon: Bell
    }
  ]

  const summaryStats = [
    { label: 'Pending Issues', value: pendingIssues, color: '#f26918' },
    { label: 'Pending Approvals', value: pendingApprovals, color: '#a855f7' },
    { label: 'Open Lost & Found', value: openLostFound, color: '#06b6d4' },
    { label: 'Resolution Rate', value: `${resolutionRate}%`, color: '#10b981' }
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(1, 75, 137, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(1, 75, 137, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-24 md:px-8 md:pt-12 md:pb-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2" style={{ color: '#014b89' }}>
              Analytics & Reports
            </h1>
            <p className="text-base md:text-lg text-gray-600">System-wide analytics and performance metrics</p>
          </div>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            className="gap-2 h-12 rounded-xl font-semibold border-2"
            style={{ borderColor: '#014b89', color: '#014b89' }}
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#014b89' }} />
            <p className="text-gray-600 font-medium">Loading analytics...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center mb-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">Failed to Load Analytics</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchAnalytics} className="bg-red-600 hover:bg-red-700 text-white">
              Try Again
            </Button>
          </div>
        )}

        {/* Analytics Content */}
        {!isLoading && !error && dashboardData && (
        <>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {metrics.map((metric, i) => {
            const Icon = metric.icon
            const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
            const isPositive = (metric.trend === 'up' && metric.change > 0) || (metric.trend === 'down' && metric.change < 0)

            return (
              <div 
                key={metric.label} 
                className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(1, 75, 137, 0.1)' }}>
                    <Icon className="w-6 h-6" style={{ color: '#014b89' }} />
                  </div>
                  <div 
                    className="flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-xl"
                    style={{ 
                      background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: isPositive ? '#10b981' : '#ef4444'
                    }}
                  >
                    <TrendIcon className="w-4 h-4" />
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{metric.label}</p>
                <p className="text-4xl font-bold" style={{ color: '#014b89' }}>{metric.value}</p>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Issues Overview */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ color: '#014b89' }}>
              Issues Overview
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Resolved', count: resolvedIssues, color: '#10b981' },
                { label: 'Pending', count: pendingIssues, color: '#f26918' },
                { label: 'This Month', count: dashboardData.issues?.this_month || 0, color: '#014b89' },
                { label: 'Last Month', count: dashboardData.issues?.last_month || 0, color: '#6b7280' }
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-5 rounded-xl border-2 border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span className="font-bold text-gray-900">{item.label}</span>
                  </div>
                  <span 
                    className="px-4 py-2 rounded-xl text-base font-bold"
                    style={{ color: item.color }}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ color: '#014b89' }}>
              Quick Stats
            </h2>
            <div className="space-y-4">
              {summaryStats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-5 rounded-xl border-2 border-gray-100 hover:shadow-md transition-all"
                >
                  <span className="font-bold text-gray-900">{item.label}</span>
                  <span 
                    className="px-4 py-2 rounded-xl text-base font-bold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-xl transition-all">
            <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Total Users</p>
            <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#014b89' }}>{totalUsers}</p>
            <p className="text-xs font-bold" style={{ color: '#10b981' }}>Approved</p>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-xl transition-all">
            <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Pending Approvals</p>
            <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#f26918' }}>{pendingApprovals}</p>
            <p className="text-xs font-bold" style={{ color: '#f26918' }}>Waiting</p>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-xl transition-all">
            <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Active Announcements</p>
            <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#014b89' }}>{activeAnnouncements}</p>
            <p className="text-xs font-bold" style={{ color: '#10b981' }}>Live</p>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-xl transition-all">
            <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Lost & Found</p>
            <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#014b89' }}>{openLostFound}</p>
            <p className="text-xs font-bold" style={{ color: '#f26918' }}>Open</p>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  )
}
