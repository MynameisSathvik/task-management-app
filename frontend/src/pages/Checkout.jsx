import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API, { setAuthToken } from '../services/api'

export default function Checkout({ cart, clearCart }){
  const navigate = useNavigate()
  const [shipping, setShipping] = useState({ name:'', address:'', city:'', postalCode:'', country:'', phone:'' })
  const [loading, setLoading] = useState(false)
  const total = cart.reduce((s,i)=>s + i.price * i.qty, 0)

  const placeOrder = async () =>{
    try{
      setLoading(true)
      const token = localStorage.getItem('token')
      if(token) setAuthToken(token)
      const res = await API.post('/orders', { orderItems: cart, shippingInfo: shipping })
      clearCart()
      navigate(`/orders`)
    }catch(e){
      alert(e.response?.data?.message || 'Order failed')
    }finally{ setLoading(false) }
  }

  return (
    <div>
      <h2>Checkout</h2>
      <div className="row">
        <div className="col">
          <h3>Shipping</h3>
          <div className="form-group"><input className="input" placeholder="Full name" value={shipping.name} onChange={e=>setShipping({...shipping, name:e.target.value})} /></div>
          <div className="form-group"><input className="input" placeholder="Address" value={shipping.address} onChange={e=>setShipping({...shipping, address:e.target.value})} /></div>
          <div className="form-group row"><input className="input" placeholder="City" value={shipping.city} onChange={e=>setShipping({...shipping, city:e.target.value})} style={{flex:1}} /><input className="input" placeholder="Postal Code" value={shipping.postalCode} onChange={e=>setShipping({...shipping, postalCode:e.target.value})} style={{width:140, marginLeft:8}} /></div>
          <div className="form-group"><input className="input" placeholder="Country" value={shipping.country} onChange={e=>setShipping({...shipping, country:e.target.value})} /></div>
          <div className="form-group"><input className="input" placeholder="Phone" value={shipping.phone} onChange={e=>setShipping({...shipping, phone:e.target.value})} /></div>
        </div>
        <div className="col">
          <h3>Order Summary</h3>
          <div className="card">
            <p>Items: {cart.length}</p>
            <p>Total: ${total.toFixed(2)}</p>
            <button className="button" onClick={placeOrder} disabled={loading}>Place Order (Demo)</button>
          </div>
        </div>
      </div>
    </div>
  )
}
