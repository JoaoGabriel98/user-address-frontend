import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserForm = () => {
  const history = useNavigate();
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    cpf: '',
    date_of_birth: '',
    addresses_attributes: []
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateCpf = (cpf) => {
    // Remove qualquer caractere não numérico
    const cleanedCpf = cpf.replace(/\D/g, '');

    if (cleanedCpf.length !== 11) return false;

    // Verifica se todos os números são iguais
    const allDigitsSame = cleanedCpf.split('').every(digit => digit === cleanedCpf[0]);
    if (allDigitsSame) return false;

    // Verifica o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedCpf[i]) * (10 - i);
    }
    let firstCheckDigit = (sum * 10) % 11;
    if (firstCheckDigit === 10 || firstCheckDigit === 11) firstCheckDigit = 0;

    if (firstCheckDigit !== parseInt(cleanedCpf[9])) return false;

    // Verifica o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedCpf[i]) * (11 - i);
    }
    let secondCheckDigit = (sum * 10) % 11;
    if (secondCheckDigit === 10 || secondCheckDigit === 11) secondCheckDigit = 0;

    return secondCheckDigit === parseInt(cleanedCpf[10]);
  };

  const formatCpf = (value) => {
    // Remove qualquer caractere não numérico
    value = value.replace(/\D/g, '');
    
    // Aplica a máscara: 000.000.000-00
    return value.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{2})$/, '$1-$2');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setUserData({ ...userData, [name]: formatCpf(value) });
    } else {
      setUserData({ ...userData, [name]: value });
    }
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

  const removeAddress = (index) => {
    const newAddresses = userData.addresses_attributes.filter((_, i) => i !== index);
    setUserData({ ...userData, addresses_attributes: newAddresses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowToast(false); // Resetar o estado do toast antes de validar

    // Remove a máscara antes de validação e envio
    const cpfWithoutMask = userData.cpf.replace(/\D/g, '');
    if (!validateEmail(userData.email)) {
      setError('Email inválido.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      return;
    }
    
    if (!validateCpf(cpfWithoutMask)) {
      setError('CPF inválido.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      return;
    }

    // Atualiza o campo CPF na estrutura de dados
    const userDataToSend = {
      ...userData,
      cpf: cpfWithoutMask, // Substitui CPF formatado por CPF sem máscara
    };

    try {
      await axios.post('http://localhost:3000/users', userDataToSend);
      alert('Usuário adicionado com sucesso!');

      setUserData({
        name: '',
        email: '',
        cpf: '',
        date_of_birth: '',
        addresses_attributes: []
      });

      history('/');
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      setError('Erro ao adicionar usuário. Verifique os dados!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Cadastrar Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <input 
              type="text"
              className="form-control"
              name="name" 
              value={userData.name}
              onChange={handleChange}
              placeholder="Nome"
              required
            />
          </div>
          <div className="col">
            <input 
              type="email"
              className="form-control"
              name="email" 
              value={userData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input 
              type="text"
              className="form-control"
              name="cpf" 
              value={userData.cpf}
              onChange={handleChange}
              placeholder="CPF"
              required
              maxLength="14" // Com a máscara, o máximo é 14 (11 dígitos + 3 caracteres)
            />
          </div>
          <div className="col">
            <input 
              type="date"
              className="form-control"
              name="date_of_birth"
              value={userData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h4 className="mb-3">Endereços</h4>
        <button type="button" style={{ marginTop: '15px', marginRight: '5px' }} className="btn btn-secondary mb-3" onClick={addAddress}>
          Adicionar Endereço
        </button>
        {userData.addresses_attributes.length > 0 && userData.addresses_attributes.map((address, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <div className="row mb-3">
              <div className="col">
                <input 
                  type="text"
                  className="form-control"
                  name="street" 
                  value={address.street}
                  onChange={(e) => handleAddressChange(index, e)}
                  placeholder="Rua"
                />
              </div>
              <div className="col">
                <input 
                  type="text"
                  className="form-control"
                  name="city" 
                  value={address.city}
                  onChange={(e) => handleAddressChange(index, e)}
                  placeholder="Cidade"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <input 
                  type="text"
                  className="form-control"
                  name="state" 
                  value={address.state}
                  onChange={(e) => handleAddressChange(index, e)}
                  placeholder="Estado"
                />
              </div>
              <div className="col">
                <input 
                  type="text"
                  className="form-control"
                  name="zip" 
                  value={address.zip}
                  onChange={(e) => handleAddressChange(index, e)}
                  placeholder="CEP"
                  maxLength="8"
                />
              </div>
            </div>
            <button type="button" className="btn btn-danger" onClick={() => removeAddress(index)}>
              Remover Endereço
            </button>
          </div>
        ))}

        <button type="submit" className="btn btn-primary">Cadastrar Usuário</button>
      </form>

      {showToast && (
        <div className="toast show" style={{ position: 'absolute', top: '20%', right: '20%', zIndex: 1050 }}>
          <div className="toast-header">
            <strong className="me-auto">Erro</strong>
            <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
          </div>
          <div className="toast-body">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserForm;
