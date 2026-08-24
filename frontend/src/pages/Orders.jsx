import React, { useEffect, useState } from 'react'
import API from '../services/api'

export default function Orders(){
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    const load = async ()=>{
      try{
        const token = localStorage.getItem('token')
        if(token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const res = await API.get('/orders/myorders')
        setOrders(res.data)
      }catch(e){ console.error(e) }
    }
    load()
  },[])

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length===0 ? <div className="notice">No orders yet</div> : (
        <table className="table">
          <thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map(o=> (
              <tr key={o._id}><td>{o._id}</td><td>{new Date(o.createdAt).toLocaleString()}</td><td>${o.totalPrice.toFixed(2)}</td><td>{o.status}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
