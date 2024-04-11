import React, { useState, useEffect } from 'react';
import './App.css';
import CartDialog from './CartDialog';

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [allData, setAllData] = useState([]);
  const [showCartDialog, setShowCartDialog] = useState(false);

  useEffect(() => {
    fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
      .then(response => response.json())
      .then(data => {
        setAllData(data); // Store fetched data in allData state
        const products = data.categories.flatMap(category => category.category_products);
        setItems(products);
        setFilteredItems(products);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const handleCategoryFilter = (category) => {
    if (category === 'All') {
      setFilteredItems(items);
    } else {
      // Filter items based on category from allData
      const filtered = allData.categories.find(item => item.category_name === category); 
      setFilteredItems(filtered ? filtered.category_products : []);
    }
    setActiveCategory(category);
  };

  const filterItems = () => {
    const filtered = items.filter(item =>
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.vendor && item.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    filterItems();
  };

  const addToCart = itemId => {
    const selectedItem = items.find(item => item.id === itemId);
    if (selectedItem) {
      setCartItems([...cartItems, selectedItem]);
    }
  };

  const handleOpenCartDialog = () => {
    setShowCartDialog(true);
  };

  const handleCloseCartDialog = () => {
    setShowCartDialog(false);
  };

  
  return (
    <div className="App">
      <h1>Our Products!</h1>
      <div className="buttons">
        <button onClick={() => handleCategoryFilter('Men')} className={activeCategory === 'Men' ? 'active' : ''}>Men</button>
        <button onClick={() => handleCategoryFilter('Women')} className={activeCategory === 'Women' ? 'active' : ''}>Women</button>
        <button onClick={() => handleCategoryFilter('Kids')} className={activeCategory === 'Kids' ? 'active' : ''}>Children</button>
        <button onClick={() => handleCategoryFilter('All')} className={activeCategory === 'All' ? 'active' : ''}>All</button>
        <div className="cart-button">
          <button onClick={handleOpenCartDialog}>Cart ({cartItems.length})</button>
        </div>
      </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={filterItems}>Search</button>
        </div>
      
      <div className="items">
        {filteredItems.map(item => (
          <div key={item.id} className="item">
            <img src={item.image} alt={item.title} />
            <p>{item.title}</p>
            <p>Rs.{item.price}</p>
            <p>{item.badge}</p>
            <p>{item.vendor}</p>
            <button onClick={() => addToCart(item.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
      {showCartDialog && <CartDialog cartItems={cartItems} onClose={handleCloseCartDialog} />}
    </div>
  );
}

export default App;
