import axios from 'axios'

const TOKEN_KEY='securehome_token'

const api=axios.create({
  baseURL:'/api',
  timeout:15000,
  headers:{'Content-Type':'application/json',Accept:'application/json'},
})

api.interceptors.request.use(
  (config)=>{
    try{
      const t=localStorage.getItem(TOKEN_KEY)
      if(t)config.headers['Authorization']=`Bearer ${t}`
    }catch(e){}
    return config
  },
  (err)=>Promise.reject(err)
)

api.interceptors.response.use(
  (res)=>res,
  (error)=>{
    const{response}=error
    if(!response){
      return Promise.reject({message:'Cannot reach the server. Make sure the backend is running on port 8080.',isNetworkError:true})
    }
    const{status,data}=response
    if(status===401){
      try{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem('securehome_user')}catch(e){}
      if(window.location.pathname!=='/login')window.location.href='/login'
      return Promise.reject({message:'Session expired. Please log in again.',status:401})
    }
    if(status===403)return Promise.reject({message:data?.error??'Access denied.',status:403})
    if(status===400)return Promise.reject({message:data?.error??'Invalid request.',fields:data?.fields??null,status:400})
    if(status===404)return Promise.reject({message:data?.error??'Not found.',status:404})
    if(status>=500)return Promise.reject({message:'Server error. Try again shortly.',status})
    return Promise.reject({message:data?.error??'Unexpected error.',status})
  }
)

export default api
