import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

export default function CustomIncidentTable(props) {
  const { cellData, titles, tableName, tableScrollHeight, allowFilters } = props;

  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
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
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onRowSelection = (e) => {
    const row = e.value;
    setSelectedRow(row);
    setShowDialog(true);
    console.log(row);
    fetch(`/api/calls/detail/${row.ID_HOVORU}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('hospit-user')
      }
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setIncidentData(data[0]);
      } else {
        console.error("API nevrátilo očakávané dáta");
      }
    })
    .catch((err) => {
      console.error('Error fetching incident data:', err);
    });
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
          {tableName}
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
          paginator
          rows={15}
          scrollable
          scrollHeight={tableScrollHeight}
          header={header}
          filters={filters}
          globalFilterFields={titles.map((t) => t.field)}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          {titles.map((title) => (
            <Column key={title.field} field={title.field} header={title.header} filter />
          ))}
        </DataTable>
      </div>

      <Dialog
        header='Detail'
        visible={showDialog}
        style={{ width: '30vw' }}
        onHide={onHide}
      >
        {incidentData ? (
          <div>
            <p><strong>Volajúci:</strong></p>
            <p style={{ marginLeft: '20px' }}> Meno: {incidentData.VOLAJUCI_NAME} {incidentData.VOLAJUCI_PRIEZVISKO} </p> 
            <p style={{ marginLeft: '20px' }}> Vek: {incidentData.VOLAJUCI_AGE} rokov </p>
            <p style={{ marginLeft: '20px' }}> Telefón: +{incidentData.VOLAJUCI_PHONE} </p>
            <p><strong>Dispečer:</strong></p>
            <p style={{ marginLeft: '20px' }}> Id dispečera: {incidentData.DISPECER_ID}</p>
            <p><strong>Incident:</strong></p>
            <p style={{ marginLeft: '20px' }}> Typ incidentu: {incidentData.INCIDENT_TYPE}</p>
            <p style={{ marginLeft: '20px' }}> Poloha incidentu: {incidentData.INCIDENT_LOCATION}</p>
          </div>
        ) : (
          <p>Načítavam...</p>
        )}
      </Dialog>
    </div>
  );
}
