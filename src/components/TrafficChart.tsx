import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Point = { date: string; page_views: number; unique_visitors: number }
export function TrafficChart({ data }: { data: Point[] }) {
  const chartData = data.slice(-30).map(item => ({ ...item, date: new Date(`${item.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }))
  return <div className="traffic-chart" role="img" aria-label={`Daily traffic for ${chartData.length} days. Bars compare page views with anonymous daily visitor IDs.`}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 12, right: 8, bottom: 0, left: -18 }} barGap={4}>
        <CartesianGrid stroke="rgba(150,165,190,.15)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={22} />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip labelStyle={{ color: '#13213a' }} formatter={(value, name) => [Number(value).toLocaleString(), name === 'page_views' ? 'Page views' : 'Daily visitor IDs']} />
        <Legend formatter={value => value === 'page_views' ? 'Page views' : 'Daily visitor IDs'} wrapperStyle={{ fontSize: 11, color: 'var(--muted)', paddingTop: 8 }} />
        <Bar dataKey="page_views" fill="#E923DA" radius={[4, 4, 0, 0]} maxBarSize={25} />
        <Bar dataKey="unique_visitors" fill="#6698F2" radius={[4, 4, 0, 0]} maxBarSize={25} />
      </BarChart>
    </ResponsiveContainer>
  </div>
}
