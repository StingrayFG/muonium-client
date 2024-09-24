import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from 'pages/home/HomePage.jsx';
import LoginPage from 'pages/login/LoginPage.jsx';
import SignupPage from 'pages/signup/SignupPage.jsx';
import DrivePage from 'pages/drive/DrivePage.jsx';
import FolderPage from 'pages/drive/folder/FolderPage.jsx';

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
        <Route path='/drive' element={<DrivePage />}>
          <Route path='folder/:uuid' element={<FolderPage />} />
          <Route path='home' element={<FolderPage folderUuid={'home'}/>} />
          <Route path='trash' element={<FolderPage folderUuid={'trash'}/>} />
        </Route>
      </Routes> 
    </BrowserRouter>    
  );
}