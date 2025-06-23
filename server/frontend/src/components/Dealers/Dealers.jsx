import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch('http://127.0.0.1:8000/api/dealers/')  // <- Make sure this matches your Django route
    .then((res) => res.json())
    .then((data) => {
      setDealers(data); // Match this to your Django JSON format
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching dealers:", err);
      setLoading(false);
    });
}, []);

  return (
    <>
      {/* Navigation Bar */}
      <div style={{
        backgroundColor: 'turquoise',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '20px', marginRight: '20px' }}>AutoReview</span>
          <a href="/" style={{ marginRight: '15px', color: 'black', textDecoration: 'none' }}>Home</a>
          <a href="/about" style={{ marginRight: '15px', color: 'black', textDecoration: 'none' }}>About Us</a>
          <a href="/contact" style={{ color: 'black', textDecoration: 'none' }}>Contact Us</a>
        </div>
      </div>

      {/* Dealers Table */}
      <div className="container mt-4">
        <h2 className="mb-3">Dealerships</h2>

        {loading ? (
          <p>Loading dealers...</p>
        ) : dealers.length === 0 ? (
          <p>No dealers found.</p>
        ) : (
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Dealer Name</th>
                <th>City</th>
                <th>Address</th>
                <th>Zip</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((dealer, index) => (
                <tr key={index}>
                  <td>{dealer.id}</td>
                  <td>
                    <a href={`/dealer/${dealer.id}`} style={{ color: 'blue' }}>
                      {dealer.full_name}
                    </a>
                  </td>
                  <td>{dealer.city}</td>
                  <td>{dealer.address}</td>
                  <td>{dealer.zip}</td>
                  <td>{dealer.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Dealers;
