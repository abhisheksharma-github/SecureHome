import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {Shield,Eye,EyeOff,AlertCircle,User,Mail,Lock,Phone,Home} from 'lucide-react'
import {useAuth} from '@/context/AuthContext'
import {registerApi} from '@/api/authApi'

export default function RegisterPage(){
  const{login}=useAuth();const navigate=useNavigate()
  const[form,setForm]=useState({fullName:'',email:'',password:'',confirmPassword:'',phone:'',houseNumber:''})
  const[showPwd,setShowPwd]=useState(false)
  const[loading,setLoading]=useState(false)
  const[error,setError]=useState(null)
  function handleChange(e){setForm(p=>({...p,[e.target.name]:e.target.value}));if(error)setError(null)}
  async function handleSubmit(e){
    e.preventDefault()
    if(form.password!==form.confirmPassword){setError('Passwords do not match.');return}
    setLoading(true);setError(null)
    try{
      const res=await registerApi({fullName:form.fullName.trim(),email:form.email.trim().toLowerCase(),password:form.password,phone:form.phone.trim()||null,houseNumber:form.houseNumber.trim().toUpperCase()||null})
      const data=res.data;login(data.token,data);navigate('/member',{replace:true})
    }catch(err){setError(err?.message??'Registration failed.')}
    finally{setLoading(false)}
  }
  const fields=[
    {id:'fullName',label:'Full Name',type:'text',icon:User,ph:'Rajesh Kumar'},
    {id:'email',label:'Email Address',type:'email',icon:Mail,ph:'resident@example.com'},
    {id:'password',label:'Password',type:'password',icon:Lock,ph:'Min. 8 characters'},
    {id:'confirmPassword',label:'Confirm Password',type:'password',icon:Lock,ph:'Repeat password'},
    {id:'phone',label:'Phone (optional)',type:'tel',icon:Phone,ph:'+91-9xxxxxxxxx'},
    {id:'houseNumber',label:'House Number',type:'text',icon:Home,ph:'e.g. A-101'},
  ]
  return(
    <div className="min-h-screen bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/30 flex items-center justify-center"><Shield className="w-5 h-5 text-amber"/></div>
          <span className="font-display font-bold text-xl tracking-widest uppercase">Secure<span className="text-amber">Home</span></span>
        </div>
        <div className="card p-8">
          <div className="mb-6">
            <p className="font-mono text-2xs text-amber/70 uppercase tracking-widest mb-1">New Resident Registration</p>
            <h2 className="font-display font-bold text-2xl text-text-primary tracking-wide">CREATE ACCOUNT</h2>
          </div>
          {error&&<div className="flex items-start gap-3 p-4 rounded-xl mb-6 bg-danger/10 border border-danger/30 animate-slide-up"><AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5"/><p className="font-mono text-sm text-danger/90">{error}</p></div>}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {fields.map(({id,label,type,icon:Icon,ph})=>(
              <div key={id}>
                <label htmlFor={id} className="label">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none"/>
                  <input id={id} name={id} type={type==='password'?(showPwd?'text':'password'):type} value={form[id]} onChange={handleChange} placeholder={ph} className="input pl-10" disabled={loading}/>
                  {id==='password'&&<button type="button" onClick={()=>setShowPwd(v=>!v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary" tabIndex={-1}>{showPwd?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">{loading?'Registering…':'Register Unit'}</button>
          </form>
          <p className="font-mono text-sm text-text-dim text-center mt-6">Already registered?{' '}<Link to="/login" className="text-amber hover:text-amber-glow transition-colors underline underline-offset-2">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
