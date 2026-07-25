import React,{useState,useEffect} from 'react'
import {useNavigate,useLocation,Link} from 'react-router-dom'
import {useAuth} from '@/context/AuthContext'
import {loginApi} from '@/api/authApi'

export default function LoginPage(){
  const{login,isAuthenticated,isAdmin}=useAuth()
  const navigate=useNavigate(),location=useLocation()
  const[form,setForm]=useState({email:'',password:''})
  const[showPwd,setShowPwd]=useState(false)
  const[loading,setLoading]=useState(false)
  const[error,setError]=useState(null)

  useEffect(()=>{
    if(isAuthenticated)navigate(isAdmin?'/admin':'/member',{replace:true})
  },[isAuthenticated,isAdmin,navigate])

  function handleChange(e){
    setForm(p=>({...p,[e.target.name]:e.target.value}))
    if(error)setError(null)
  }

  async function handleSubmit(e){
    e.preventDefault()
    if(!form.email||!form.password){setError('Both email and password are required.');return}
    setLoading(true);setError(null)
    try{
      const res=await loginApi(form.email.trim().toLowerCase(),form.password)
      const data=res.data
      login(data.token,data)
      const from=location.state?.from?.pathname
      navigate((from&&from!=='/login')?from:data.role==='ADMIN'?'/admin':'/member',{replace:true})
    }catch(err){
      if(err?.isNetworkError){
        setError('Cannot connect to server. Please start the backend first (mvn spring-boot:run on port 8080).')
      }else{
        setError(err?.message||'Invalid email or password.')
      }
    }finally{setLoading(false)}
  }

  return(
    <div style={{minHeight:'100vh',background:'#0D0F14',display:'flex',fontFamily:'DM Sans, sans-serif'}}>

      {/* Left branding panel */}
      <div style={{display:'none',width:'40%',background:'#060709',borderRight:'1px solid #252A38',flexDirection:'column',justifyContent:'space-between',padding:'3rem',position:'relative',overflow:'hidden'}}
        className="lg-panel">
        <style>{`.lg-panel{display:flex!important}@media(max-width:1024px){.lg-panel{display:none!important}}`}</style>
        {/* Grid bg */}
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(37,42,56,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(37,42,56,0.4) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
        <div style={{position:'absolute',top:'-8rem',left:'-8rem',width:'24rem',height:'24rem',borderRadius:'50%',background:'rgba(245,158,11,0.05)',filter:'blur(60px)'}}/>
        {/* Logo */}
        <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{width:'2.5rem',height:'2.5rem',borderRadius:'0.75rem',background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#F59E0B',fontSize:'1.25rem'}}>🛡</span>
          </div>
          <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:700,fontSize:'1.25rem',letterSpacing:'0.15em',color:'#E8EAF0',textTransform:'uppercase'}}>Secure<span style={{color:'#F59E0B'}}>Home</span></span>
        </div>
        {/* Headline */}
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'2rem'}}>
            <div style={{height:'1px',flex:1,background:'linear-gradient(to right, rgba(245,158,11,0.6), transparent)'}}/>
            <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.625rem',color:'rgba(245,158,11,0.6)',textTransform:'uppercase',letterSpacing:'0.2em'}}>Access Control</span>
          </div>
          <h1 style={{fontFamily:'Rajdhani,sans-serif',fontWeight:700,fontSize:'5rem',lineHeight:0.9,letterSpacing:'-0.02em',color:'#E8EAF0',marginBottom:'1.5rem'}}>
            SOCIETY<br/><span style={{color:'#F59E0B',textShadow:'0 0 12px rgba(245,158,11,0.7)'}}>COMMAND</span><br/>CENTRE
          </h1>
          <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.875rem',color:'#8B92A8',lineHeight:1.6,maxWidth:'20rem'}}>
            Integrated security management for residential communities. Real-time monitoring, instant alerts.
          </p>
          <div style={{display:'flex',gap:'2rem',marginTop:'3rem'}}>
            {[['8','Cameras'],['5','Units'],['99.9%','Uptime']].map(([v,l])=>(
              <div key={l}>
                <p style={{fontFamily:'Rajdhani,sans-serif',fontWeight:700,fontSize:'1.875rem',color:'#E8EAF0'}}>{v}</p>
                <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.625rem',color:'#4A5068',textTransform:'uppercase',letterSpacing:'0.15em',marginTop:'0.25rem'}}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p style={{position:'relative',zIndex:1,fontFamily:'DM Mono,monospace',fontSize:'0.625rem',color:'#4A5068',letterSpacing:'0.15em'}}>SECUREHOME v1.0.0 · CLEARANCE REQUIRED</p>
      </div>

      {/* Right login form */}
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>

        {/* Mobile logo */}
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'3rem'}} className="mobile-logo">
          <style>{`.mobile-logo{display:flex!important}@media(min-width:1024px){.mobile-logo{display:none!important}}`}</style>
          <div style={{width:'2.5rem',height:'2.5rem',borderRadius:'0.75rem',background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#F59E0B',fontSize:'1.25rem'}}>🛡</span>
          </div>
          <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:700,fontSize:'1.25rem',letterSpacing:'0.15em',color:'#E8EAF0',textTransform:'uppercase'}}>Secure<span style={{color:'#F59E0B'}}>Home</span></span>
        </div>

        <div style={{width:'100%',maxWidth:'22rem'}}>
          {/* Heading */}
          <div style={{marginBottom:'2rem'}}>
            <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.625rem',color:'rgba(245,158,11,0.7)',textTransform:'uppercase',letterSpacing:'0.2em',marginBottom:'0.5rem'}}>Authentication Required</p>
            <h2 style={{fontFamily:'Rajdhani,sans-serif',fontWeight:700,fontSize:'2rem',color:'#E8EAF0',letterSpacing:'0.05em',marginBottom:'0.5rem'}}>SIGN IN</h2>
            <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.875rem',color:'#8B92A8'}}>Enter your credentials to access the system.</p>
          </div>

          {/* Error */}
          {error&&(
            <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem',padding:'1rem',borderRadius:'0.75rem',marginBottom:'1.5rem',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)'}}>
              <span style={{color:'#EF4444',fontSize:'1rem',flexShrink:0}}>⚠</span>
              <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.8rem',color:'rgba(239,68,68,0.9)',lineHeight:1.5}}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{marginBottom:'1.25rem'}}>
              <label style={{display:'block',fontFamily:'DM Mono,monospace',fontSize:'0.625rem',fontWeight:500,color:'#8B92A8',textTransform:'uppercase',letterSpacing:'0.15em',marginBottom:'0.375rem'}}>Email Address</label>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:'0.875rem',top:'50%',transform:'translateY(-50%)',color:'#4A5068',pointerEvents:'none'}}>✉</span>
                <input name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange}
                  placeholder="operator@securehome.com" disabled={loading}
                  style={{width:'100%',padding:'0.875rem 1rem 0.875rem 2.75rem',borderRadius:'0.5rem',background:'#13161D',border:'1px solid #252A38',color:'#E8EAF0',fontFamily:'DM Mono,monospace',fontSize:'0.875rem',outline:'none',boxSizing:'border-box',transition:'border-color 0.15s'}}
                  onFocus={e=>e.target.style.borderColor='#F59E0B'} onBlur={e=>e.target.style.borderColor='#252A38'}/>
              </div>
            </div>

            {/* Password */}
            <div style={{marginBottom:'1.5rem'}}>
              <label style={{display:'block',fontFamily:'DM Mono,monospace',fontSize:'0.625rem',fontWeight:500,color:'#8B92A8',textTransform:'uppercase',letterSpacing:'0.15em',marginBottom:'0.375rem'}}>Password</label>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:'0.875rem',top:'50%',transform:'translateY(-50%)',color:'#4A5068',pointerEvents:'none'}}>🔒</span>
                <input name="password" type={showPwd?'text':'password'} autoComplete="current-password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" disabled={loading}
                  style={{width:'100%',padding:'0.875rem 3rem 0.875rem 2.75rem',borderRadius:'0.5rem',background:'#13161D',border:'1px solid #252A38',color:'#E8EAF0',fontFamily:'DM Mono,monospace',fontSize:'0.875rem',outline:'none',boxSizing:'border-box',transition:'border-color 0.15s'}}
                  onFocus={e=>e.target.style.borderColor='#F59E0B'} onBlur={e=>e.target.style.borderColor='#252A38'}/>
                <button type="button" onClick={()=>setShowPwd(v=>!v)} tabIndex={-1}
                  style={{position:'absolute',right:'0.875rem',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#4A5068',cursor:'pointer',padding:0,fontSize:'0.875rem'}}>
                  {showPwd?'👁':"🚫"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{width:'100%',padding:'0.875rem',borderRadius:'0.5rem',background:loading?'rgba(245,158,11,0.5)':'#F59E0B',color:'#060709',border:'none',fontFamily:'Rajdhani,sans-serif',fontWeight:700,fontSize:'0.875rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:loading?'not-allowed':'pointer',transition:'all 0.15s',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>
              {loading?<><span style={{display:'inline-block',width:'1rem',height:'1rem',border:'2px solid rgba(6,7,9,0.3)',borderTop:'2px solid #060709',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>Authenticating…</>:'🔐 Authenticate'}
            </button>
          </form>

          {/* Register link */}
          <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.875rem',color:'#4A5068',textAlign:'center',marginTop:'2rem'}}>
            New resident?{' '}
            <Link to="/register" style={{color:'#F59E0B',textDecoration:'underline',textUnderlineOffset:'2px'}}>Register your unit</Link>
          </p>

          {/* Demo credentials */}
          <div style={{marginTop:'2rem',padding:'1rem',borderRadius:'0.75rem',background:'#13161D',border:'1px solid #252A38'}}>
            <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.625rem',color:'#4A5068',textTransform:'uppercase',letterSpacing:'0.15em',marginBottom:'0.75rem'}}>Demo Credentials</p>
            <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.75rem',color:'#8B92A8',marginBottom:'0.375rem'}}>
              <span style={{color:'#4A5068'}}>Admin: </span>
              <span style={{color:'#F59E0B'}}>admin@securehome.com</span>
            </p>
            <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.75rem',color:'#8B92A8'}}>
              <span style={{color:'#4A5068'}}>Password: </span>
              <span style={{color:'#F59E0B'}}>Admin@123</span>
            </p>
            <div style={{marginTop:'0.75rem',padding:'0.625rem',borderRadius:'0.5rem',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)'}}>
              <p style={{fontFamily:'DM Mono,monospace',fontSize:'0.625rem',color:'rgba(239,68,68,0.7)',lineHeight:1.5}}>
                ⚠ Be Cautions with your Credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
