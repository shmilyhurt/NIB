import { get, post, del, patch } from './http'

// Login
export const Login =  p => post('/login', p)

// users
export const usersList = (params)  => get('/user/users',{params})
export const delUser = (params)  => del('/user/delete',{params})
export const patchUser = (id, data)  => patch('/user/patch?id='+ id, data)
export const usersAdd = (data)  => post('/user/create',data)


// projects
export const pros = ()  => get('/project/pros')
export const addPro = (data)  => post('/project/create',data)
export const patchPro = (id, data)  => patch('/project/patch?id='+ id, data)
export const projects = (params)  => get('/project/projects',{params})
export const delPro = (params)  => del('/project/delete?ids='+ params)

// events
export const eventsList = ()  => get('/event/events')


// plans
export const plansList = (params)  => get('/plan/plans',{params})
export const addPlan = (data)  => post('/plan/create',data)
export const delPlan = (params)  => del('/plan/delete',{params})
export const patchPlan = (id, data)  => patch('/plan/patch?id='+ id, data)

// dash
export const dashAll = ()  => get('/dash/all')
export const dashProStatus = ()  => get('/dash/pro_status')
export const dashProType = ()  => get('/dash/pro_type')
