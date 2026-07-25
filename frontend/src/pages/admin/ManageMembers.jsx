import React,{useState,useEffect} from 'react'
import {Users,UserX,UserCheck,RefreshCw,Search} from 'lucide-react'
import {format} from 'date-fns'
import clsx from 'clsx'
import Navbar from '@/components/Navbar'
import {getAllMembers,deactivateMember,activateMember} from '@/api/adminApi'

export default function ManageMembers(){
  const[members,setMembers]=useState([])
  const[loading,setLoading]=useState(true)
  const[search,setSearch]=useState('')
  const[actioning,setActioning]=useState(null)

  async function load(){setLoading(true);try{const r=await getAllMembers();setMembers(r.data)}catch(_){}finally{setLoading(false)}}
  useEffect(()=>{load()},[])

  async function toggle(m){
    setActioning(m.id)
    try{m.isActive?await deactivateMember(m.id):await activateMember(m.id);setMembers(p=>p.map(u=>u.id===m.id?{...u,isActive:!u.isActive}:u))}
    catch(_){}finally{setActioning(null)}
  }

  const filtered=members.filter(m=>
    m.fullName.toLowerCase().includes(search.toLowerCase())||
    m.email.toLowerCase().includes(search.toLowerCase())||
    (m.houseNumber??'').toLowerCase().includes(search.toLowerCase())
  )

  return(
    <div className="min-h-screen bg-base"><Navbar/>
      <main className="pt-14">
        <div className="border-b border-border bg-surface/60">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div><p className="font-mono text-2xs text-text-dim uppercase tracking-widest mb-0.5">Admin · Management</p><h1 className="font-display font-bold text-2xl tracking-wide">MANAGE MEMBERS</h1></div>
            <div className="flex items-center gap-3"><span className="badge badge-ice">{members.length} residents</span><button onClick={load} className="btn-ghost py-2 px-3 text-xs gap-1.5"><RefreshCw className="w-3.5 h-3.5"/>Refresh</button></div>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <div className="relative mb-5 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email, unit…" className="input pl-10"/>
          </div>
          <div className="card overflow-hidden">
            {loading?<div className="p-16 flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-amber/40 border-t-amber rounded-full animate-spin"/><span className="font-mono text-sm text-text-dim">Loading…</span></div>
            :<div className="overflow-x-auto"><table className="w-full text-left">
              <thead><tr className="border-b border-border bg-surface/50">{['Name','Email','Phone','Unit','Status','Joined','Action'].map(h=><th key={h} className="px-5 py-3 font-mono text-2xs text-text-dim uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(m=>(
                  <tr key={m.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-4"><p className="font-display font-semibold text-sm text-text-primary">{m.fullName}</p></td>
                    <td className="px-5 py-4 font-mono text-xs text-text-secondary">{m.email}</td>
                    <td className="px-5 py-4 font-mono text-xs text-text-dim">{m.phone??'—'}</td>
                    <td className="px-5 py-4 font-display font-semibold text-sm text-amber">{m.houseNumber??'—'}</td>
                    <td className="px-5 py-4"><span className={m.isActive?'badge badge-online':'badge badge-offline'}>{m.isActive?'Active':'Inactive'}</span></td>
                    <td className="px-5 py-4 font-mono text-xs text-text-dim whitespace-nowrap">{m.createdAt?format(new Date(m.createdAt),'dd MMM yyyy'):'—'}</td>
                    <td className="px-5 py-4">
                      <button onClick={()=>toggle(m)} disabled={actioning===m.id} className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-2xs uppercase tracking-wider border transition-colors disabled:opacity-50',m.isActive?'bg-danger/10 text-danger border-danger/20 hover:bg-danger/20':'bg-success/10 text-success border-success/20 hover:bg-success/20')}>
                        {m.isActive?<><UserX className="w-3 h-3"/>Deactivate</>:<><UserCheck className="w-3 h-3"/>Activate</>}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length===0&&<tr><td colSpan={7} className="px-5 py-12 text-center"><Users className="w-10 h-10 text-text-dim mx-auto mb-3"/><p className="font-mono text-sm text-text-dim">No members found</p></td></tr>}
              </tbody>
            </table></div>}
          </div>
        </div>
      </main>
    </div>
  )
}
