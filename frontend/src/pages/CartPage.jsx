import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function CartPage({ cart, updateQty, removeFromCart, clearCart }){
  const navigate = useNavigate()
  const total = cart.reduce((s,i)=>s + i.price * i.qty, 0)

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length===0 ? (
        <div className="notice">Your cart is empty. <Link to="/">Continue shopping</Link></div>
      ) : (
        <div>
          <table className="table">
            <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th></th></tr></thead>
            <tbody>
              {cart.map(i=> (
                <tr key={i.product}>
                  <td style={{display:'flex',alignItems:'center',gap:8}}><img src={i.image} alt={i.name} style={{width:60,height:40,objectFit:'cover'}} />{i.name}</td>
                  <td><input type="number" min={1} value={i.qty} onChange={e=> updateQty(i.product, Math.max(1, Number(e.target.value)))} style={{width:80}} /></td>
                  <td>${(i.price*i.qty).toFixed(2)}</td>
                  <td><button onClick={()=>removeFromCart(i.product)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: ${total.toFixed(2)}</h3>
          <div style={{display:'flex', gap:8}}>
            <button className="button" onClick={()=>navigate('/checkout')}>Checkout</button>
            <button onClick={()=>clearCart()}>Clear Cart</button>
          </div>
        </div>
      )}
    </div>
  )
}
