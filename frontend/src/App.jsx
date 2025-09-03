import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Partidas from './components/Partidas';
import Layout from './components/Layout';

function App() {
  return (
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Login />} />
    <Route path="partidas" element={<Partidas />} /> 
    <Route path="register" element={<Register />} />
  </Route>
</Routes>
  );
}

export default App;