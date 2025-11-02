import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'; 
import { router } from './routes/AppRoutes';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider> 
        <RouterProvider router={router} />
      </AuthProvider>
  </React.StrictMode>
);