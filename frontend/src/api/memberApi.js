import api from './api.js'
export const triggerAlarm=(message=null)=>api.post('/member/alarm',{message})
export const getMyAlarmHistory=()=>api.get('/member/alarm/history')
