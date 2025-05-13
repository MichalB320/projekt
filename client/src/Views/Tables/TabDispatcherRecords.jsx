import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

export default function TabDispatcherRecord(props) {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    initFilters();
  }, []);

  const initFilters = () => {
    let filterObject = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } };
    props.titles.forEach(title => {
      filterObject[title.field] = {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      };
    });
    setFilters(filterObject);
    setGlobalFilterValue('');
  };

//   const fetchErrorDetails = async (dispatcherId) => {
//     try {
//       const response = await fetch(`/api/dispatchers/errorRate/${dispatcherId}`);
//       if (!response.ok) {
//         throw new Error('Chyba pri načítaní údajov');
//       }
//       const data = await response.json();
//       setErrorDetails(data);
//     } catch (error) {
//       console.error('Error fetching error details:', error);
//       setErrorDetails(null);
//     }
//   };

  const handleClick = (e) => {
    // setSelectedRow(value);
    // fetchErrorDetails(value.value); 
    // setShowDialog(true);

    const row = e.value;
    setSelectedRow(row);
    setShowDialog(true);
    console.log(row.ID_DISPECERA);
    fetch(`/api/dispatchers/errorRate/${row.ID_DISPECERA}`, {
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
        setErrorDetails(data);
      } else {
        console.error("API nevrátilo očakávané dáta");
        setErrorDetails([{ message: "Neplatné dáta z API", code: "INVALID_DATA" }]);
      }
    })
    .catch((err) => {
      console.error('Error fetching incident data:', err);
    });
  };

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
    setErrorDetails(null);
  };

  const renderHeader = () => {
    return (
      <div className='flex justify-content-between'>
        <div className='table-header'>
          {props.tableName}
          <span className='p-input-icon-left'>
            <i className='pi pi-search' />
            <InputText
              value={globalFilterValue}
              onChange={(e) => onGlobalFilterChange(e)}
              placeholder='Keyword Search'
            />
          </span>
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const header = props.allowFilters ? renderHeader() : '';

  return (
    <div>
      <Toast ref={toast} position='top-center' />
      <div className='card'>
        <DataTable
          value={props.cellData}
          scrollable
          paginator
          rows={15}
          selectionMode='single'
          selection={selectedRow}
          onSelectionChange={(e) => handleClick(e)}
          header={header}
          filters={filters}
          filterDisplay='menu'
          globalFilterFields={props.titles.map(title => title.field)}
          scrollHeight={props.tableScrollHeight}
          emptyMessage='Žiadne výsledky nevyhovujú vyhľadávaniu'
        >
          {props.titles.map((title) => (
            <Column key={title.field} field={title.field} header={title.header} filter />
          ))}
        </DataTable>
      </div>
      
      <Dialog 
  header={selectedRow ? `${selectedRow.MENO} ${selectedRow.PRIEZVISKO}` : ''} 
  visible={showDialog} 
  style={{ width: '30vw' }} 
  onHide={onHide}
>
  {errorDetails ? (
    errorDetails[0].code === "INVALID_DATA" || errorDetails[0].code === "FETCH_ERROR" ? (
      <div>
        <p style={{ color: 'green' }}><strong>Žiadna chybovosť dispečera.</strong></p>
      </div>
    ) : (
      <div>
        <p><strong>Typ chyby:</strong> {errorDetails[0].TYP_CHYBY}</p>
        <p><strong>Závažnosť chyby:</strong> {errorDetails[0].ZAVAZNOST_CHYBY}</p>
        <p><strong>Riešenie chyby:</strong> {errorDetails[0].RIESENIE_CHYBY}</p>
        <p><strong>Čas spôsobenia chyby:</strong> {new Date(errorDetails[0].CAS_SPOSOBENIA_CHYBY).toLocaleString()}</p>
        <p><strong>Čas nájdenia chyby:</strong> {new Date(errorDetails[0].CAS_NAJDENIA_CHYBY).toLocaleString()}</p>
        <p><strong>Čas riešenia chyby:</strong> {new Date(errorDetails[0].CAS_RIESENIA_CHYBY).toLocaleString()}</p>
      </div>
    )
  ) : (
    <p>Načítavam údaje...</p>
  )}
</Dialog>

    </div>
  );
}
