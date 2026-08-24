import React, { useEffect, useState } from 'react'
import API from '../services/api'

export default function Profile(){
  const [profile, setProfile] = useState(null)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const token = localStorage.getItem('token')
        if(token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const res = await API.get('/auth/profile')
        setProfile(res.data)
      }catch(e){ console.error(e) }
    }
    load()
  },[])

  if(!profile) return <div>Login to view profile</div>

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
    </div>
  )
}
