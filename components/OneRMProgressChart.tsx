'use client'

import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { IAMRAPHistoryEntry } from '@/models/User'
import { transformAMRAPToChartData, type TimePeriod } from '@/lib/statsCalculations'

// Lift colors matching design spec
const LIFT_COLORS = {
  squat: '#3b82f6',      // Blue
  bench: '#22c55e',      // Green
  deadlift: '#f97316',   // Orange
  overheadPress: '#a855f7', // Purple
}

const LIFT_NAMES = {
  squat: 'Squat',
  bench: 'Bench',
  deadlift: 'Deadlift',
  overheadPress: 'OHP',
}

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: '3mo', label: '3 mo' },
  { value: '6mo', label: '6 mo' },
  { value: '1yr', label: '1 yr' },
  { value: 'all', label: 'All' },
]

interface OneRMProgressChartProps {
  amrapHistory: IAMRAPHistoryEntry[]
  units: 'lbs' | 'kg'
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    dataKey: string
  }>
  label?: string
  units: 'lbs' | 'kg'
}

function CustomTooltip({ active, payload, label, units }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-date">{formatDate(label || '')}</p>
      <div className="chart-tooltip-items">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="chart-tooltip-item">
            <span
              className="chart-tooltip-dot"
              style={{ backgroundColor: entry.color }}
            />
            <span className="chart-tooltip-label">
              {LIFT_NAMES[entry.dataKey as keyof typeof LIFT_NAMES]}:
            </span>
            <span className="chart-tooltip-value">
              {entry.value} {units}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OneRMProgressChart({
  amrapHistory,
  units,
}: OneRMProgressChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1yr')

  const chartData = useMemo(() => {
    return transformAMRAPToChartData(amrapHistory, timePeriod)
  }, [amrapHistory, timePeriod])

  const hasData = chartData.length > 0

  // Determine which lifts have data
  const liftsWithData = useMemo(() => {
    const lifts = new Set<string>()
    chartData.forEach((point) => {
      if (point.squat !== undefined) lifts.add('squat')
      if (point.bench !== undefined) lifts.add('bench')
      if (point.deadlift !== undefined) lifts.add('deadlift')
      if (point.overheadPress !== undefined) lifts.add('overheadPress')
    })
    return lifts
  }, [chartData])

  const formatXAxisDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <section className="stats-section">
      <div className="chart-header">
        <h2 className="stats-section-title">1RM Progress</h2>
        <div className="time-period-selector">
          {TIME_PERIODS.map((period) => (
            <button
              key={period.value}
              className={`time-period-btn ${
                timePeriod === period.value ? 'time-period-btn-active' : ''
              }`}
              onClick={() => setTimePeriod(period.value)}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <p className="stats-empty-state">
          No data yet for this time period. Complete AMRAP sets in weeks 1-3 to see your progress here.
        </p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisDate}
                stroke="#666666"
                tick={{ fill: '#888888', fontSize: 12 }}
              />
              <YAxis
                stroke="#666666"
                tick={{ fill: '#888888', fontSize: 12 }}
                label={{
                  value: units,
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#888888',
                  fontSize: 12,
                }}
              />
              <Tooltip content={<CustomTooltip units={units} />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) =>
                  LIFT_NAMES[value as keyof typeof LIFT_NAMES] || value
                }
              />

              {liftsWithData.has('squat') && (
                <Line
                  type="monotone"
                  dataKey="squat"
                  stroke={LIFT_COLORS.squat}
                  strokeWidth={2}
                  dot={{ r: 4, fill: LIFT_COLORS.squat }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              )}
              {liftsWithData.has('bench') && (
                <Line
                  type="monotone"
                  dataKey="bench"
                  stroke={LIFT_COLORS.bench}
                  strokeWidth={2}
                  dot={{ r: 4, fill: LIFT_COLORS.bench }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              )}
              {liftsWithData.has('deadlift') && (
                <Line
                  type="monotone"
                  dataKey="deadlift"
                  stroke={LIFT_COLORS.deadlift}
                  strokeWidth={2}
                  dot={{ r: 4, fill: LIFT_COLORS.deadlift }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              )}
              {liftsWithData.has('overheadPress') && (
                <Line
                  type="monotone"
                  dataKey="overheadPress"
                  stroke={LIFT_COLORS.overheadPress}
                  strokeWidth={2}
                  dot={{ r: 4, fill: LIFT_COLORS.overheadPress }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
