"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const attendanceData = [
  {
    day: "Mon",
    present: 22,
    total: 24,
    percentage: 92,
    date: "Dec 9",
  },
  {
    day: "Tue",
    present: 20,
    total: 24,
    percentage: 83,
    date: "Dec 10",
  },
  {
    day: "Wed",
    present: 23,
    total: 24,
    percentage: 96,
    date: "Dec 11",
  },
  {
    day: "Thu",
    present: 21,
    total: 24,
    percentage: 88,
    date: "Dec 12",
  },
  {
    day: "Fri",
    present: 24,
    total: 24,
    percentage: 100,
    date: "Dec 13",
  },
  {
    day: "Sat",
    present: 18,
    total: 20,
    percentage: 90,
    date: "Dec 14",
  },
  {
    day: "Sun",
    present: 16,
    total: 18,
    percentage: 89,
    date: "Dec 15",
  },
]

export function AttendanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs fill-muted-foreground" />
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
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {label} - {data.date}
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Present:</span>
                          <span className="font-medium">
                            {data.present}/{data.total}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Attendance:</span>
                          <span className="font-medium text-primary">{data.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="percentage"
            strokeWidth={3}
            stroke="hsl(var(--primary))"
            dot={{
              fill: "hsl(var(--primary))",
              strokeWidth: 2,
              r: 5,
              className: "drop-shadow-sm",
            }}
            activeDot={{
              r: 7,
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
              fill: "hsl(var(--background))",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
