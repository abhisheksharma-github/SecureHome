import React,{useState,useEffect} from 'react'
import {Home,Users} from 'lucide-react'
import Navbar from '@/components/Navbar'
import {getAllHouses} from '@/api/adminApi'

export default function ManageHouses(){
  const[houses,setHouses]=useState([])
  const[loading,setLoading]=useState(true)
  useEffect(()=>{getAllHouses().then(r=>setHouses(r.data)).catch(()=>{}).finally(()=>setLoading(false))},[])
  return(
    <div className="min-h-screen bg-base"><Navbar/>
      <main className="pt-14">
        <div className="border-b border-border bg-surface/60">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div><p className="font-mono text-2xs text-text-dim uppercase tracking-widest mb-0.5">Admin · Infrastructure</p><h1 className="font-display font-bold text-2xl tracking-wide">MANAGE HOUSES</h1></div>
            <span className="badge badge-amber">{houses.length} units</span>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          {loading?<div className="p-16 flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-amber/40 border-t-amber rounded-full animate-spin"/><span className="font-mono text-sm text-text-dim">Loading…</span></div>
          :<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {houses.map(h=>(
              <div key={h.id} className="card p-5 hover:border-amber/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center"><Home className="w-5 h-5 text-amber"/></div>
                  <span className="font-mono text-2xs text-text-dim">Block {h.block}</span>
                </div>
                <p className="font-display font-bold text-2xl text-amber mb-1">{h.houseNumber}</p>
                <p className="font-mono text-xs text-text-secondary mb-3">Floor {h.floor}{h.description&&` · ${h.description}`}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Users className="w-3.5 h-3.5 text-text-dim"/><span className="font-mono text-xs text-text-dim">{h.residentCount} resident(s)</span>
                </div>
              </div>
            ))}
          </div>}
        </div>
      </main>
    </div>
  )
}
