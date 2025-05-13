import { useEffect, useRef, useState } from 'react';
import TableMedicalRecords from './TableMedicalRecords';
import TableIncidentRecords from './TabIncidentRecords';
import GetUserData from '../../Auth/GetUserData';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';

export default function TabHospitalizations() {
  const toast = useRef(null);
  //const navigate = useNavigate();
  const [incidenty, setIncidenty] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('hospit-user');
    //const userDataHelper = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/incidents/allIncidents`, {
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
        setIncidenty(data);
        setLoading(false);
      });
  };

  const data = {
    tableName: 'Incidenty',
    cellData: incidenty,
    fetchData: () => fetchData(),
    titles: [
      { field: 'ID_INCIDENTU', header: 'ID incidentu' },
      { field: 'ID_HOVORU', header: 'ID hovoru' },
      { field: 'TYP_INCIDENTU', header: 'typ incidentu' },
      { field: 'POPIS_INCIDENTU', header: 'popis' },
      { field: 'POLOHA_UDALOSTI', header: 'poloha' },
      { field: 'ID_POCASIA', header: 'počasie' },
      { field: 'ID_PODUJATIA', header: 'podujatie' },
      { field: 'RIESENIE', header: 'riešenie' },
      { field: 'ZDRAV_STAV_PACIENTA', header: 'stav pacienta' },
      { field: 'CAS_VYRIESENIA_INCIDENTU', header: 'čas vyriešenia incidentu' },
    ],
    allowFilters: true,
    dialog: true,
    eventType: 'Incidenty',
    tableLoading: loading,
  };

  return (
    <div>
      <Toast ref={toast} position='top-center' />
      {data && <TableIncidentRecords {...data} />}
    </div>
  );
}
