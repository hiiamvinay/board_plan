import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Login.css";
import Logo from "../../assets/logo.jpg"; // Adjust the path as necessary

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { userId, setUserId } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    
    console.log("Request body:", { phone_number: `+91${phone}`, password }),
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: `+91${phone}`, password }),
        
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        
        setUserId(data.user_id);
        // You might want to store the user ID in localStorage for persistence
        localStorage.setItem('userId', data.user_id);
        // Redirect to home page or dashboard
        console.log("userid", userId);
        navigate('/home');
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhone(value);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="admin-link">
          <a href="/admin-login">Admin Login</a>
        </div>
        {/* <h2>Koupan Kart - Login</h2> */}
        <img src={Logo} alt="Logo" className="logo" />
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="phone-input-container">
              <span className="country-code">+91</span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                maxLength="10"
                required
              />
            </div>
            {phone && <span className="input-info">{`${phone.length}/10`}</span>}
          </div>
          <div className="input-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button 
                type="button"
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </button>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="password-options">
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="login-button">Login</button>
          <div className="signup-link">
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;