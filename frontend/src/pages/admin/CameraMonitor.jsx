import React,{useState,useEffect} from 'react'
import {Camera,RefreshCw,WifiOff} from 'lucide-react'
import clsx from 'clsx'
import Navbar from '@/components/Navbar'
import {getAllCameras,updateCameraStatus} from '@/api/adminApi'

export default function CameraMonitor(){
  const[cameras,setCameras]=useState([])
  const[loading,setLoading]=useState(true)
  const[toggling,setToggling]=useState(null)

  async function load(){setLoading(true);try{const r=await getAllCameras();setCameras(r.data)}catch(_){}finally{setLoading(false)}}
  useEffect(()=>{load()},[])

  async function handleToggle(cam){
    setToggling(cam.id)
    const next=cam.status==='ONLINE'?'OFFLINE':'ONLINE'
    try{await updateCameraStatus(cam.id,next);setCameras(p=>p.map(c=>c.id===cam.id?{...c,status:next}:c))}
    catch(_){}finally{setToggling(null)}
  }

  const online=cameras.filter(c=>c.status==='ONLINE').length
  const offline=cameras.filter(c=>c.status==='OFFLINE').length
  const maint=cameras.filter(c=>c.status==='MAINTENANCE').length

  return(
    <div className="min-h-screen bg-base"><Navbar/>
      <main className="pt-14">
        <div className="border-b border-border bg-surface/60">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div><p className="font-mono text-2xs text-text-dim uppercase tracking-widest mb-0.5">Admin · Surveillance</p><h1 className="font-display font-bold text-2xl tracking-wide">CAMERA MONITOR</h1></div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-online">{online} Online</span>
              <span className="badge badge-offline">{offline} Offline</span>
              {maint>0&&<span className="badge badge-maint">{maint} Maintenance</span>}
              <button onClick={load} className="btn-ghost py-2 px-3 text-xs gap-1.5 ml-2"><RefreshCw className="w-3.5 h-3.5"/>Refresh</button>
            </div>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          {loading?<div className="p-16 flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-amber/40 border-t-amber rounded-full animate-spin"/><span className="font-mono text-sm text-text-dim">Loading…</span></div>
          :<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cameras.map(cam=>{
              const on=cam.status==='ONLINE'
              return(
                <div key={cam.id} className={clsx('card overflow-hidden transition-all duration-300',on?'border-success/20':'')} >
                  <div className={clsx('aspect-video relative flex items-center justify-center bg-void border-b border-border',on&&'scanlines')}>
                    {on?(<>
                      <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent"/>
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/70"><span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"/><span className="font-mono text-2xs text-white">LIVE</span></div>
                      <Camera className="w-8 h-8 text-success/25"/>
                    </>):(<div className="flex flex-col items-center gap-2"><WifiOff className="w-8 h-8 text-text-dim"/><span className="font-mono text-2xs text-text-dim uppercase tracking-widest">No Signal</span></div>)}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0',on?'bg-success animate-pulse':cam.status==='MAINTENANCE'?'bg-amber':'bg-text-dim')}/>
                      <p className="font-display font-semibold text-sm text-text-primary truncate">{cam.cameraName}</p>
                    </div>
                    <p className="font-mono text-xs text-text-secondary mb-4 pl-3.5 truncate">{cam.location}</p>
                    <div className="flex items-center justify-between">
                      <span className={clsx('font-mono text-2xs uppercase tracking-widest',on?'text-success':cam.status==='MAINTENANCE'?'text-amber':'text-text-dim')}>{cam.status}</span>
                      <button onClick={()=>handleToggle(cam)} disabled={toggling===cam.id||cam.status==='MAINTENANCE'} aria-label={`Toggle ${cam.cameraName}`}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{backgroundColor:on?'rgba(34,197,94,0.3)':'rgba(46,52,71,1)'}}>
                        <span className={clsx('inline-block h-4 w-4 rounded-full transition-transform duration-300',on?'translate-x-6 bg-success shadow-glow-success':'translate-x-1 bg-text-dim')}/>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>}
        </div>
      </main>
    </div>
  )
}
