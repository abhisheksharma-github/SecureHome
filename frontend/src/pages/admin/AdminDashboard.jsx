import React,{useState,useEffect,useCallback} from 'react'
import {Camera,WifiOff,AlertTriangle,CheckCircle,Clock,Activity,Bell,Wifi,ChevronRight,Shield} from 'lucide-react'
import {format} from 'date-fns'
import clsx from 'clsx'
import Navbar from '@/components/Navbar'
import LiveClock from '@/components/LiveClock'
import AlertModal from '@/components/AlertModal'
import {useWebSocket} from '@/context/WebSocketContext'
import {getAllCameras,updateCameraStatus,getActiveAlarms,acknowledgeAlarm} from '@/api/adminApi'

function StatCard({icon:Icon,label,value,sub,color='amber'}){
  return(
    <div className="card p-5 flex items-center gap-4">
      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0',color==='amber'&&'bg-amber/10 border border-amber/20',color==='ice'&&'bg-ice/10 border border-ice/20',color==='danger'&&'bg-danger/10 border border-danger/20',color==='success'&&'bg-success/10 border border-success/20')}>
        <Icon className={clsx('w-5 h-5',color==='amber'&&'text-amber',color==='ice'&&'text-ice',color==='danger'&&'text-danger',color==='success'&&'text-success')}/>
      </div>
      <div>
        <p className="font-mono text-2xs text-text-dim uppercase tracking-widest">{label}</p>
        <p className="font-display font-bold text-2xl text-text-primary">{value}</p>
        {sub&&<p className="font-mono text-2xs text-text-secondary mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function CameraCard({camera,onToggle,toggling}){
  const on=camera.status==='ONLINE'
  return(
    <div className={clsx('card p-4 transition-all duration-300',on?'border-success/20 hover:border-success/40':'opacity-75 hover:opacity-100')}>
      <div className={clsx('relative w-full aspect-video rounded-lg mb-3 overflow-hidden bg-void border border-border flex items-center justify-center',on&&'scanlines')}>
        {on?(<>
          <div className="absolute inset-0 bg-gradient-to-br from-surface/40 via-transparent to-void/60"/>
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/60">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"/>
            <span className="font-mono text-2xs text-white uppercase tracking-widest">Live</span>
          </div>
          <Camera className="w-7 h-7 text-success/25"/>
          <div className="absolute bottom-2 right-2"><span className="font-mono text-2xs px-2 py-0.5 rounded uppercase tracking-widest bg-success/20 text-success border border-success/30">{camera.status}</span></div>
        </>):(<>
          <WifiOff className="w-7 h-7 text-text-dim"/>
          <div className="absolute bottom-2 right-2"><span className="font-mono text-2xs px-2 py-0.5 rounded uppercase tracking-widest bg-black/60 text-text-dim border border-border">{camera.status}</span></div>
        </>)}
      </div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0',on?'bg-success animate-pulse':camera.status==='MAINTENANCE'?'bg-amber':'bg-text-dim')}/>
            <p className="font-display font-semibold text-sm text-text-primary truncate">{camera.cameraName}</p>
          </div>
          <p className="font-mono text-xs text-text-secondary truncate pl-3.5">{camera.location}</p>
        </div>
        <span className="font-mono text-2xs text-text-dim shrink-0">#{camera.id}</span>
      </div>
      <button onClick={()=>onToggle(camera)} disabled={toggling===camera.id||camera.status==='MAINTENANCE'}
        className={clsx('w-full py-2 px-4 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          on?'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20':'bg-success/10 text-success border border-success/20 hover:bg-success/20')}>
        {toggling===camera.id?'Updating…':on?'Set Offline':'Set Online'}
      </button>
    </div>
  )
}

function IncidentRow({incident,isNew}){
  let timeStr='—'
  try{const dt=incident.triggeredAt?new Date(incident.triggeredAt):incident.receivedAt?new Date(incident.receivedAt):null;if(dt)timeStr=format(dt,'HH:mm:ss')}catch(_){}
  const active=incident.status==='ACTIVE'
  const badge={ACTIVE:'badge-danger',ACKNOWLEDGED:'badge-amber',RESOLVED:'badge-online'}
  return(
    <div className={clsx('px-5 py-4 transition-colors duration-300',active&&'bg-danger/5',isNew&&'animate-slide-up')}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {active&&<span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse shrink-0 mt-0.5"/>}
          <span className="font-display font-semibold text-sm text-text-primary">Unit {incident.houseNumber}</span>
        </div>
        <span className={badge[incident.status]??'badge-offline'}>{incident.status}</span>
      </div>
      <p className="font-mono text-xs text-text-secondary mb-1.5 pl-3.5">{incident.memberName}</p>
      {incident.message&&<p className="font-mono text-xs text-amber/70 pl-3.5 mb-1.5 truncate italic">"{incident.message}"</p>}
      <div className="flex items-center gap-1.5 pl-3.5">
        <Clock className="w-3 h-3 text-text-dim"/>
        <span className="font-mono text-2xs text-text-dim tabular-nums">{timeStr}</span>
        {incident.receivedAt&&<span className="font-mono text-2xs text-ice/50 ml-1">· live</span>}
      </div>
    </div>
  )
}

export default function AdminDashboard(){
  const{lastAlert,clearLastAlert,isConnected}=useWebSocket()
  const[cameras,setCameras]=useState([])
  const[incidents,setIncidents]=useState([])
  const[camLoading,setCamLoading]=useState(true)
  const[toggling,setToggling]=useState(null)
  const[activeModal,setActiveModal]=useState(null)

  useEffect(()=>{
    Promise.all([getAllCameras(),getActiveAlarms()])
      .then(([c,a])=>{setCameras(c.data);setIncidents(a.data)})
      .catch(e=>console.error(e))
      .finally(()=>setCamLoading(false))
  },[])

  useEffect(()=>{
    if(!lastAlert)return
    setIncidents(prev=>{const ex=prev.some(i=>i.alarmId===lastAlert.alarmId);return ex?prev:[lastAlert,...prev]})
    setActiveModal(lastAlert)
  },[lastAlert])

  const handleToggle=useCallback(async(cam)=>{
    setToggling(cam.id)
    const next=cam.status==='ONLINE'?'OFFLINE':'ONLINE'
    try{await updateCameraStatus(cam.id,next);setCameras(p=>p.map(c=>c.id===cam.id?{...c,status:next}:c))}
    catch(e){console.error(e)}finally{setToggling(null)}
  },[])

  const handleAck=useCallback(async()=>{
    if(!activeModal)return
    try{await acknowledgeAlarm(activeModal.alarmId);setIncidents(p=>p.map(i=>i.alarmId===activeModal.alarmId?{...i,status:'ACKNOWLEDGED'}:i))}
    catch(_){}
    setActiveModal(null);clearLastAlert()
  },[activeModal,clearLastAlert])

  const handleClose=useCallback(()=>{setActiveModal(null);clearLastAlert()},[clearLastAlert])

  const onlineCount=cameras.filter(c=>c.status==='ONLINE').length
  const offlineCount=cameras.filter(c=>c.status!=='ONLINE').length
  const activeAlarms=incidents.filter(i=>i.status==='ACTIVE').length

  return(
    <div className="min-h-screen bg-base">
      <Navbar/>
      {activeModal&&<AlertModal alarm={activeModal} onClose={handleClose} onAck={handleAck}/>}
      <main className="pt-14">
        <div className="border-b border-border bg-surface/60">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-2xs text-text-dim uppercase tracking-widest mb-0.5">Admin Command Centre</p>
              <h1 className="font-display font-bold text-2xl text-text-primary tracking-wide">SECURITY OVERVIEW</h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg border',isConnected?'bg-success/10 border-success/20':'bg-danger/10 border-danger/20')}>
                {isConnected?<Wifi className="w-3.5 h-3.5 text-success"/>:<WifiOff className="w-3.5 h-3.5 text-danger"/>}
                <span className={clsx('font-mono text-2xs uppercase tracking-widest',isConnected?'text-success':'text-danger')}>{isConnected?'WS Live':'WS Offline'}</span>
              </div>
              {activeAlarms>0&&<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/30 animate-flash-alert"><AlertTriangle className="w-3.5 h-3.5 text-danger"/><span className="font-mono text-2xs text-danger uppercase tracking-widest">{activeAlarms} Active Alarm{activeAlarms!==1?'s':''}</span></div>}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-panel border border-border"><Clock className="w-3.5 h-3.5 text-text-dim"/><LiveClock/></div>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Camera} label="Cameras Online" value={onlineCount} sub={`of ${cameras.length} total`} color="success"/>
            <StatCard icon={WifiOff} label="Cameras Offline" value={offlineCount} color="danger"/>
            <StatCard icon={Bell} label="Active Alarms" value={activeAlarms} color={activeAlarms>0?'danger':'amber'}/>
            <StatCard icon={Activity} label="Total Incidents" value={incidents.length} sub="This session" color="ice"/>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* CCTV Grid */}
            <div className="xl:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Camera className="w-4 h-4 text-text-dim"/><h2 className="section-title text-base">CCTV Monitor</h2></div>
                <div className="flex items-center gap-2"><span className="badge badge-online">{onlineCount} Live</span>{offlineCount>0&&<span className="badge badge-offline">{offlineCount} Down</span>}</div>
              </div>
              {camLoading?(
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {Array.from({length:6}).map((_,i)=><div key={i} className="card p-4 animate-pulse"><div className="aspect-video rounded-lg bg-surface mb-3"/><div className="h-3 bg-surface rounded w-3/4 mb-2"/><div className="h-3 bg-surface rounded w-1/2"/></div>)}
                </div>
              ):(
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {cameras.map(cam=><CameraCard key={cam.id} camera={cam} onToggle={handleToggle} toggling={toggling}/>)}
                </div>
              )}
            </div>
            {/* Incidents Log */}
            <div className="xl:col-span-2">
              <div className="card overflow-hidden h-full flex flex-col" style={{minHeight:'500px'}}>
                <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3"><Bell className="w-4 h-4 text-text-dim"/><h2 className="section-title text-base">Security Incidents</h2></div>
                  {activeAlarms>0&&<span className="badge badge-danger animate-flash-alert">{activeAlarms} Critical</span>}
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {incidents.length===0?(
                    <div className="p-12 text-center"><Shield className="w-10 h-10 text-text-dim mx-auto mb-3"/><p className="font-mono text-sm text-text-dim">No incidents recorded</p><p className="font-mono text-xs text-text-dim/60 mt-1">Alerts appear here in real-time</p></div>
                  ):(
                    <div className="divide-y divide-border/50">
                      {incidents.map((inc,idx)=><IncidentRow key={inc.alarmId??idx} incident={inc} isNew={idx===0&&!!inc.receivedAt}/>)}
                    </div>
                  )}
                </div>
                <div className="px-5 py-3 border-t border-border shrink-0">
                  <a href="/admin/alarms" className="flex items-center justify-between text-text-dim hover:text-amber transition-colors font-mono text-xs">
                    <span>View full alarm history</span><ChevronRight className="w-3.5 h-3.5"/>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
