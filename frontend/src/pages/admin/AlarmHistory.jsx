import React,{useState,useEffect} from 'react'
import {Bell,RefreshCw,CheckCircle,Clock} from 'lucide-react'
import {format} from 'date-fns'
import clsx from 'clsx'
import Navbar from '@/components/Navbar'
import LiveClock from '@/components/LiveClock'
import {getAllAlarms,acknowledgeAlarm,resolveAlarm} from '@/api/adminApi'

function StatusBadge({status}){
  const m={ACTIVE:'badge-danger',ACKNOWLEDGED:'badge-amber',RESOLVED:'badge-online'}
  return<span className={m[status]??'badge-offline'}>{status}</span>
}

export default function AlarmHistory(){
  const[alarms,setAlarms]=useState([])
  const[loading,setLoading]=useState(true)
  const[filter,setFilter]=useState('ALL')
  const[actioning,setActioning]=useState(null)

  async function load(){setLoading(true);try{const r=await getAllAlarms();setAlarms(r.data)}catch(_){}finally{setLoading(false)}}
  useEffect(()=>{load()},[])

  async function handleAck(id){setActioning(id);try{await acknowledgeAlarm(id);setAlarms(p=>p.map(a=>a.alarmId===id?{...a,status:'ACKNOWLEDGED'}:a))}catch(_){}finally{setActioning(null)}}
  async function handleResolve(id){setActioning(id);try{await resolveAlarm(id);setAlarms(p=>p.map(a=>a.alarmId===id?{...a,status:'RESOLVED'}:a))}catch(_){}finally{setActioning(null)}}

  const tabs=['ALL','ACTIVE','ACKNOWLEDGED','RESOLVED']
  const filtered=filter==='ALL'?alarms:alarms.filter(a=>a.status===filter)

  return(
    <div className="min-h-screen bg-base"><Navbar/>
      <main className="pt-14">
        <div className="border-b border-border bg-surface/60">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div><p className="font-mono text-2xs text-text-dim uppercase tracking-widest mb-0.5">Admin · Security</p><h1 className="font-display font-bold text-2xl tracking-wide">ALARM HISTORY</h1></div>
            <div className="flex items-center gap-3"><LiveClock/><button onClick={load} className="btn-ghost py-2 px-3 text-xs gap-1.5"><RefreshCw className="w-3.5 h-3.5"/>Refresh</button></div>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            {tabs.map(tab=>(
              <button key={tab} onClick={()=>setFilter(tab)} className={clsx('px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest shrink-0 transition-all border',filter===tab?'bg-amber/10 text-amber border-amber/30':'text-text-dim border-border hover:border-muted hover:text-text-secondary')}>
                {tab}<span className="ml-2 text-text-dim">{tab==='ALL'?alarms.length:alarms.filter(a=>a.status===tab).length}</span>
              </button>
            ))}
          </div>
          <div className="card overflow-hidden">
            {loading?<div className="p-16 flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-amber/40 border-t-amber rounded-full animate-spin"/><span className="font-mono text-sm text-text-dim">Loading…</span></div>
            :filtered.length===0?<div className="p-16 text-center"><Bell className="w-10 h-10 text-text-dim mx-auto mb-3"/><p className="font-mono text-sm text-text-dim">No alarms in this category</p></div>
            :<div className="overflow-x-auto"><table className="w-full text-left">
              <thead><tr className="border-b border-border bg-surface/50">{['#','Unit','Resident','Status','Triggered At','Message','Actions'].map(h=><th key={h} className="px-5 py-3 font-mono text-2xs text-text-dim uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>{filtered.map(a=>(
                <tr key={a.alarmId} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-text-dim">#{a.alarmId}</td>
                  <td className="px-5 py-4 font-display font-semibold text-sm text-amber">{a.houseNumber}</td>
                  <td className="px-5 py-4 font-mono text-xs text-text-secondary">{a.memberName}</td>
                  <td className="px-5 py-4"><StatusBadge status={a.status}/></td>
                  <td className="px-5 py-4 font-mono text-xs text-text-secondary whitespace-nowrap">{a.triggeredAt?format(new Date(a.triggeredAt),'yyyy-MM-dd HH:mm:ss'):'—'}</td>
                  <td className="px-5 py-4 font-mono text-xs text-text-secondary max-w-[200px] truncate">{a.message||<span className="text-text-dim">—</span>}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {a.status==='ACTIVE'&&<button onClick={()=>handleAck(a.alarmId)} disabled={actioning===a.alarmId} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber/10 text-amber border border-amber/20 font-mono text-2xs uppercase tracking-wider hover:bg-amber/20 transition-colors disabled:opacity-50"><CheckCircle className="w-3 h-3"/>Ack</button>}
                      {a.status==='ACKNOWLEDGED'&&<button onClick={()=>handleResolve(a.alarmId)} disabled={actioning===a.alarmId} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/10 text-success border border-success/20 font-mono text-2xs uppercase tracking-wider hover:bg-success/20 transition-colors disabled:opacity-50"><CheckCircle className="w-3 h-3"/>Resolve</button>}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table></div>}
          </div>
        </div>
      </main>
    </div>
  )
}
