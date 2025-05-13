import { useEffect, useRef, useState } from 'react';
import TableMedicalRecords from './TableMedicalRecords';
import TabDispatcherRecords from './TabDispatcherRecords';
import GetUserData from '../../Auth/GetUserData';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';

export default function TabDispatchers() {
  const toast = useRef(null);
  //const navigate = useNavigate();
  const [dispecery, setDispeceri] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('hospit-user');
    //const userDataHelper = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/dispatchers/allDispatchers`, {
      headers,
    })
       .then((response) => { 
        console.log(response.json);
        // Kontrola ci response je ok (status:200)
        if (response.ok) {
          return response.json();
          // Kontrola ci je token expirovany (status:410)
        } else if (response.status === 410) {
          // Token expiroval redirect na logout
          toast.current.show({
            severity: 'error',
            summary: 'Session timeout redirecting to login page',
            life: 999999999,
          });
        }
      }) 
      .then((data) => {
        setDispeceri(data);
        setLoading(false);
      });
  };

  const data = {
    tableName: 'Dispečery',
    cellData: dispecery,
    fetchData: () => fetchData(),
    titles: [
      { field: 'ID_DISPECERA', header: 'ID dispečera' },
      { field: 'MENO', header: 'meno' },
      { field: 'PRIEZVISKO', header: 'priezvisko' },
      { field: 'POZICIA', header: 'pozícia' },
    ],
    allowFilters: true,
    dialog: true,
    eventType: 'Dispečery',
    tableLoading: loading,
  };

  return (
    <div>
      <Toast ref={toast} position='top-center' />
      {data && <TabDispatcherRecords {...data} />}
    </div>
  );
}
