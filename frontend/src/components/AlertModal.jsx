import React,{useEffect,useRef} from 'react'
import {format,parseISO} from 'date-fns'
import {AlertTriangle,X,MapPin,User,Clock,CheckCircle} from 'lucide-react'
export default function AlertModal({alarm,onClose,onAck}){
  const ref=useRef(null)
  useEffect(()=>{
    const h=(e)=>{if(e.key==='Escape')onClose()}
    document.addEventListener('keydown',h);ref.current?.focus()
    document.body.style.overflow='hidden'
    return()=>{document.removeEventListener('keydown',h);document.body.style.overflow=''}
  },[onClose])
  if(!alarm)return null
  let timeStr='—',fullTs='—'
  try{const dt=typeof alarm.triggeredAt==='string'?parseISO(alarm.triggeredAt):new Date(alarm.triggeredAt);timeStr=format(dt,'HH:mm:ss');fullTs=format(dt,'yyyy-MM-dd HH:mm:ss')}catch(_){}
  return(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-void/95 backdrop-blur-sm" role="alertdialog" aria-modal="true">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-danger/10 animate-ping [animation-duration:1.5s]"/>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-danger/15 animate-ping [animation-duration:1.5s] [animation-delay:0.3s]"/>
      </div>
      <div className="relative w-full max-w-lg mx-4 animate-slide-up">
        <div className="h-1.5 w-full rounded-t-xl bg-danger animate-flash-alert shadow-glow-danger"/>
        <div className="bg-[#110505] border border-danger/40 rounded-b-xl shadow-glow-danger overflow-hidden">
          <div className="flex items-start justify-between p-6 pb-4 border-b border-danger/20">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <div className="absolute inset-0 rounded-xl bg-danger animate-pulse-danger"/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-white" strokeWidth={2.5}/>
                </div>
              </div>
              <div>
                <p className="font-mono text-2xs text-danger/70 uppercase tracking-widest mb-1 animate-flash-alert">● CRITICAL EMERGENCY ALERT</p>
                <h2 className="font-display font-bold text-2xl text-danger text-glow-danger">PANIC ALARM TRIGGERED</h2>
              </div>
            </div>
            <button ref={ref} onClick={onClose} className="p-2 rounded-lg text-danger/50 hover:text-danger hover:bg-danger/10 transition-colors"><X className="w-5 h-5"/></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-danger/10 border border-danger/20">
              <Clock className="w-5 h-5 text-danger shrink-0"/>
              <div>
                <p className="font-mono text-2xs text-danger/60 uppercase tracking-widest mb-0.5">Distress Initiated At</p>
                <p className="font-display font-bold text-3xl text-danger text-glow-danger tabular-nums tracking-wider">{timeStr}</p>
                <p className="font-mono text-xs text-danger/50 mt-0.5">{fullTs}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-panel border border-border">
              <MapPin className="w-5 h-5 text-amber shrink-0"/>
              <div>
                <p className="font-mono text-2xs text-text-dim uppercase tracking-widest mb-0.5">Location</p>
                <p className="font-display font-semibold text-xl text-amber">Unit {alarm.houseNumber}</p>
                <p className="font-mono text-xs text-text-secondary mt-0.5">Block {alarm.block} · Floor {alarm.floor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-panel border border-border">
              <User className="w-5 h-5 text-ice shrink-0"/>
              <div>
                <p className="font-mono text-2xs text-text-dim uppercase tracking-widest mb-0.5">Resident</p>
                <p className="font-display font-semibold text-lg text-text-primary">{alarm.memberName}</p>
              </div>
            </div>
            {alarm.message&&<div className="p-4 rounded-xl bg-amber-bg border border-amber/20"><p className="font-mono text-2xs text-amber/60 uppercase tracking-widest mb-1.5">Message</p><p className="font-mono text-sm text-amber/90">"{alarm.message}"</p></div>}
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={onAck} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-danger text-white font-display font-semibold text-sm tracking-widest uppercase hover:bg-red-500 transition-all active:scale-[0.98]">
              <CheckCircle className="w-4 h-4"/> Acknowledge & Dispatch
            </button>
            <button onClick={onClose} className="px-4 py-3 rounded-xl bg-panel border border-border text-text-secondary hover:text-text-primary font-display text-sm uppercase transition-all">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  )
}
