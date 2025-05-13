import React, { useState, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';

import '../styles/stat.css';

export default function Statistics() {
  const toast = useRef(null);
  const [render, setRender] = useState(false);
  const [year, setYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [incidentStats, setIncidentStats] = useState(null);
  const [dispatcherErrors, setDispatcherErrors] = useState(null);
  const [eventCount, setEventCount] = useState(null);
  const [topIncidentType, setTopIncidentType] = useState(null);
  const [topLocation, setTopLocation] = useState(null);
  const [incidentTypeStats, setIncidentTypeStats] = useState(null);
  const [locationStats, setLocationStats] = useState(null);

  const handleSubmit = () => {
    if (year !== null) {
      setRender(true);
      setLoading(true);

      if (year.getFullYear() === 2024) {
        setIncidentStats({
          labels: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún'],
          datasets: [
            {
              label: 'Počet incidentov',
              data: [120, 98, 134, 110, 105, 99],
              backgroundColor: '#42A5F5'
            }
          ]
        });

        setIncidentTypeStats({
          labels: ['Dopravná nehoda', 'Požiar', 'Krádež', 'Vandalizmus'],
          datasets: [
            {
              data: [45, 25, 15, 15],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }
          ]
        });

        setLocationStats({
          labels: ['Bratislava', 'Košice', 'Žilina', 'Nitra', 'Banská Bystrica', 'Prešov', 'Trnava', 'Trenčín'],
          datasets: [
            {
              data: [30, 15, 13, 12, 10, 5, 5, 5],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF','#FF9F40', '#8D6E63', '#4D5360' ]
            }
          ]
        });

        setDispatcherErrors(5.3);
        setEventCount(888);
        setTopIncidentType('Dopravná nehoda');
        setTopLocation('Bratislava');
      } else {
        setIncidentStats(null);
        setIncidentTypeStats(null);
        setLocationStats(null);
        setDispatcherErrors(null);
        setEventCount(null);
        setTopIncidentType(null);
        setTopLocation(null);
      }
      setLoading(false);
    } else {
      toast.current.show({ severity: 'error', summary: 'Zadajte rok', life: 3000 });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="grid" style={{ marginTop: '1rem' }}>
        <div className="field col-4 md:col-3">
          <label htmlFor="yearPicker" style={{ marginRight: '1rem' }}>Zadajte rok</label>
          <Calendar 
            id="yearPicker" 
            value={year} 
            onChange={(e) => setYear(e.value)} 
            view="year" 
            dateFormat="yy" 
            readOnlyInput
          />
        </div>
        <div className="field col-4 md:col-3">
          <Button icon="pi pi-check" label="Zadaj" onClick={handleSubmit} />
        </div>
      </div>

      {render && !loading ? (
        incidentStats ? (
          <>
            <div className="grid">
              <div className="col h-8rem text-center m-3 border-round-lg text-20 font-bold count-card">
                Počet incidentov v roku {year.getFullYear()}
                <p>{incidentStats.datasets[0].data.reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="col h-8rem text-center m-3 border-round-lg text-20 font-bold count-card">
                Chybovosť dispečerov
                <p>{dispatcherErrors ? `${dispatcherErrors}%` : '-'}</p>
              </div>
              <div className="col h-8rem text-center m-3 border-round-lg text-20 font-bold count-card">
                Počet udalostí
                <p>{eventCount}</p>
              </div>
              <div className="col h-8rem text-center m-3 border-round-lg text-20 font-bold count-card">
                Najčastejší typ incidentu
                <p>{topIncidentType}</p>
              </div>
              <div className="col h-8rem text-center m-3 border-round-lg text-20 font-bold count-card">
                Najčastejšia poloha incidentu
                <p>{topLocation}</p>
              </div>
            </div>

            <div className="grid mt-4">
              <div className="col-12 xl:col-6 flex justify-content-center">
                <Chart type="bar" data={incidentStats} options={{ responsive: true }} style={{ width: '80%' }} />
              </div>
            </div>

            <div className="grid mt-4">
              <div className="col-12 md:col-6 flex justify-content-center">
                <div className="card">
                  <h3 className="text-center">Rozdelenie typov incidentov</h3>
                  <Chart type="pie" data={incidentTypeStats} options={{ responsive: true }} style={{ width: '80%' }} />
                </div>
              </div>

              <div className="col-12 md:col-6 flex justify-content-center">
                <div className="card">
                  <h3 className="text-center">Rozdelenie incidentov podľa lokality</h3>
                  <Chart type="doughnut" data={locationStats} options={{ responsive: true }} style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center">Žiadne dáta z tohto roku</p>
        )
      ) : loading ? (
        <ProgressBar mode="indeterminate" style={{ height: '6px', width: '99%' }} />
      ) : ''}
    </div>
  );
}
