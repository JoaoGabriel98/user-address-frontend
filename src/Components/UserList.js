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

  // Efeitos ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Atualiza o estado do termo de busca
  useEffect(() => {
    const search = getSearchParam();
    setSearchTerm(search); // Atualiza o estado do termo de busca de acordo com o parâmetro
  }, [location.search]);

  // Filtra usuários com base no nome ou na data de nascimento
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.birth_date && user.birth_date.includes(searchTerm))
  );

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <Link to="/add">Cadastrar Novo Usuário</Link>
      <div>
        <input
          type="text"
          placeholder="Buscar por nome ou Data de Nascimento"
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
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <Link to={`/edit/${user.id}`}> Editar</Link>
            <a href="#" style={{ marginLeft: '5px' }} onClick={() => handleDelete(user.id)}>Excluir</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
