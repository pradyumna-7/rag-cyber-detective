import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import axios from 'axios'



axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

function App(){
  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  )
}

export default App

