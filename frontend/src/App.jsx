import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import AdminDashboard from './pages/AdminDashboard'
import { getUserFromToken } from './services/auth'

export const AuthContext = React.createContext()

function App(){
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')||'[]'))
  const navigate = useNavigate()

  useEffect(()=>{
    const loadProfile = async ()=>{
      const token = localStorage.getItem('token')
      if(!token) return
      try{
        // fetch profile to get accurate name/role
        const API = (await import('./services/api')).default
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const res = await API.get('/auth/profile')
        setUser(res.data)
      }catch(err){ console.error('Profile load failed') }
    }
    loadProfile()
  },[])

  useEffect(()=> localStorage.setItem('cart', JSON.stringify(cart)),[cart])

  const addToCart = (product, qty=1) => {
    setCart(prev=>{
      const exist = prev.find(i=>i.product===product._id)
      if(exist) return prev.map(i=> i.product===product._id ? {...i, qty: Math.min(product.countInStock, i.qty+qty)} : i)
      return [...prev, { product: product._id, name: product.name, price: product.price, image: product.image, qty }]
    })
  }

  const updateQty = (productId, qty) => setCart(prev=> prev.map(i=> i.product===productId ? {...i, qty} : i))
  const removeFromCart = (productId) => setCart(prev=> prev.filter(i=> i.product!==productId))
  const clearCart = () => setCart([])

  const logout = ()=>{ localStorage.removeItem('token'); setUser(null); navigate('/login') }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="header">
        <div className="container nav">
          <div style={{display:'flex', alignItems:'center'}}>
            <Link to='/' className="brand">Shoply</Link>
          </div>
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <Link to="/cart">Cart <span className="cart-count">{cart.reduce((s,i)=>s+i.qty,0)}</span></Link>
            {user ? (
              <>
                <span className="small">Hello, {user.name}</span>
                <button className="button" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            {user && user.role==='admin' && <Link to="/admin">Admin</Link>}
          </div>
        </div>
      </div>
      <div className="container" style={{paddingTop:20}}>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} clearCart={clearCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/product/*" element={<Home />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  )
}

export default App
