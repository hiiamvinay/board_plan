import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "+91",
    password: "",
    confirmPassword: "",
  });
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Ensure the phone number always starts with "+91"
      let newValue = value;
      if (!newValue.startsWith("+91")) {
        // Remove any non-digit characters and append to +91
        newValue = "+91" + newValue.replace(/\D/g, "");
      }
      // Limit digits after +91 to 10 characters
      const digits = newValue.slice(3);
      if (digits.length > 10) return;
      
      setFormData((prev) => ({ ...prev, [name]: newValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check if passwords match when either password field changes
    if (name === "password" || name === "confirmPassword") {
      if (name === "password" && formData.confirmPassword) {
        validatePasswords(value, formData.confirmPassword);
      } else if (name === "confirmPassword") {
        validatePasswords(formData.password, value);
      }
    }
  };

  const validatePasswords = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  // Handle registration API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone_number: formData.phone,
            password: formData.password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setApiError(data.error || "Registration failed");
      } else {
        setOtpSent(true);
        setSuccessMessage(data.message || "OTP sent successfully");
      }
    } catch (error) {
      setApiError("Error connecting to server");
    }
  };

  // Handle OTP verification API call
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify_otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: formData.phone,
            otp: parseInt(otp, 10),
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setApiError(data.error || "OTP Verification failed");
      } else {
        setSuccessMessage(data.message || "User created successfully, Please Login");
        await sleep(1000);
        navigate("/login");
        
        
      }
    } catch (error) {
      setApiError("Error connecting to server");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Koupan Kart - Sign Up</h2>
        {!otpSent ? (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                maxLength="13"
                required
              />
              {formData.phone && (
                <span className="input-info">{`${formData.phone.slice(3).length}/10`}</span>
              )}
            </div>

            <div className="input-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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

            <div className="input-group password-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
                <button 
                  type="button"
                  className="toggle-password" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
              </div>
              {passwordError && <span className="error-message">{passwordError}</span>}
            </div>

            {apiError && <p className="error-message">{apiError}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <button type="submit" className="signup-button">Sign Up</button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="input-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                id="otp"
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>
            {apiError && <p className="error-message">{apiError}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <button type="submit" className="signup-button">Verify OTP</button>
          </form>
        )}
        <div className="links">
          <a href="/login" className="link">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
