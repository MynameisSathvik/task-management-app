import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../services/api'

export default function ProductDetail({ addToCart }){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [qty, setQty] = useState(1)

  useEffect(()=>{ const load = async ()=>{ try{ setLoading(true); const res = await API.get(`/products/${id}`); setProduct(res.data); }catch(e){ console.error(e) }finally{ setLoading(false) } }; load() },[id])

  if(loading) return <div>Loading...</div>
  if(!product) return <div>Product not found</div>

  return (
    <div className="row">
      <div className="col">
        <img src={product.image} alt={product.name} style={{width:'100%', maxHeight:420, objectFit:'cover', borderRadius:8}} />
      </div>
      <div className="col">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className="small">Category: {product.category}</p>
        <h3>${product.price.toFixed(2)}</h3>
        <p>Stock: {product.countInStock}</p>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input type="number" min={1} max={product.countInStock} value={qty} onChange={e=>setQty(Math.max(1, Math.min(product.countInStock, Number(e.target.value))))} className="input" style={{width:100}} />
          <button className="button" onClick={()=>addToCart(product, qty)} disabled={product.countInStock===0}>Add to cart</button>
        </div>
      </div>
    </div>
  )
}
