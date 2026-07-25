import React from 'react'
import {Navigate,useLocation} from 'react-router-dom'
import {useAuth} from '@/context/AuthContext'
import {ShieldAlert} from 'lucide-react'
export default function ProtectedRoute({children,role}){
  const{isAuthenticated,user}=useAuth()
  const location=useLocation()
  if(!isAuthenticated)return<Navigate to="/login" state={{from:location}} replace/>
  if(role&&user?.role!==role)return(
    <div className="min-h-screen bg-base flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6 animate-slide-up">
        <div className="w-20 h-20 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-danger"/>
        </div>
        <h1 className="font-display font-bold text-4xl text-danger mb-2">403</h1>
        <p className="font-display text-xl text-text-primary mb-3">Access Denied</p>
        <p className="text-text-secondary text-sm mb-8">You do not have permission to access this area.</p>
        <a href={user?.role==='ADMIN'?'/admin':'/member'} className="btn-ghost text-sm">Return to Dashboard</a>
      </div>
    </div>
  )
  return children
}
