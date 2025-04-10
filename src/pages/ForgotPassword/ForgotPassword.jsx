import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    phone: "+91",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handles changes for phone and password fields.
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let newValue = value;
      // Ensure the phone always starts with "+91"
      if (!newValue.startsWith("+91")) {
        newValue = "+91" + newValue.replace(/\D/g, "");
      }
      // Limit digits after +91 to 10 characters.
      const digits = newValue.slice(3);
      if (digits.length > 10) return;
      setFormData((prev) => ({ ...prev, [name]: newValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Request OTP for resetting password.
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    // Validate that new password and confirmation match.
    if (formData.newPassword !== formData.confirmNewPassword) {
      setApiError("Passwords do not match");
      return;
    }
    // Ensure that phone number has exactly 10 digits (excluding the +91 prefix).
    if (formData.phone.slice(3).length !== 10) {
      setApiError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: formData.phone,
            new_password: formData.newPassword,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setApiError(data.error || "Failed to send OTP");
      } else {
        setOtpSent(true);
        setSuccessMessage(data.message || "OTP sent successfully");
      }
    } catch (error) {
      setApiError("Error connecting to server");
    }
  };

  // Step 2: Verify OTP and complete password reset.
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify_reset_otp`,
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
        setSuccessMessage(data.message || "Password reset successfully");
        // Optionally, redirect the user to the login page after a delay.
      }
    } catch (error) {
      setApiError("Error connecting to server");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="back-to-login">
          <a href="/login">
            <i className="fas fa-arrow-left"></i> Back to Login
          </a>
        </div>
        <h2>Forgot Password</h2>
        {!otpSent ? (
          <>
            <p className="instruction-text">
              Enter your phone number along with your new password to receive an OTP.
            </p>
            <form onSubmit={handleRequestOTP}>
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
              <div className="input-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              {apiError && <p className="error-message">{apiError}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}
              <button type="submit" className="get-otp-button">
                Get OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="instruction-text">
              Enter the OTP sent to your phone number.
            </p>
            <form onSubmit={handleVerifyOTP}>
              <div className="input-group">
                <label htmlFor="otp">OTP</label>
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter OTP"
                  required
                />
              </div>
              {apiError && <p className="error-message">{apiError}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}
              <button type="submit" className="get-otp-button">
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
