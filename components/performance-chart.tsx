"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const performanceData = [
  {
    metric: "Punctuality",
    score: 88,
    target: 85,
    improvement: "+3%",
  },
  {
    metric: "Attendance",
    score: 95,
    target: 90,
    improvement: "+2%",
  },
  {
    metric: "Task Completion",
    score: 92,
    target: 85,
    improvement: "+7%",
  },
  {
    metric: "Safety Score",
    score: 96,
    target: 95,
    improvement: "+1%",
  },
  {
    metric: "Team Collaboration",
    score: 89,
    target: 80,
    improvement: "+9%",
  },
]

export function PerformanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="metric"
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-md">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{label}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Current Score:</span>
                          <span className="font-medium text-primary">{data.score}%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">{data.target}%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Improvement:</span>
                          <span className="font-medium text-green-600">{data.improvement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} className="drop-shadow-sm" />
          <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} opacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
