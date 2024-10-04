import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Verify from './pages/Verify'
import axios from 'axios'



axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8080'

function App(){
  return (
    <Routes>
      <Route path='/' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/verify/:id' element={<Verify />} />
    </Routes>
  )
}

export default App

