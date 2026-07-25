import React,{useState,useEffect,useCallback,useRef} from 'react'
import {AlertTriangle,Clock,Shield,Home,CheckCircle,Wifi,Bell,History} from 'lucide-react'
import {format} from 'date-fns'
import {useAuth} from '@/context/AuthContext'
import {triggerAlarm,getMyAlarmHistory} from '@/api/memberApi'
import Navbar from '@/components/Navbar'
import LiveClock from '@/components/LiveClock'
import clsx from 'clsx'

function StatusBadge({status}){
  const m={ACTIVE:'badge-danger',ACKNOWLEDGED:'badge-amber',RESOLVED:'badge-online'}
  return<span className={m[status]??'badge-offline'}>{status}</span>
}

function ConfirmDialog({onConfirm,onCancel,message,setMessage,loading}){
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm animate-slide-up">
      <div className="w-full max-w-sm mx-4 bg-panel border border-border rounded-2xl shadow-deep overflow-hidden">
        <div className="h-1 w-full bg-amber"/>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/30 flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-amber"/></div>
            <div>
              <p className="font-mono text-2xs text-amber/60 uppercase tracking-widest">Confirm Action</p>
              <h3 className="font-display font-semibold text-lg text-text-primary">Trigger Emergency Alarm?</h3>
            </div>
          </div>
          <p className="font-mono text-sm text-text-secondary mb-5 leading-relaxed">This will immediately notify society security and admin. Only use in a genuine emergency.</p>
          <div className="mb-5">
            <label htmlFor="msg" className="label">Emergency Message (Optional)</label>
            <textarea id="msg" value={message} onChange={e=>setMessage(e.target.value)} placeholder="e.g. Suspected intruder at main door…" rows={3} className="input resize-none" disabled={loading}/>
          </div>
          <div className="flex gap-3">
            <button onClick={onConfirm} disabled={loading} className="flex-1 btn-danger py-3">{loading?'Sending…':'YES, TRIGGER'}</button>
            <button onClick={onCancel} disabled={loading} className="flex-1 btn-ghost py-3">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SuccessFlash({onDone}){
  useEffect(()=>{const t=setTimeout(onDone,4000);return()=>clearTimeout(t)},[onDone])
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-success/10 backdrop-blur-sm animate-slide-up">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto mb-6 shadow-glow-success animate-breathe">
          <CheckCircle className="w-12 h-12 text-success"/>
        </div>
        <p className="font-display font-bold text-3xl text-success text-glow-success mb-2">ALERT SENT</p>
        <p className="font-mono text-sm text-success/70">Help has been notified. Stay safe.</p>
      </div>
    </div>
  )
}

