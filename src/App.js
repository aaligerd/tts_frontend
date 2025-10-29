import logo from './logo.svg';
import { Routes, Route } from "react-router";
import './App.css';
import Upload from './pages/Upload';
import Listen from './pages/Listen';

function App() {
  return (
    <Routes>
      <Route path="/tts/upload" element={<Upload/>} />
      <Route path="/tts/listen" element={<Listen/>} />
    </Routes> 
  )
}

export default App;
