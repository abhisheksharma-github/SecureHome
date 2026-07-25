import React,{useState} from 'react'
import {Link,useLocation,useNavigate} from 'react-router-dom'
import {useAuth} from '@/context/AuthContext'
import {Shield,LogOut,Menu,X,LayoutDashboard,Users,Home,Camera,Bell} from 'lucide-react'
import clsx from 'clsx'
const ADMIN_NAV=[{to:'/admin',label:'Dashboard',icon:LayoutDashboard},{to:'/admin/members',label:'Members',icon:Users},{to:'/admin/houses',label:'Houses',icon:Home},{to:'/admin/cameras',label:'Cameras',icon:Camera},{to:'/admin/alarms',label:'Alarms',icon:Bell}]
const MEMBER_NAV=[{to:'/member',label:'My Portal',icon:LayoutDashboard}]
export default function Navbar(){
  const{user,logout,isAdmin}=useAuth()
  const location=useLocation(),navigate=useNavigate()
  const[open,setOpen]=useState(false)
  const nav=isAdmin?ADMIN_NAV:MEMBER_NAV
  const handleLogout=()=>{logout();navigate('/login',{replace:true})}
  return(
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface/90 border-b border-border glass">
      <div className="max-w-screen-2xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-amber/10 border border-amber/30 flex items-center justify-center group-hover:bg-amber/20 transition-colors">
            <Shield className="w-4 h-4 text-amber"/>
          </div>
          <span className="font-display font-bold text-lg tracking-widest text-text-primary uppercase hidden sm:block">Secure<span className="text-amber">Home</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-1 flex-1 ml-8">
          {nav.map(({to,label,icon:Icon})=>{
            const active=location.pathname===to
            return(
              <Link key={to} to={to} className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-lg font-display text-sm tracking-wide uppercase transition-all duration-150',active?'bg-amber/10 text-amber border border-amber/20':'text-text-secondary hover:text-text-primary hover:bg-panel')}>
                <Icon className="w-3.5 h-3.5"/>{label}
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-panel border border-border">
            <div className={clsx('w-1.5 h-1.5 rounded-full animate-pulse',isAdmin?'bg-amber':'bg-ice')}/>
            <span className="font-mono text-xs text-text-secondary">{user?.fullName?.split(' ')[0]}</span>
            <span className={clsx('font-mono text-2xs font-medium uppercase tracking-widest',isAdmin?'text-amber':'text-ice')}>{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-dim hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all duration-150 font-display text-sm">
            <LogOut className="w-4 h-4"/><span className="hidden sm:block uppercase tracking-wide">Exit</span>
          </button>
          <button onClick={()=>setOpen(v=>!v)} className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-panel transition-colors">
            {open?<X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}
          </button>
        </div>
      </div>
      {open&&(
        <div className="md:hidden border-t border-border bg-surface/95 glass animate-slide-up">
          {nav.map(({to,label,icon:Icon})=>(
            <Link key={to} to={to} onClick={()=>setOpen(false)} className="flex items-center gap-3 px-6 py-4 text-text-secondary hover:text-text-primary hover:bg-panel border-b border-border/50 font-display tracking-wide uppercase text-sm transition-colors">
              <Icon className="w-4 h-4"/>{label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
