import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

export default function IncidentTable({ cellData, titles, tableName, tableScrollHeight, allowFilters }) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  //const [filters, setFilters] = useState({ global: { value: null, matchMode: 'contains' } });
  const [filters, setFilters] = useState(() => {
        let initialFilters = {
          global: { value: null, matchMode: 'contains' }
        };
      
        // Dynamicky pridaj stĺpcové filtre
        titles.forEach(title => {
          initialFilters[title.field] = { value: null, matchMode: 'contains' };
        });
      
        return initialFilters;
      });
  const [incidentData, setIncidentData] = useState(null);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters({ global: { value, matchMode: 'contains' } });
    setGlobalFilterValue(value);
  };

  const onRowSelection = (e) => {
    const row = e.value;
    setSelectedRow(row);
    setShowDialog(true);
    fetchIncidentData(row.ID_HOVORU);
  };

  const fetchIncidentData = (id) => {
    fetch(`http://localhost:3000/api/incidents/detail/${id}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('hospit-user') }
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setIncidentData(data[0]);
      } else {
        console.error("API nevrátilo očakávané dáta");
      }
    })
    .catch(err => console.error('Error fetching incident data:', err));
  };

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
    setIncidentData(null);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="table-header">
          <strong>{tableName}</strong> {/* Zobrazenie názvu tabuľky */}
          {allowFilters && (
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <input
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Keyword Search"
                className="p-inputtext p-component"
              />
            </span>
          )}
        </div>
      </div>
    );
  };

  const header = allowFilters ? renderHeader() : null;

  return (
    <div>
      <div className="card">
        <DataTable
          value={cellData}
          selectionMode="single"
          dataKey="id"
          onSelectionChange={onRowSelection}
          paginator rows={15}
          scrollable scrollHeight={tableScrollHeight}
          header={header}
          filters={filters}
          globalFilterFields={titles.map((t) => t.field)}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          {titles.map(title => <Column key={title.field} field={title.field} header={title.header} filter />)}
        </DataTable>
      </div>
      <Dialog header='Detail' visible={showDialog} style={{ width: '30vw' }} onHide={onHide}>
        {incidentData ? (
          <div>
            
            <p><strong>Priorita:</strong> {incidentData.PRIORITA}</p>
            <p><strong>Poloha hlásenia:</strong> {incidentData.POLOHA_HLASENIA}</p>
            {incidentData.NAZOV ? <p><strong>Názov udalosti:</strong> {incidentData.NAZOV}</p> : <p>žiadna udalosť sa nekonala</p>}
            {incidentData.UCAST && <p><strong>Účasť udalosti:</strong> {incidentData.UCAST}</p>}
            {incidentData.POZNAMKA && <p><strong>Poznámka k udalosti:</strong> {incidentData.POZNAMKA}</p>}
            <p><strong>Počasie:</strong> {incidentData.TYP_POCASIA}, {incidentData.TEPLOTA}°C</p>
            <p><strong>Zmena počasia:</strong> {incidentData.ZMENE_POCASIE} o {new Date(incidentData.CAS_ZMENY_POCASIA).toLocaleTimeString()}</p>
          </div>
        ) : <p>Načítavam...</p>}
      </Dialog>
    </div>
  );
}
