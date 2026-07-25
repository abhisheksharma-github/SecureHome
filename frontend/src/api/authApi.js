import api from './api.js'
export const loginApi=(email,password)=>api.post('/auth/login',{email,password})
export const registerApi=(payload)=>api.post('/auth/register',payload)
export const verifyTokenApi=()=>api.get('/auth/verify')
