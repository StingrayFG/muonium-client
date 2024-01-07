import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import DrivePanels from 'components/drive/layout/DrivePanels.jsx';
import FolderPage from 'components/drive/main/FolderPage.jsx';

import LoginPage from 'components/auth/LoginPage.jsx';
import SignupPage from 'components/auth/SignupPage.jsx';

export default function App () {
  return (
    <BrowserRouter>
      <Routes>   
        <Route path='/' element={<Navigate replace to='/drive/home' />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route exact path='drive' element={<Navigate replace to='/drive/home' />} />
        <Route path='/drive' element={<DrivePanels />}>
          <Route path='folder/:id' element={<FolderPage />} />
          <Route path='home' element={<FolderPage address={'root'}/>} />
          <Route path='trash' element={<FolderPage address={'trash'}/>} />
        </Route>
      </Routes> 
    </BrowserRouter>    
  );
}