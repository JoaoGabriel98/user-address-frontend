import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './Components/UserList';
import UserForm from './Components/UserForm';
import UserEditForm from './Components/UserEditForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/add" element={<UserForm />} />
        <Route path="/edit/:id" element={<UserEditForm />} />
      </Routes>
    </Router>
  );
};

export default App;
