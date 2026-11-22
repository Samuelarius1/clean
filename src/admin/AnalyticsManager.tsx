import { useState } from 'react'
import { Activity, Eye, UsersRound } from 'lucide-react'
import { Alert, CircularProgress } from '@mui/material'
import useSWR from 'swr'
import { adminApi } from '../services/api'

export default function AnalyticsManager({ csrf }: { csrf: string }) {
  const [days, setDays] = useState(30)
  const { data, error, isLoading } = useSWR(['admin-analytics', csrf, days], () => adminApi.analytics(csrf, days), { keepPreviousData: true })
  const maximumViews = Math.max(1, ...(data?.daily.map((item) => item.views) ?? []))
  const numberFormat = new Intl.NumberFormat()

  return <section className="admin-table analytics-panel" aria-labelledby="analytics-heading">
    <div className="analytics-heading"><div><h2 id="analytics-heading">Website visits</h2><p>Anonymous page-view counts from your public website.</p></div><label>Period<select value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></label></div>
    {error && <Alert severity="error">{error instanceof Error ? error.message : 'Could not load visit analytics.'}</Alert>}
    {isLoading ? <div className="analytics-loading"><CircularProgress size={24} /><span>Loading visit data…</span></div> : data && <>
      <div className="analytics-summary"><article><Eye aria-hidden="true"/><span>PAGE VIEWS</span><strong>{numberFormat.format(data.total_views)}</strong></article><article><UsersRound aria-hidden="true"/><span>UNIQUE BROWSER SESSIONS</span><strong>{numberFormat.format(data.unique_visitors)}</strong></article><article><Activity aria-hidden="true"/><span>TRACKING</span><strong>Active</strong></article></div>
      {data.total_views === 0 ? <div className="analytics-empty"><h3>No visits recorded yet</h3><p>Once people visit your public pages, their anonymous page views will appear here.</p></div> : <div className="analytics-details">
        <div className="analytics-chart"><h3>Daily page views</h3><div className="analytics-bars" role="img" aria-label={`Daily page views for the last ${days} days`}>{data.daily.map((item) => <div className="analytics-bar-column" key={item.date} title={`${item.date}: ${item.views} views`}><span>{item.views ? numberFormat.format(item.views) : ''}</span><div style={{ height: `${Math.max(item.views ? 5 : 0, item.views / maximumViews * 100)}%` }} /><small>{new Date(`${item.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small></div>)}</div></div>
        <div className="analytics-lists"><div><h3>Top pages</h3>{data.top_pages.length ? data.top_pages.map((page) => <p key={page.path}><span>{page.path}</span><strong>{numberFormat.format(page.views)}</strong></p>) : <p>No page data yet.</p>}</div><div><h3>Referring sites</h3>{data.referrers.length ? data.referrers.map((referrer) => <p key={referrer.host}><span>{referrer.host}</span><strong>{numberFormat.format(referrer.views)}</strong></p>) : <p>No external referrals yet.</p>}</div></div>
      </div>}
      <p className="analytics-privacy">Analytics are stored in this site&apos;s database. Raw IP addresses and full referrer URLs are not retained; session counts are approximate.</p>
    </>}
  </section>
}
