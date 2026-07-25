import React,{useState,useEffect} from 'react'
import {format} from 'date-fns'
import clsx from 'clsx'
export default function LiveClock({className,showDate=true}){
  const[now,setNow]=useState(new Date())
  useEffect(()=>{
    const ms=1000-(Date.now()%1000);let id
    const t=setTimeout(()=>{setNow(new Date());id=setInterval(()=>setNow(new Date()),1000)},ms)
    return()=>{clearTimeout(t);clearInterval(id)}
  },[])
  return(
    <div className={clsx('flex items-center gap-2 font-mono',className)}>
      {showDate&&<><span className="text-text-dim text-xs tracking-wider">{format(now,'yyyy-MM-dd')}</span><span className="text-border">│</span></>}
      <span className="text-amber text-glow-amber tabular-nums tracking-widest font-medium text-sm">{format(now,'HH:mm:ss')}</span>
    </div>
  )
}
