import React from 'react'
import ProductGrid from './components/ProductGrid'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Catalog</h1>
        <p>Browse our collection of products</p>
      </header>
      <main className="app-main">
        <ProductGrid />
      </main>
    </div>
  )
}

export default App
