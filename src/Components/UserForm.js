import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserForm = () => {
  const history = useNavigate();
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    cpf: '',
    date_of_birth: '',
    addresses_attributes: [{ street: '', city: '', state: '', zip: '' }]
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateCpf = (cpf) => {
    const re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
    return re.test(String(cpf));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const newAddresses = [...userData.addresses_attributes];
    newAddresses[index] = { ...newAddresses[index], [name]: value };
    setUserData({ ...userData, addresses_attributes: newAddresses });
  };

  const addAddress = () => {
    setUserData({
      ...userData,
      addresses_attributes: [...userData.addresses_attributes, { street: '', city: '', state: '', zip: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!validateEmail(userData.email)) {
      setError('Email inválido.');
      return;
    }
    
    if (!validateCpf(userData.cpf)) {
      setError('CPF inválido.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/users', userData);
      alert('Usuário adicionado com sucesso!');

      setUserData({
        name: '',
        email: '',
        cpf: '',
        date_of_birth: '',
        addresses_attributes: [{ street: '', city: '', state: '', zip: '' }]
      });

      history('/');
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      alert('Erro ao adicionar usuário. Verifique os dados!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        name="name" 
        value={userData.name}
        onChange={handleChange}
        placeholder="Nome"
        required
      />
      <input 
        type="email"
        name="email" 
        value={userData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input 
        type="text"
        name="cpf" 
        value={userData.cpf}
        onChange={handleChange}
        placeholder="CPF"
        required
        maxLength="11"
      />
      <input 
        type="date"
        name="date_of_birth" 
        value={userData.date_of_birth}
        onChange={handleChange}
        required
      />


      <h4>Address</h4>
      {userData.addresses_attributes.map((address, index) => (
        <div key={index}>
          <input 
            type="text"
            name="street" 
            value={address.street}
            onChange={(e) => handleAddressChange(index, e)}
            placeholder="Rua"
            required
          />
          <input 
            type="text"
            name="city" 
            value={address.city}
            onChange={(e) => handleAddressChange(index, e)}
            placeholder="Cidade"
            required
          />
          <input 
            type="text"
            name="state" 
            value={address.state}
            onChange={(e) => handleAddressChange(index, e)}
            placeholder="Estado"
            required
          />
          <input 
            type="text"
            name="zip" 
            value={address.zip}
            onChange={(e) => handleAddressChange(index, e)}
            placeholder="CEP"
            maxLength="8"
            required
          />
        </div>
      ))}

      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="button" onClick={addAddress}>Adicionar Endereço</button>
      <button type="submit">Cadastrar Usuário</button>
    </form>
  );
};

export default UserForm;
