import React, { useEffect, useState } from 'react'
import API from '../../services/api'

export default function AdminProducts(){
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name:'', price:0, category:'', image:'', description:'', countInStock:0 })

  const load = async ()=>{
    try{ const res = await API.get('/products'); setProducts(res.data) }catch(e){ console.error(e) }
  }
  useEffect(()=>{ const token = localStorage.getItem('token'); if(token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`; load() },[])

  const create = async ()=>{
    try{ const res = await API.post('/products', form); setForm({ name:'', price:0, category:'', image:'', description:'', countInStock:0 }); load() }catch(e){ alert(e.response?.data?.message || 'Create failed') }
  }
  const remove = async (id)=>{ if(!confirm('Delete product?')) return; try{ await API.delete(`/products/${id}`); load() }catch(e){ alert('Delete failed') } }

  return (
    <div>
      <h3>Products</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:12}}>
        <div>
          <table className="table"><thead><tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr></thead><tbody>
            {products.map(p=> (<tr key={p._id}><td>{p.name}</td><td>${p.price.toFixed(2)}</td><td>{p.countInStock}</td><td><button onClick={()=>remove(p._id)}>Delete</button></td></tr>))}
          </tbody></table>
        </div>
        <div className="card">
          <h4>Create Product</h4>
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input className="input" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} />
          <input className="input" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
          <input className="input" placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} />
          <input className="input" placeholder="Stock" value={form.countInStock} onChange={e=>setForm({...form,countInStock:Number(e.target.value)})} />
          <textarea className="input" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <button className="button" onClick={create}>Create</button>
        </div>
      </div>
    </div>
  )
}
