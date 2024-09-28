import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Agendamento from './components/Agendamento';
import Login from './components/Login';
import FichaCliente from './components/FichaCliente'; // Importando o componente da Ficha do Cliente

// Função para calcular a idade com base na data de nascimento
const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

// Atualizando o cliente para incluir a data de nascimento
const client = {
  name: 'João Silva',
  dataNascimento: '1988-05-10', // Data de nascimento no formato yyyy-mm-dd
  phone: '(11) 98765-4321',
  email: 'joao.silva@email.com',
  address: 'Rua das Flores, 123, São Paulo, SP',
  agendamentos: [
    { data: '24/09/2024', descricao: 'Ensaio fotográfico - Casamento', status: 'Confirmado' },
    { data: '15/08/2024', descricao: 'Ensaio fotográfico - Pré-aniversário', status: 'Realizado' },
  ],
  ensaios: [
    { data: '10/06/2024', descricao: 'Ensaio fotográfico de casamento' },
  ],
  debito: 350.00,
};

// Atualizando o App para calcular a idade
function App() {
  const idade = calcularIdade(client.dataNascimento);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agendamento" element={<Agendamento />} />
        {/* Alterando o caminho para /cliente */}
        <Route path="/cliente" element={<FichaCliente client={{ ...client, idade }} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
