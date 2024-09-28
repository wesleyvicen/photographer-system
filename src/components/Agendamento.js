import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Para navegação
import './Agendamento.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

Modal.setAppElement('#root');

const Agendamento = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ description: '', start: new Date(), end: new Date(), status: 'a confirmar' });
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento selecionado
  const [contextMenu, setContextMenu] = useState(null); // Para o menu de contexto

  const navigate = useNavigate(); // Hook para navegar entre rotas

  // Simulação de lista de clientes
  useEffect(() => {
    setClients([
      { name: 'João Silva', phone: '(11) 98765-4321' },
      { name: 'Maria Oliveira', phone: '(21) 99876-1234' },
      { name: 'Carlos Santos', phone: '(31) 91234-5678' },
    ]);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(results);
    } else {
      setFilteredClients([]);
    }
  }, [searchTerm, clients]);

  // Função para abrir o modal ao selecionar um horário na agenda
  const handleSlotSelect = (slotInfo) => {
    setNewEvent({
      ...newEvent,
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setIsModalOpen(true);
  };

  // Função para fechar o modal e adicionar o evento
  const handleAddEvent = () => {
    if (!selectedClient) {
      alert('Selecione um cliente!');
      return;
    }
    const updatedEvent = {
      ...newEvent,
      client: selectedClient.name,
      phone: selectedClient.phone,
      title: `${selectedClient.name} - ${newEvent.description}`, // Formata o título como Cliente - Descrição
    };
    setEvents([...events, updatedEvent]);
    setIsModalOpen(false);
    setSearchTerm('');
    setSelectedClient(null);
    resetNewEvent(); // Reseta os campos após adicionar
  };

  // Função para resetar os campos do novo agendamento
  const resetNewEvent = () => {
    setNewEvent({
      description: '',
      start: new Date(),
      end: new Date(),
      status: 'a confirmar',
    });
  };

  // Função para abrir o modal com os detalhes do evento
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Função para abrir o menu de contexto (botão direito do mouse)
  const handleContextMenu = (e, event) => {
    e.preventDefault();
    setSelectedEvent(event);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Fechar o menu de contexto ao clicar fora
  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  // Função para alterar o status no menu de contexto
  const handleChangeStatusContext = (status) => {
    const updatedEvents = events.map((evt) =>
      evt === selectedEvent ? { ...evt, status } : evt
    );
    setEvents(updatedEvents);
    setContextMenu(null); // Fecha o menu de contexto
  };

  // Função para alterar o status dentro do modal
  const handleStatusChangeModal = (e) => {
    const updatedEvents = events.map((evt) =>
      evt === selectedEvent ? { ...evt, status: e.target.value } : evt
    );
    setEvents(updatedEvents);
    setSelectedEvent({ ...selectedEvent, status: e.target.value }); // Atualiza o estado do evento selecionado
  };

  // Função para alterar o horário de início e término no modal
  const handleTimeChange = (field, value) => {
    const updatedEvents = events.map((evt) =>
      evt === selectedEvent ? { ...evt, [field]: new Date(value) } : evt
    );
    setEvents(updatedEvents);
    setSelectedEvent({ ...selectedEvent, [field]: new Date(value) });
  };

  // Função para abrir o WhatsApp com a mensagem pré-formatada
  const handleWhatsAppClick = (phone, clientName) => {
    const whatsappMessage = `Olá ${clientName}, tudo bem? Queremos confirmar o seu agendamento para ${moment(selectedEvent.start).format('DD/MM/YYYY - HH:mm')}.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  // Função para redirecionar para a ficha do cliente ao clicar no nome
  const handleClientClick = (client) => {
    navigate('/cliente', { state: { client } }); // Passa o cliente para a rota /cliente
  };

  // Função para mover o evento arrastando-o
  const moveEvent = ({ event, start, end }) => {
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event ? { ...existingEvent, start, end } : existingEvent
    );
    setEvents(updatedEvents);
  };

  // Função para redimensionar o evento
  const resizeEvent = ({ event, start, end }) => {
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event ? { ...existingEvent, start, end } : existingEvent
    );
    setEvents(updatedEvents);
  };

  // Define as cores dos agendamentos de acordo com o status
  const getEventStyle = (event) => {
    let backgroundColor = '#3174ad'; // Default color
    if (event.status === 'a confirmar') backgroundColor = '#FFD700'; // Amarelo
    if (event.status === 'confirmado') backgroundColor = '#32CD32'; // Verde
    if (event.status === 'desmarcado') backgroundColor = '#FF4500'; // Vermelho

    return { style: { backgroundColor } };
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="agendamento-container" onClick={handleContextMenuClose} onContextMenu={(e) => e.preventDefault()}>
        {/* Campo de Busca */}
        <div className="search-container">
          <input type="text" placeholder="Buscar cliente..." />
        </div>

        <div className="content-container">
          {/* DatePicker à esquerda */}
          <div className="datepicker-container">
            <h3>Selecione uma data</h3>
            <DatePicker selected={selectedDate} onChange={setSelectedDate} inline />
          </div>

          {/* Calendário à direita */}
          <div className="calendar-container">
            <div className="view-options">
              {/* Botões manuais para alternar entre as visualizações */}
              <button onClick={() => setView('day')}>1 Dia</button>
              <button onClick={() => setView('week')}>1 Semana</button>
              <button onClick={() => setView('agenda')}>Agenda</button>
            </div>

            <h3>Agendamentos</h3>
            <DnDCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              selectable
              view={view}
              onView={setView}
              views={['day', 'week', 'agenda']}
              date={selectedDate}
              onNavigate={(date) => setSelectedDate(date)}
              onSelectSlot={handleSlotSelect}
              onSelectEvent={handleEventClick}
              eventPropGetter={getEventStyle} // Define as cores dos eventos
              onEventDrop={moveEvent} // Permite mover eventos
              resizable
              onEventResize={resizeEvent} // Permite redimensionar eventos
              onDoubleClickEvent={handleEventClick} // Duplo clique para editar
              onContextMenu={(e, event) => handleContextMenu(e, event)} // Botão direito para menu de contexto
            />
          </div>
        </div>

        {/* Modal para adicionar ou visualizar agendamentos */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Detalhes do Agendamento"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          {selectedEvent ? (
            <>
              <h2>Detalhes do Agendamento</h2>
              <p><strong>Cliente:</strong> 
                <button onClick={() => handleClientClick(selectedEvent)} className="client-link">
                    {selectedEvent.client}
                </button>
              </p>
              <p><strong>Telefone:</strong> {selectedEvent.phone}</p>
              <p><strong>Horário de Início:</strong> 
                <input
                  type="datetime-local"
                  value={moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => handleTimeChange('start', e.target.value)}
                />
              </p>
              <p><strong>Horário de Término:</strong> 
                <input
                  type="datetime-local"
                  value={moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => handleTimeChange('end', e.target.value)}
                />
              </p>
              <p><strong>Descrição:</strong> {selectedEvent.description}</p>
              <p><strong>Status:</strong>
                <select value={selectedEvent.status} onChange={handleStatusChangeModal}>
                  <option value="a confirmar">A Confirmar</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="desmarcado">Desmarcado</option>
                </select>
              </p>
              <button onClick={() => handleWhatsAppClick(selectedEvent.phone, selectedEvent.client)}>Confirmar via WhatsApp</button>
            </>
          ) : (
            <form>
              <h2>Adicionar Novo Agendamento</h2>
              <div>
                <label>Descrição:</label>
                <input
                  type="text"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Descrição do agendamento"
                />
              </div>

              {/* Campo de pesquisa de cliente */}
              <div className="client-search">
                <label>Cliente:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o nome do cliente"
                />
                {/* Exibe a lista de sugestões com nome e telefone */}
                {filteredClients.length > 0 && (
                  <ul className="client-list">
                    {filteredClients.map((client, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setSelectedClient(client);
                          setSearchTerm(client.name);
                          setFilteredClients([]);
                        }}
                      >
                        {client.name} - {client.phone}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Status do agendamento */}
              <div>
                <label>Status:</label>
                <select value={newEvent.status} onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}>
                  <option value="a confirmar">A Confirmar</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="desmarcado">Desmarcado</option>
                </select>
              </div>

              {/* Exibir Início e Término lado a lado */}
              <div className="datetime-container">
                <div className="datetime">
                  <label>Início:</label>
                  <input type="datetime-local" value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')} onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })} />
                </div>
                <div className="datetime">
                  <label>Término:</label>
                  <input type="datetime-local" value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')} onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })} />
                </div>
              </div>

              <button type="button" onClick={handleAddEvent}>Adicionar Agendamento</button>
            </form>
          )}
        </Modal>

        {/* Menu de contexto para alterar o status */}
        {contextMenu && (
          <div
            className="context-menu"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              position: 'absolute',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              zIndex: 1000,
              padding: '10px',
            }}
          >
            <p onClick={() => handleChangeStatusContext('a confirmar')}>A Confirmar</p>
            <p onClick={() => handleChangeStatusContext('confirmado')}>Confirmado</p>
            <p onClick={() => handleChangeStatusContext('desmarcado')}>Desmarcado</p>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Agendamento;
