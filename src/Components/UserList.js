import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  // Função para extrair o parâmetro "search" da URL
  const getSearchParam = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este usuário?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir o usuário.');
      }
    }
  };

  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const search = getSearchParam();
    setSearchTerm(search);
  }, [location.search]);

  // Filtrando usuários pelo nome, CPF e data de nascimento
  const filteredUsers = users.filter(user => {
    const formattedBirthDate = formatDate(user.date_of_birth);
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatCPF(user.cpf).includes(searchTerm) ||
      formattedBirthDate.includes(searchTerm)
    );
  });

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Usuários</h1>
      <div className="mb-3">
        <Link to="/add" className="btn btn-primary">Cadastrar Novo Usuário</Link>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nome, CPF ou Data de Nascimento"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            const params = new URLSearchParams(location.search);
            if (e.target.value) {
              params.set('search', e.target.value);
            } else {
              params.delete('search');
            }
            window.history.replaceState(null, '', `?${params.toString()}`);
          }}
        />
      </div>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{formatCPF(user.cpf)}</td>
                <td>{formatDate(user.date_of_birth)}</td>
                <td>
                  <Link to={`/edit/${user.id}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Excluir</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">Nenhum usuário encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
