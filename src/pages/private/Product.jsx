const Product = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Product Page</h2>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>This is a protected page - only accessible after login</p>
        <p style={{ color: "#999", marginTop: "2rem" }}>Explore our products here...</p>
      </div>
    </div>
  );
};

export default Product;
