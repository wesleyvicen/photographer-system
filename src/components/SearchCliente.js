import React, { useState } from 'react';

const SearchCliente = ({ clients, onSelectClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      setFilteredClients(
        clients.filter((client) =>
          client.name.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else {
      setFilteredClients([]);
    }
  };

  const handleSelectClient = (client) => {
    onSelectClient(client);
    setSearchTerm(client.name);
    setFilteredClients([]);
  };

  return (
    <div className="search-cliente">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Buscar cliente..."
      />
      {filteredClients.length > 0 && (
        <ul className="client-list">
          {filteredClients.map((client) => (
            <li key={client.phone} onClick={() => handleSelectClient(client)}>
              {client.name} - {client.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchCliente;
