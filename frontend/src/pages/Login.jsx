import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      // try to decode simple payload name/email isn't in token but backend token only contains id; continue
      navigate('/')
      window.location.reload()
    }catch(e){ alert(e.response?.data?.message || 'Login failed') }
  }

  return (
    <div style={{maxWidth:420}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="form-group"><input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="form-group"><input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button className="button" type="submit">Login</button>
      </form>
    </div>
  )
}
