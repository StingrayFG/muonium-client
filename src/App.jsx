import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from 'pages/home/HomePage.jsx';
import LoginPage from 'pages/login/LoginPage.jsx';
import SignupPage from 'pages/signup/SignupPage.jsx';
import DrivePage from 'pages/drive/DrivePage.jsx';

import BackgroundOverlay from 'components/background/BackgroundOverlay';

export default function App () {
  return (
    <BrowserRouter>
      <BackgroundOverlay />

      <Routes>   
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route exact path='drive' element={<Navigate replace to='/drive/home' />} />

        <Route path='/drive/folder/:uuid' element={<DrivePage />} />
        <Route path='/drive/home' element={<DrivePage folderUuid={'home'}/>} />
        <Route path='/drive/trash' element={<DrivePage folderUuid={'trash'}/>} />
      </Routes> 
    </BrowserRouter>    
  );
}