import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import LoginPage from './components/auth/LoginPage.jsx';

export default class App extends React.Component {

  render(){
    return (
      <BrowserRouter>
        <Routes>   
          <Route path='/' element={<Navigate replace to='/login' />} />
          <Route path='/login' element={<LoginPage/>} />
        </Routes> 
      </BrowserRouter>    
    );
  }
}