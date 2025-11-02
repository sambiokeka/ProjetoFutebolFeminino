import { createBrowserRouter } from "react-router-dom";
import Login from '../pages/Login';
import Register from '../pages/Register';
import Partidas from '../pages/Partidas';
import App from '../App';
import Salvo from '../pages/Salvo';
import PrivateRoute from '../components/PrivateRoute'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Partidas/>
            },

            {
                path: 'login', 
                element: <Login/>
            },
            {
                path: 'register',
                 element: <Register/>
            },
            {
                path: 'partidas',
                element: <Partidas/>
            },
            {
                path: 'salvo',
                 element:<PrivateRoute><Salvo/></PrivateRoute>
                }
        ]
    }

])

