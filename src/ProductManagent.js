import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './product.css'

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({ name: '', desc: '', category: '', price: '', stock: '' });
    const [editIndex, setEditIndex] = useState(-1);

    useEffect(() => {
        fetch('http://localhost:8087/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProduct({ ...product, [id]: value });
    };

    const addProduct = () => {
        const url = 'http://localhost:8087/products';
        
        if (!product.name || !product.price || !product.stock) {
            alert("Please fill out the Name, Price, and Stock fields.");
            return;
        }

        if (isNaN(product.price) || isNaN(product.stock)) {
            alert("Price and Stock must be numbers.");
            return;
        }

        const productData = {
            name: product.name,
            description: product.desc,
            category: product.category,
            price: parseFloat(product.price),
            stock: parseInt(product.stock)
        };

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(`HTTP error: ${response.status} - ${JSON.stringify(err)}`);
                });
            }
            return response.json();
        })
        .then(newProduct => {
            setProducts(prevProducts => [...prevProducts, newProduct]);
            setProduct({ name: '', desc: '', category: '', price: '', stock: '' });
        })
        .catch(error => {
            console.error('Error adding product:', error.message);
            alert(`Something went wrong: ${error.message}`);
        });
    };

    const updateProduct = () => {
        const url = `http://localhost:8087/products/${products[editIndex].name}`;
        
        const productData = {
            name: product.name,
            description: product.desc,
            category: product.category,
            price: parseFloat(product.price),
            stock: parseInt(product.stock)
        };

        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(`HTTP error: ${response.status} - ${JSON.stringify(err)}`);
                });
            }
            return response.json();
        })
        .then(updatedProduct => {
            setProducts(prevProducts => {
                const updatedProducts = [...prevProducts];
                updatedProducts[editIndex] = updatedProduct;
                return updatedProducts;
            });
            setEditIndex(-1);
            setProduct({ name: '', desc: '', category: '', price: '', stock: '' });
        })
        .catch(error => {
            console.error('Error updating product:', error.message);
            alert(`Something went wrong: ${error.message}`);
        });
    };

    const addOrUpdateProduct = (e) => {
        e.preventDefault();
        if (editIndex === -1) {
            addProduct();
        } else {
            updateProduct();
        }
    };

    const sellProduct = (index) => {
        const productName = products[index].name;
        fetch(`http://localhost:8087/products/sell/${productName}`, { method: 'PUT' })
            .then(response => {
                if (!response.ok) throw new Error('Error selling product');
                return response.json();
            })
            .then(updatedProduct => {
                const updatedProducts = [...products];
                updatedProducts[index] = updatedProduct;
                setProducts(updatedProducts);
            })
            .catch(error => console.error('Error selling product:', error));
    };

    const editProduct = (index) => {
        setEditIndex(index);
        setProduct({ ...products[index] });
    };

    const deleteProduct = (index) => {
        const productName = products[index].name;
        fetch(`http://localhost:8087/products/${productName}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Error deleting product');
                return response.json();
            })
            .then(() => {
                const updatedProducts = products.filter((_, i) => i !== index);
                setProducts(updatedProducts);
            })
            .catch(error => console.error('Error deleting product:', error));
    };

    return (
        <div id="product-management">
            <h2>Product Management</h2>
            <form onSubmit={addOrUpdateProduct}>
                <input type="text" id="name" placeholder="Product Name" value={product.name} onChange={handleInputChange} required />
                <input type="text" id="desc" placeholder="Description" value={product.desc} onChange={handleInputChange} />
                <input type="text" id="category" placeholder="Category" value={product.category} onChange={handleInputChange} required />
                <input type="number" id="price" placeholder="Price" value={product.price} onChange={handleInputChange} required />
                <input type="number" id="stock" placeholder="Stock" value={product.stock} onChange={handleInputChange} required />
                <button type="submit">{editIndex === -1 ? 'Add Product' : 'Update Product'}</button>
            </form>

            <h3>Product List</h3>
            <ul>
                {products.length > 0 ? (
                    products.map((prod, index) => (
                        <li key={prod.name}>
                            <span>{prod.name} - {prod.stock} in stock - M{prod.price}</span>
                            
                            <button onClick={() => editProduct(index)}>Edit</button>
                            <button onClick={() => deleteProduct(index)}>Delete</button>
                            {/* Button to navigate to the Cart page */}
                            <Link to="/home/cart">
                                <button onClick={() => sellProduct(index)} disabled={prod.stock <= 0}>Sell</button>
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No products available. Please add products first.</p>
                )}
            </ul>
        </div>
    );
};

export default ProductManagement;
