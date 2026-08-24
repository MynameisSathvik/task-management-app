import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await API.post('/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/')
      window.location.reload()
    }catch(e){ alert(e.response?.data?.message || 'Register failed') }
  }

  return (
    <div style={{maxWidth:420}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div className="form-group"><input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="form-group"><input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="form-group"><input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button className="button" type="submit">Register</button>
      </form>
    </div>
  )
}
