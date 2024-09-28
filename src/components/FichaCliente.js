import React, { useState } from 'react';
import InputMask from 'react-input-mask'; // Importando a biblioteca para máscara
import './FichaCliente.css'; // CSS para a ficha

const FichaCliente = ({ client }) => {
  const [activeTab, setActiveTab] = useState('ficha');
  const [editableClient, setEditableClient] = useState({ ...client });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoEnsaio, setNovoEnsaio] = useState({ tipo: '', valor: '' });

  // Função para abrir o modal de novo ensaio
  const abrirModal = () => {
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setIsModalOpen(false);
    setNovoEnsaio({ tipo: '', valor: '' }); // Resetar o formulário
  };

  // Função para atualizar os campos do novo ensaio
  const handleNovoEnsaioChange = (e) => {
    const { name, value } = e.target;
    setNovoEnsaio({ ...novoEnsaio, [name]: value });
  };

  // Função para salvar o novo ensaio
  const handleSalvarEnsaio = () => {
    setEditableClient({
      ...editableClient,
      ensaios: [...editableClient.ensaios, novoEnsaio],
    });
    fecharModal();
  };

  // Função para salvar os dados editados da ficha do cliente
  const handleSave = () => {
    console.log('Cliente atualizado:', editableClient);
    alert('Dados do cliente salvos com sucesso!');
  };

  // Função para atualizar os dados do cliente conforme o usuário edita
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableClient({ ...editableClient, [name]: value });
  };

  // Renderizar o conteúdo da aba com base na aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'ficha':
        return (
          <div>
            <h3>Informações do Cliente</h3>
            {/* Campos editáveis */}
            <div className="input-editavel">
              <label>Nome:</label>
              <input
                type="text"
                name="name"
                value={editableClient.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-editavel">
              <label>Data de Nascimento:</label>
              <input
                type="date"
                name="dataNascimento"
                value={editableClient.dataNascimento}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-editavel">
              <label>Telefone:</label>
              <input
                type="text"
                name="phone"
                value={editableClient.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-editavel">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editableClient.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-editavel">
              <label>Endereço:</label>
              <input
                type="text"
                name="address"
                value={editableClient.address}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={handleSave} className="save-button">
              Salvar
            </button>
          </div>
        );
      case 'historicoAgendamentos':
        return (
          <div>
            <h3>Histórico de Agendamentos</h3>
            <ul>
              {editableClient.agendamentos.map((agendamento, index) => (
                <li key={index}>
                  {agendamento.data} - {agendamento.descricao} - Status: {agendamento.status}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'ensaios':
        return (
          <div>
            <h3>Ensaios</h3>
            <button onClick={abrirModal} className="add-ensaio-button">Adicionar Ensaio</button>
            <ul>
              {editableClient.ensaios.map((ensaio, index) => (
                <li key={index}>
                  {ensaio.tipo} - R$ {ensaio.valor}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'debito':
        return (
          <div>
            <h3>Débitos Pendentes</h3>
            <p>Valor pendente: R$ {editableClient.debito}</p>
            <button>Pagar agora</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ficha-cliente-container">
      <h2>{editableClient.name} ({calcularIdade(editableClient.dataNascimento)} anos)</h2>

      {/* Abas de navegação */}
      <div className="tabs">
        <button onClick={() => setActiveTab('ficha')} className={activeTab === 'ficha' ? 'active' : ''}>
          Ficha
        </button>
        <button onClick={() => setActiveTab('historicoAgendamentos')} className={activeTab === 'historicoAgendamentos' ? 'active' : ''}>
          Histórico de Agendamentos
        </button>
        <button onClick={() => setActiveTab('ensaios')} className={activeTab === 'ensaios' ? 'active' : ''}>
          Ensaios
        </button>
        <button onClick={() => setActiveTab('debito')} className={activeTab === 'debito' ? 'active' : ''}>
          Débito
        </button>
      </div>

      {/* Conteúdo da aba */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      {/* Modal para adicionar ensaios */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Adicionar Novo Ensaio</h3>
            <label>Tipo de Ensaio:</label>
            <input
              type="text"
              name="tipo"
              value={novoEnsaio.tipo}
              onChange={handleNovoEnsaioChange}
            />
            <label>Valor:</label>
            <InputMask
              mask="R$ 9999"
              name="valor"
              value={novoEnsaio.valor}
              onChange={handleNovoEnsaioChange}
            />
            <button onClick={handleSalvarEnsaio}>Salvar</button>
            <button onClick={fecharModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Função para calcular a idade
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

export default FichaCliente;
