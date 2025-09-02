import React from 'react';
import Header from './components/Header';
import RegisterForm from './components/RegisterForm';
import Footer from './components/Footer';
//import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;