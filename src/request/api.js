import { get, post, del, patch } from './http'

export const api1 = p1 => get('https://xxx/v5/weather?city=qingdao&key=1b47b16e4aa545eaa55a66f859ac0089', p1)
export const api2 = p2 => get('https://xxx/v5/weather?city=taian&key=1b47b16e4aa545eaa55a66f859ac0089', p2)
export const api3 = p => post('https://xxx/svserver/upload/', p)

// Login
export const Login =  p => post('/login', p)

// users
export const usersList = (params)  => get('/user/users',{params})
export const delUser = (params)  => del('/user/delete',{params})
export const patchUser = (id, data)  => patch('/user/patch?id='+ id, data)
export const usersAdd = (data)  => post('/user/create',data)


// projects
export const projectsList = ()  => get('/project/projects')

// events

export const eventsList = ()  => get('/event/events')