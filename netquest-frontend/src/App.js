import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'
import PrivateRoute from './components/misc/PrivateRoute'
import Navbar from './components/misc/Navbar'
import Home from './components/home/Home'
import Login from './components/home/Login'
import Signup from './components/home/Signup'
import AdminPage from './components/admin/AdminPage'
import WifiMapPage from './components/wifiMapPage/WifiMapPage'
import DeleteAccount from './components/delete/DeleteAccount'
import EditAccount from './components/edit/EditAccount'
import WifiSpotFilter from './components/wifiSpotFilter/WifiSpotFilter';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PointsEarnTransaction from './components/pointsearntransaction/PointsEarnTransaction'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/adminpage" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/wifispot" element={<PrivateRoute><WifiMapPage /></PrivateRoute>} />
          <Route path="/wifispotfilterpage" element={<PrivateRoute><WifiSpotFilter /></PrivateRoute>} />
          <Route path="/edit-account" element={<PrivateRoute><EditAccount /></PrivateRoute>} />
          <Route path="/delete-account" element={<PrivateRoute><DeleteAccount /></PrivateRoute>} />
          <Route path="/pointsearntransaction" element={<PrivateRoute><PointsEarnTransaction /></PrivateRoute>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer/>
    </AuthProvider>
  )
}

export default App
