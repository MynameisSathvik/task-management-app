import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'

export default function AdminDashboard(){
  return (
    <div>
      <h2>Admin</h2>
      <div style={{display:'flex', gap:12, marginBottom:12}}>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
      </div>
      <Routes>
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
      </Routes>
    </div>
  )
}
