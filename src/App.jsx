import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import LoginPage from 'components/auth/LoginPage.jsx';

export default function App () {

  return (
    <BrowserRouter>
      <Routes>   
        <Route path='/' element={<Navigate replace to='/drive' />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes> 
    </BrowserRouter>    
  );
}