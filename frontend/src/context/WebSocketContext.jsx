import React,{createContext,useContext,useEffect,useRef,useState,useCallback} from 'react'
import {Client} from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import {useAuth} from '@/context/AuthContext'

const WebSocketContext=createContext(null)

export function WebSocketProvider({children}){
  const{token,isAdmin,isAuthenticated}=useAuth()
  const clientRef=useRef(null)
  const[isConnected,setIsConnected]=useState(false)
  const[lastAlert,setLastAlert]=useState(null)
  const[alertQueue,setAlertQueue]=useState([])

  const clearLastAlert=useCallback(()=>setLastAlert(null),[])

  useEffect(()=>{
    // Only connect for authenticated admin users
    if(!isAuthenticated||!isAdmin||!token)return

    let active=true

    const client=new Client({
      webSocketFactory:()=>{
        try{return new SockJS('/ws')}
        catch(e){console.error('[WS] SockJS error',e);return null}
      },
      connectHeaders:{Authorization:`Bearer ${token}`},
      reconnectDelay:5000,
      debug:(m)=>{if(import.meta.env.DEV)console.debug('[STOMP]',m)},
      onConnect:()=>{
        if(!active)return
        setIsConnected(true)
        client.subscribe('/topic/alerts',(msg)=>{
          if(!active)return
          try{
            const p=JSON.parse(msg.body)
            const e={...p,receivedAt:new Date().toISOString()}
            setLastAlert(e)
            setAlertQueue(prev=>[e,...prev])
          }catch(err){console.error('[WS] parse error',err)}
        })
      },
      onDisconnect:()=>{if(active)setIsConnected(false)},
      onStompError:(frame)=>{
        console.error('[WS] STOMP error',frame)
        if(active)setIsConnected(false)
      },
      onWebSocketError:(error)=>{
        console.error('[WS] WebSocket error',error)
        if(active)setIsConnected(false)
      },
    })

    try{client.activate()}catch(e){console.error('[WS] activate error',e)}
    clientRef.current=client

    return()=>{
      active=false
      try{client.deactivate()}catch(e){}
      setIsConnected(false)
    }
  },[isAuthenticated,isAdmin,token])

  return(
    <WebSocketContext.Provider value={{isConnected,lastAlert,alertQueue,clearLastAlert}}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket(){
  const ctx=useContext(WebSocketContext)
  if(!ctx)throw new Error('useWebSocket() must be inside <WebSocketProvider>')
  return ctx
}