export default function MemberDashboard(){
  const{user}=useAuth()
  const[showConfirm,setShowConfirm]=useState(false)
  const[showSuccess,setShowSuccess]=useState(false)
  const[message,setMessage]=useState('')
  const[loading,setLoading]=useState(false)
  const[alarmError,setAlarmError]=useState(null)
  const[history,setHistory]=useState([])
  const[histLoading,setHistLoading]=useState(true)
  const[cooldown,setCooldown]=useState(false)
  const coolRef=useRef(null)

  useEffect(()=>{
    getMyAlarmHistory().then(r=>setHistory(r.data)).catch(()=>{}).finally(()=>setHistLoading(false))
  },[])

  const handlePanic=useCallback(()=>{if(cooldown)return;setAlarmError(null);setShowConfirm(true)},[cooldown])

  const handleConfirm=useCallback(async()=>{
    setLoading(true);setAlarmError(null)
    try{
      const res=await triggerAlarm(message||null)
      setShowConfirm(false);setMessage('');setShowSuccess(true)
      setHistory(p=>[res.data.alarm,...p])
      setCooldown(true);coolRef.current=setTimeout(()=>setCooldown(false),30000)
    }catch(err){setAlarmError(err?.message??'Failed to send alarm.')}
    finally{setLoading(false)}
  },[message])

  useEffect(()=>()=>clearTimeout(coolRef.current),[])

  return(
    <div className="min-h-screen bg-base">
      <Navbar/>
      {showConfirm&&<ConfirmDialog onConfirm={handleConfirm} onCancel={()=>{setShowConfirm(false);setMessage('')}} message={message} setMessage={setMessage} loading={loading}/>}
      {showSuccess&&<SuccessFlash onDone={()=>setShowSuccess(false)}/>}
      <main className="pt-14">
        <div className="border-b border-border bg-surface/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-2xs text-text-dim uppercase tracking-widest mb-0.5">Resident Portal</p>
              <h1 className="font-display font-bold text-2xl text-text-primary tracking-wide">{user?.fullName??'Resident'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-panel border border-border"><Wifi className="w-3.5 h-3.5 text-success"/><span className="font-mono text-2xs text-success uppercase tracking-widest">Connected</span></div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-panel border border-border"><Clock className="w-3.5 h-3.5 text-text-dim"/><LiveClock/></div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{icon:Home,label:'Unit Number',value:user?.houseNumber??'Unassigned',color:'amber'},{icon:Shield,label:'Clearance Level',value:'MEMBER',color:'ice'},{icon:Bell,label:'Alerts Sent',value:history.length,color:'success'}].map(({icon:Icon,label,value,color})=>(
              <div key={label} className="card p-5 flex items-center gap-4">
                <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0',color==='amber'&&'bg-amber/10 border border-amber/20',color==='ice'&&'bg-ice/10 border border-ice/20',color==='success'&&'bg-success/10 border border-success/20')}>
                  <Icon className={clsx('w-5 h-5',color==='amber'&&'text-amber',color==='ice'&&'text-ice',color==='success'&&'text-success')}/>
                </div>
                <div>
                  <p className="font-mono text-2xs text-text-dim uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="font-display font-semibold text-xl text-text-primary">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Panic Button */}
          <div className="card overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="font-mono text-2xs text-danger/70 uppercase tracking-widest mb-0.5">Emergency Response</p>
                <h2 className="font-display font-semibold text-xl text-text-primary tracking-wide">PANIC ALARM SYSTEM</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"/>
                <span className="font-mono text-2xs text-success uppercase tracking-widest">Armed &amp; Ready</span>
              </div>
            </div>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-6">
              <p className="font-mono text-sm text-text-secondary text-center max-w-md leading-relaxed">Press the button below in case of emergency. An immediate alert will be broadcast to all society admins and security personnel.</p>
              <div className="relative">
                {!cooldown&&<>
                  <div className="absolute inset-0 rounded-full bg-danger/20 scale-[1.3] animate-ping [animation-duration:2s]"/>
                  <div className="absolute inset-0 rounded-full bg-danger/10 scale-[1.6] animate-ping [animation-duration:2s] [animation-delay:0.5s]"/>
                </>}
                <button onClick={handlePanic} disabled={cooldown} aria-label="Trigger emergency panic alarm"
                  className={clsx('relative w-48 h-48 rounded-full font-display font-bold text-xl tracking-widest uppercase transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-danger/50 active:scale-[0.95]',
                    !cooldown?['bg-danger text-white shadow-glow-danger hover:bg-red-500 hover:scale-[1.05] animate-pulse-danger']:['bg-muted text-text-dim cursor-not-allowed border-2 border-border'])}>
                  {cooldown?(
                    <span className="flex flex-col items-center gap-1"><CheckCircle className="w-8 h-8 mb-1"/><span className="text-sm">ALERT SENT</span><span className="text-2xs font-mono font-normal">Cooldown active</span></span>
                  ):(
                    <span className="flex flex-col items-center gap-1"><AlertTriangle className="w-10 h-10 mb-1" strokeWidth={2.5}/><span>TRIGGER</span><span>PANIC</span><span>ALARM</span></span>
                  )}
                </button>
              </div>
              {alarmError&&<div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 max-w-sm animate-slide-up"><AlertTriangle className="w-4 h-4 text-danger shrink-0"/><p className="font-mono text-sm text-danger/90">{alarmError}</p></div>}
              <p className="font-mono text-2xs text-text-dim text-center max-w-xs leading-relaxed">⚠ For genuine emergencies only. Misuse may result in disciplinary action.</p>
            </div>
          </div>

          {/* History */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3"><History className="w-4 h-4 text-text-dim"/><h2 className="section-title text-base">My Alarm History</h2></div>
              <span className="badge badge-offline">{history.length} total</span>
            </div>
            {histLoading?<div className="p-12 flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-amber/40 border-t-amber rounded-full animate-spin"/><span className="font-mono text-sm text-text-dim">Loading…</span></div>
            :history.length===0?<div className="p-12 text-center"><Shield className="w-10 h-10 text-text-dim mx-auto mb-3"/><p className="font-mono text-sm text-text-dim">No alarms triggered</p></div>
            :<div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-border bg-surface/50">{['ID','Triggered At','Status','Message'].map(h=><th key={h} className="px-6 py-3 font-mono text-2xs text-text-dim uppercase tracking-widest">{h}</th>)}</tr></thead><tbody>
              {history.map((a,i)=>(
                <tr key={a.alarmId??i} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-text-dim">#{a.alarmId}</td>
                  <td className="px-6 py-4 font-mono text-xs text-text-secondary whitespace-nowrap">{a.triggeredAt?format(new Date(a.triggeredAt),'yyyy-MM-dd HH:mm:ss'):'—'}</td>
                  <td className="px-6 py-4"><StatusBadge status={a.status}/></td>
                  <td className="px-6 py-4 font-mono text-xs text-text-secondary max-w-xs truncate">{a.message||<span className="text-text-dim">—</span>}</td>
                </tr>
              ))}
            </tbody></table></div>}
          </div>
        </div>
      </main>
    </div>
  )
}
