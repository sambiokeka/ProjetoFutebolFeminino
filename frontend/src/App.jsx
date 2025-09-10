import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Partidas from './components/Partidas';
import SavedMatches from './components/SavedMatches';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Partidas />} />
        <Route path="login" element={<Login />} /> 
        <Route path="register" element={<Register />} />
        <Route path="saved-matches" element={<SavedMatches />} />
      </Route>
    </Routes>
  );
}

export default App;