import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

const Footer = () => (
  <footer
    style={{
      background: "#181818",
      color: "#fff",
      padding: "32px 24px 16px 24px",
      margin: "0", // Remove margin
      borderRadius: "0", // Remove border radius
      width: "100%",
      boxSizing: "border-box",
      marginTop: "40px"
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: "1400px", margin: "0 auto" }}>
      <div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ fontWeight: "bold", marginBottom: "10px" }}>About PC Express™</li>
          <li style={{ fontWeight: "bold", marginBottom: "10px" }}>Popular Categories</li>
          <li style={{ fontWeight: "bold", marginBottom: "10px" }}>More Services</li>
          <li style={{ fontWeight: "bold", marginBottom: "10px" }}>Partner with Us</li>
          <li style={{ fontWeight: "bold", marginBottom: "10px" }}>About Us</li>
        </ul>
        <div style={{ marginTop: "24px", fontSize: "0.95rem" }}>
          Privacy Policy &nbsp; Terms of Use* &nbsp; Accessibility &nbsp; WON'T BE BEAT®*<br />
          <span style={{ fontSize: "0.85rem" }}>© Loblaws Inc. All Rights Reserved</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", fontSize: "2rem" }}>
        <FaInstagram />
        <FaTwitter />
        <FaFacebook />
      </div>
    </div>
  </footer>
);

export default Footer;