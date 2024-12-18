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
import WifiSpotsCreated from "./components/wifispostscreated/WifiSpotsCreated";
import WifiSpotVisitHistory from "./components/wifiSpotVisitHistory/WifiSpotVisitHistory";
import ReviewHistory from "./components/review/ReviewHistory";


function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/adminpage" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/wifispot" element={<PrivateRoute><WifiMapPage /></PrivateRoute>} />
          <Route path="/wifispotfilterpage" element={<PrivateRoute><WifiSpotFilter /></PrivateRoute>} />
          <Route path="/wifispots-created" element={<PrivateRoute><WifiSpotsCreated /></PrivateRoute>} />
          <Route path="/edit-account" element={<PrivateRoute><EditAccount /></PrivateRoute>} />
          <Route path="/delete-account" element={<PrivateRoute><DeleteAccount /></PrivateRoute>} />
          <Route path="/pointsearntransaction" element={<PrivateRoute><PointsEarnTransaction /></PrivateRoute>} />
          <Route path="/visited-locations" element={<PrivateRoute><WifiSpotVisitHistory /></PrivateRoute>} />
          <Route path="/my-reviews" element={<PrivateRoute><ReviewHistory /></PrivateRoute>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Navbar>
      <ToastContainer />
    </Router>
  </AuthProvider>
  )
}

export default App
