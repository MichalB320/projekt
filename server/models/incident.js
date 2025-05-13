const database = require("../database/Database");

async function getAllIncidents() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute('SELECT * FROM incident ORDER BY id_incidentu');
    console.log("som v controlleri");
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    console.log("som v errori");
    console.log(err);
    console.log("print err");
  }
}

async function getBasicIncidentInfo(incidentID) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute('SELECT * FROM incident WHERE id_incidentu = :incidentID', {incidentID: Number(incidentID)});
    console.log(result);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getDetailsWithoutEvent(incidentID) {
  try {
    console.log("som v modeli getDetails");
    console.log("Hodnota incidentId pred konverziou:", incidentID);
    console.log("Hodnota incidentId po konverzii:", Number(incidentID));
    
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
    h.priorita,
    h.poloha_hlasenia,
    poc.typ_pocasia,
    poc.teplota,
    poc.zmenene_pocasie,
    poc.cas_zmeny_pocasia
FROM
    incident i JOIN hovor h ON i.id_hovoru=h.id_hovoru
                JOIN pocasie poc ON i.id_pocasia=poc.id_pocasia
WHERE
    i.id_incidentu = :incidentID`,
      { incidentID: Number(incidentID) }
    );
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    console.log(err);
    //throw err;
  }
}

async function getDetails(incidentID) {
  try {
    console.log("som v modeli getDetails");
    console.log("Hodnota incidentId pred konverziou:", incidentID);
    console.log("Hodnota incidentId po konverzii:", Number(incidentID));
    
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
    h.priorita,
    h.poloha_hlasenia,
    p.nazov,
    p.ucast,
    p.poznamka,
    poc.typ_pocasia,
    poc.teplota,
    poc.zmenene_pocasie,
    poc.cas_zmeny_pocasia
FROM
    incident i JOIN hovor h ON i.id_hovoru=h.id_hovoru
                LEFT JOIN podujatia p ON i.id_podujatia=p.id_podujatia
                JOIN pocasie poc ON i.id_pocasia=poc.id_pocasia
WHERE
    i.id_incidentu = :incidentID`,
      { incidentID: Number(incidentID) }
    );
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    console.log(err);
    //throw err;
  }
}

async function incidentsNumberOfMonth(month) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
    COUNT(*) AS pocet_incidentov_za_mesiac
FROM 
    incident
WHERE
    SUBSTR(cas_vyriesenia_incidentu, 4, 2) = :month`,
      { month: Number(month) }
    );
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
    getAllIncidents,
    getDetails,
    getBasicIncidentInfo,
    incidentsNumberOfMonth,
};
