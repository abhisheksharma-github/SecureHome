import React,{Suspense,lazy,Component} from 'react'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import {AuthProvider,useAuth} from '@/context/AuthContext'
import {WebSocketProvider} from '@/context/WebSocketContext'
import ProtectedRoute from '@/components/ProtectedRoute'

const LoginPage       =lazy(()=>import('@/pages/LoginPage'))
const RegisterPage    =lazy(()=>import('@/pages/RegisterPage'))
const AdminDashboard  =lazy(()=>import('@/pages/admin/AdminDashboard'))
const ManageMembers   =lazy(()=>import('@/pages/admin/ManageMembers'))
const ManageHouses    =lazy(()=>import('@/pages/admin/ManageHouses'))
const CameraMonitor   =lazy(()=>import('@/pages/admin/CameraMonitor'))
const AlarmHistory    =lazy(()=>import('@/pages/admin/AlarmHistory'))
const MemberDashboard =lazy(()=>import('@/pages/member/MemberDashboard'))

// Error Boundary catches React render errors and shows them instead of blank screen
class ErrorBoundary extends Component{
  constructor(props){super(props);this.state={hasError:false,error:null}}
  static getDerivedStateFromError(error){return{hasError:true,error}}
  componentDidCatch(error,info){console.error('[ErrorBoundary]',error,info)}
  render(){
    if(this.state.hasError){
      return(
        <div style={{minHeight:'100vh',background:'#0D0F14',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
          <div style={{maxWidth:'600px',textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>⚠️</div>
            <h1 style={{color:'#EF4444',fontFamily:'monospace',fontSize:'1.5rem',marginBottom:'1rem'}}>Application Error</h1>
            <p style={{color:'#8B92A8',fontFamily:'monospace',fontSize:'0.875rem',marginBottom:'1rem'}}>
              {this.state.error?.message||'An unexpected error occurred'}
            </p>
            <p style={{color:'#4A5068',fontFamily:'monospace',fontSize:'0.75rem',marginBottom:'2rem'}}>
              Make sure the backend is running on port 8080, then refresh this page.
            </p>
            <button onClick={()=>window.location.reload()}
              style={{background:'#F59E0B',color:'#060709',border:'none',padding:'0.75rem 2rem',borderRadius:'0.5rem',cursor:'pointer',fontFamily:'monospace',fontWeight:'bold',fontSize:'0.875rem'}}>
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function Loader(){
  return(
    <div style={{minHeight:'100vh',background:'#0D0F14',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:'3rem',height:'3rem',border:'2px solid rgba(245,158,11,0.3)',borderTop:'2px solid #F59E0B',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 1rem'}}/>
        <p style={{color:'#4A5068',fontFamily:'monospace',fontSize:'0.75rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>Loading…</p>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )
}

function RootRedirect(){
  const{isAuthenticated,isAdmin}=useAuth()
  if(!isAuthenticated)return<Navigate to="/login" replace/>
  return<Navigate to={isAdmin?'/admin':'/member'} replace/>
}

function NotFound(){
  return(
    <div className="min-h-screen bg-base bg-grid flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="font-display font-bold text-[8rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-text-secondary to-text-dim">404</h1>
        <p className="font-display text-xl text-text-secondary mt-2 mb-8">Sector Not Found</p>
        <a href="/" className="btn-primary">Return to Base</a>
      </div>
    </div>
  )
}

function AppRoutes(){
  return(
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path="/login"    element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/"         element={<RootRedirect/>}/>
        <Route path="/admin"         element={<ProtectedRoute role="ADMIN"><AdminDashboard/></ProtectedRoute>}/>
        <Route path="/admin/members" element={<ProtectedRoute role="ADMIN"><ManageMembers/></ProtectedRoute>}/>
        <Route path="/admin/houses"  element={<ProtectedRoute role="ADMIN"><ManageHouses/></ProtectedRoute>}/>
        <Route path="/admin/cameras" element={<ProtectedRoute role="ADMIN"><CameraMonitor/></ProtectedRoute>}/>
        <Route path="/admin/alarms"  element={<ProtectedRoute role="ADMIN"><AlarmHistory/></ProtectedRoute>}/>
        <Route path="/member"        element={<ProtectedRoute role="MEMBER"><MemberDashboard/></ProtectedRoute>}/>
        <Route path="*"              element={<NotFound/>}/>
      </Routes>
    </Suspense>
  )
}

export default function App(){
  return(
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <WebSocketProvider>
            <AppRoutes/>
          </WebSocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
