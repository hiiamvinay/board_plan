import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import { UserProvider } from "./context/UserContext";
import { AdminProvider } from "./context/AdminContext";
import './App.css'
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminProtectedRoute from "./context/AdminProtectedRoute";
import Home from "./pages/Home/Home";
import GenerateSale from "./pages/GenerateSale/GenerateSale";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Dashboard from "./pages/Dashboard/Dashboard";
import Landing from "./pages/Landing/Landing";
import User from "./pages/Users/User";



function App() {
  return (
    <UserProvider>
      <AdminProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/dashboard" element={
              <AdminProtectedRoute>
                <Dashboard/>
              </AdminProtectedRoute>
            } />

           <Route path="/users" element={<User/>} />  
              
            
            <Route path="/home" element={
                <ProtectedRoute>
                  <Home/>
                </ProtectedRoute>
              }
            />

            <Route path="/sell" element={
                <ProtectedRoute>
                  <GenerateSale/>
                </ProtectedRoute>
              }
            />
            <Route path="/admin-login" element={<AdminLogin/>} />
          </Routes>
        </Router>
      </AdminProvider>
    </UserProvider>
  )
}

export default App