import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'

export default function Home({ addToCart }){
  const [products, setProducts] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () =>{
    try{ setLoading(true); const res = await API.get('/products' + (q?`?q=${encodeURIComponent(q)}`:'')); setProducts(res.data); }catch(e){ console.error(e) }finally{ setLoading(false) }
  }

  useEffect(()=>{ fetchProducts() },[q])

  return (
    <div>
      <div style={{display:'flex', gap:12, marginBottom:16}}>
        <input className="input" placeholder="Search products..." value={q} onChange={e=>setQ(e.target.value)} />
        <button className="button" onClick={fetchProducts}>Search</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="products-grid">
          {products.map(p=> (
            <div key={p._id} className="card">
              <Link to={`/product/${p._id}`}><img src={p.image} alt={p.name} /></Link>
              <h4>{p.name}</h4>
              <p className="small">${p.price.toFixed(2)}</p>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <button className="button" onClick={()=>addToCart(p,1)} disabled={p.countInStock===0}>{p.countInStock===0? 'Out' : 'Add'}</button>
                <Link to={`/product/${p._id}`} className="small">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
