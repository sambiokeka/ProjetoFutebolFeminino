import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Partidas from './components/Partidas';
import Layout from './components/Layout';
import Salvo from './components/Salvo';

function App() {
  return (
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Partidas />} />
    <Route path="login" element={<Login />} /> 
    <Route path="partidas" element={<Partidas />} /> 
    <Route path="register" element={<Register />} />
    <Route path="salvo" element={<Salvo />} />
  </Route>
</Routes>
  );
}

export default App;