import React, { useState, useEffect } from 'react';
import './sell.css';

const Cart = () => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [products, setProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Fetch products
    useEffect(() => {
        fetch('http://localhost:8087/products')
            .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! Status: ${response.status}`))
            .then(data => {
                if (Array.isArray(data)) {
                    const initialCartItems = data.map(product => ({ ...product, price: Number(product.price) || 0, quantity: 0 }));
                    setProducts(data.map(p => ({ ...p, price: Number(p.price) || 0 })));
                    setCart({ items: initialCartItems, total: 0 });
                } else {
                    setErrorMessage("Error fetching products.");
                }
            })
            .catch(error => setErrorMessage("Error fetching products: " + error.message));
    }, []);

    // Function to add an item to the cart
    const addItemToCart = () => {
        if (!selectedProduct || quantity < 1) {
            alert('Please select a product and enter a valid quantity.');
            return;
        }

        const product = products.find(p => p.id === selectedProduct);
        if (!product) {
            alert('Selected product not found.');
            return;
        }

        if (product.stock >= quantity) {
            const updatedItems = [...cart.items];
            const itemIndex = updatedItems.findIndex(item => item.name === product.name);

            if (itemIndex !== -1) {
                updatedItems[itemIndex].quantity += quantity;
            } else {
                updatedItems.push({ ...product, quantity });
            }

            setCart({
                items: updatedItems,
                total: cart.total + product.price * quantity,
            });
            setProducts(products.map(p => 
                p.id === selectedProduct ? { ...p, stock: p.stock - quantity } : p
            ));
        } else {
            alert('Insufficient stock for this quantity.');
        }
    };

    // Function to remove an item from the cart
    const removeItemFromCart = (product) => {
        const updatedItems = [...cart.items];
        const itemIndex = updatedItems.findIndex(item => item.name === product.name);

        if (itemIndex !== -1 && updatedItems[itemIndex].quantity > 0) {
            const updatedQuantity = updatedItems[itemIndex].quantity - 1;

            if (updatedQuantity === 0) {
                updatedItems.splice(itemIndex, 1);
            } else {
                updatedItems[itemIndex].quantity = updatedQuantity;
            }

            setCart({
                items: updatedItems,
                total: cart.total - product.price,
            });

            setProducts(products.map(p =>
                p.id === product.id ? { ...p, stock: p.stock + 1 } : p
            ));
        } else {
            alert('Product is not in the cart.');
        }
    };

    // Function to store sales in the database
    const handleSell = () => {
        cart.items.forEach((item) => {
            fetch('http://localhost:8087/sell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 1,
                    productId: item.id,
                    quantity: item.quantity,
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Sale failed for item ' + item.name);
                }
                return response.text();
            })
            .then((result) => {
                setMessage(result);
                setCart({ items: [], total: 0 });
            })
            .catch(error => {
                setErrorMessage("Error processing sale: " + error.message);
            });
        });
    };

    return (
        <div>
            <div className="dashboard">
                <div className="content">
                    <h2>Available Products</h2>
                    {message && <p className="error-message">{message}</p>}
                    {products.length === 0 ? (
                        <p>No products available.</p>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.category}</td>
                                        <td>M{product.price.toFixed(2)}</td>
                                        <td>
                                        {product.stock}
                                        <div 
                                            className="stock-bar" 
                                            style={{
                                                width: '50px',
                                                height: '10px',
                                                backgroundColor: 
                                                    product.stock < 5 ? 'red' : 
                                                    product.stock <= 10 ? 'yellow' : 
                                                    'green'
                                            }}
                                        />
                                    </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <h3>Your Cart</h3>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Product selection and quantity input */}
            <div>
                <label>
                    Select Product:
                    <select
                        value={selectedProduct || ''}
                        onChange={(e) => setSelectedProduct(Number(e.target.value))}
                    >
                        <option value="">Select a product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name} (Stock: {product.stock})
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </label>
                <button onClick={addItemToCart}>Add to Cart</button>
            </div>

            {cart.items.length > 0 ? (
                <>
                    <ul>
                        {cart.items.map((item, index) => (
                            <li key={index}>
                                {item.name} - {item.quantity} x M{item.price.toFixed(2)}
                                <button onClick={() => addItemToCart(item)}>+</button>
                                <button onClick={() => removeItemFromCart(item)}>-</button>
                            </li>
                        ))}
                    </ul>
                    <p><strong>Total Price:</strong> M{cart.total.toFixed(2)}</p>
                    <button onClick={handleSell}>Sell</button>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
