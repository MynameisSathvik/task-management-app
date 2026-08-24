import React, { useEffect, useState } from 'react'
import API from '../../services/api'

export default function AdminOrders(){
  const [orders, setOrders] = useState([])

  const load = async ()=>{
    try{ const res = await API.get('/orders'); setOrders(res.data) }catch(e){ console.error(e); alert('Load failed') }
  }
  useEffect(()=>{ const token = localStorage.getItem('token'); if(token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`; load() },[])

  const updateStatus = async (id, status)=>{
    try{ await API.put(`/orders/${id}/status`, { status }); load() }catch(e){ alert('Update failed') }
  }

  return (
    <div>
      <h3>Orders</h3>
      <table className="table">
        <thead><tr><th>Order</th><th>User</th><th>Total</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {orders.map(o=> (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.user?.email || o.user?.name}</td>
              <td>${o.totalPrice?.toFixed(2)}</td>
              <td>{o.status}</td>
              <td>
                <select defaultValue={o.status} onChange={e=>updateStatus(o._id, e.target.value)}>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
