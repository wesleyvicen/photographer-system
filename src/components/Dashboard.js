import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';  // Estilos personalizados para o dashboard

const Dashboard = () => {
  const [agendamentos, setAgendamentos] = useState(0);
  const [aniversariantes, setAniversariantes] = useState([]);
  const [proximosAniversariantes, setProximosAniversariantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fazer as chamadas para o backend para buscar dados de agendamentos e aniversariantes
    // setAgendamentos, setAniversariantes e setProximosAniversariantes
  }, []);

  const handleAgendamentoClick = () => {
    // Redireciona para a tela de agendamento
    navigate('/agendamento');
  };

  return (
    <div className="dashboard-container">
      {/* Botão de Busca */}
      <div className="search-container">
        <input type="text" placeholder="Buscar cliente..." className="search-input" />
      </div>

      {/* Quadrado de Agendamentos (clicável) */}
      <div className="agendamentos-container">
        <h2>Agendamentos do Dia</h2>
        <div className="agendamentos-count" onClick={handleAgendamentoClick}>
          <p>{agendamentos} agendamentos hoje</p>
        </div>
      </div>

      {/* Quadrados de Aniversariantes */}
      <div className="aniversariantes-container">
        {/* Aniversariantes do Dia */}
        <div className="aniversariantes-dia">
          <h3>Aniversariantes do Dia</h3>
          <ul>
            {aniversariantes.map((aniversariante, index) => (
              <li key={index}>
                {aniversariante.name} ({aniversariante.age} anos)
                <button onClick={() => enviarMensagemWhatsApp(aniversariante)}>WhatsApp</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Próximos Aniversariantes */}
        <div className="proximos-aniversariantes">
          <h3>Próximos Aniversariantes</h3>
          <ul>
            {proximosAniversariantes.map((aniversariante, index) => (
              <li key={index}>
                {aniversariante.name} ({aniversariante.age} anos)
                <button onClick={() => enviarMensagemWhatsApp(aniversariante)}>WhatsApp</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const enviarMensagemWhatsApp = (aniversariante) => {
  const mensagem = `Olá ${aniversariante.name}, feliz aniversário! Que tal celebrar com uma sessão fotográfica?`;
  const url = `https://wa.me/55${aniversariante.phone}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
};

export default Dashboard;
