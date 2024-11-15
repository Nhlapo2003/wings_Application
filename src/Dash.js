import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [currentImage, setCurrentImage] = useState(0);

  const images = ["2.jpeg", "3.jpeg"]; // Paths to images

  // Rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Fetching products from MySQL database via API
  useEffect(() => {
    fetch('http://localhost:8087/products')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else setMessage("Error fetching products.");
      })
      .catch(error => setMessage("Error fetching products: " + error.message));
  }, []);

  // Prepare data for the bar chart
  const chartData = {
    labels: products.map(product => product.name),
    datasets: [
      {
        label: 'Quantity in Stock',
        data: products.map(product => product.stock),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard">
      <div className="content">
        {/* Image Slideshow */}
        <div style={{ width: '100%', height: '200px', overflow: 'hidden', marginBottom: '20px' }}>
          <img
            src={images[currentImage]}
            alt="Slideshow"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 1s ease-in-out',
            }}
          />
        </div>

        <h2>Available Products</h2>
        {message && <p className="error-message">{message}</p>}

        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <>
            {/* Display Product Data in a Table */}
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.category}</td>
                    <td>M{product.price}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bar Chart Displaying Product Quantities */}
            <div style={{ width: '80%', height: '400px', margin: '0 auto', marginTop: '20px' }}>
              <h3>Product Stock Levels</h3>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
