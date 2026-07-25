import React,{createContext,useContext,useState,useEffect,useCallback,useMemo} from 'react'
import {jwtDecode} from 'jwt-decode'

const TOKEN_KEY='securehome_token'
const USER_KEY='securehome_user'
const AuthContext=createContext(null)

function decode(token){
  if(!token)return null
  try{
    const d=jwtDecode(token)
    if(d.exp&&d.exp<Date.now()/1000)return null
    return{userId:d.userId,email:d.sub,fullName:d.fullName,role:d.role,houseId:d.houseId??null,exp:d.exp}
  }catch(e){return null}
}

function valid(t){return!!t&&!!decode(t)}

export function AuthProvider({children}){
  const[token,setToken]=useState(()=>{
    try{const s=localStorage.getItem(TOKEN_KEY);return valid(s)?s:null}catch(e){return null}
  })
  const[user,setUser]=useState(()=>{
    try{
      const s=localStorage.getItem(TOKEN_KEY)
      if(!valid(s))return null
      const c=localStorage.getItem(USER_KEY)
      if(c)return JSON.parse(c)
      return decode(s)
    }catch(e){return null}
  })
  const[isLoading,setIsLoading]=useState(false)
  const[authError,setAuthError]=useState(null)

  // Define logout FIRST so useEffect can reference it
  const logout=useCallback(()=>{
    try{
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }catch(e){}
    setToken(null)
    setUser(null)
    setAuthError(null)
  },[])

  const login=useCallback((newToken,userObj)=>{
    if(!newToken)return
    const d=decode(newToken)
    if(!d){setAuthError('Invalid token received.');return}
    const enriched={...d,houseNumber:userObj?.houseNumber??null}
    try{
      localStorage.setItem(TOKEN_KEY,newToken)
      localStorage.setItem(USER_KEY,JSON.stringify(enriched))
    }catch(e){}
    setToken(newToken)
    setUser(enriched)
    setAuthError(null)
  },[])

  // Auto-logout when token expires
  useEffect(()=>{
    if(!token)return
    const d=decode(token)
    if(!d){logout();return}
    const ms=d.exp*1000-Date.now()
    if(ms<=0){logout();return}
    const t=setTimeout(()=>logout(),ms)
    return()=>clearTimeout(t)
  },[token,logout])

  const value=useMemo(()=>({
    token,user,isLoading,authError,
    isAuthenticated:!!(token&&user),
    isAdmin:user?.role==='ADMIN',
    isMember:user?.role==='MEMBER',
    login,logout,setIsLoading,setAuthError,
  }),[token,user,isLoading,authError,login,logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
  const ctx=useContext(AuthContext)
  if(!ctx)throw new Error('useAuth() must be inside <AuthProvider>')
  return ctx
}

export default AuthContext
