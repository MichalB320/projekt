const database = require("../database/Database");
const oracledb = database.oracledb;

async function getAllHovors() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
    id_hovoru,
    cas_zaciatku_telefonatu as zaciatok_hovoru,
    cas_prijatia_hovoru,
    cas_ukoncenia_hovoru,
    ukoncenie_hovoru,
    priorita,
    poloha_hlasenia
FROM hovor ORDER BY id_hovoru`);
    console.log("som v controlleri");
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    console.log("som v errori");
    console.log(err);
    console.log("print err");
  }
}

async function getDetails(callId) {
  try {
    console.log("som v modeli getDetails");
    console.log("Hodnota callId pred konverziou:", callId);
    console.log("Hodnota callId po konverzii:", Number(callId));
    
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
    v.meno AS volajuci_name,
    v.priezvisko AS volajuci_priezvisko,
    v.vek AS volajuci_age,
    v.pohlavie AS volajuci_gender,
    v.telefonne_cislo AS volajuci_phone,
    d.id_dispecera AS dispecer_id,
    d.meno AS dispecer_meno,
    d.priezvisko AS dispecer_priezvisko,
    d.pozicia AS dispecer_pozicia,
    i.typ_incidentu AS incident_type,
    i.poloha_udalosti AS incident_location
FROM 
    hovor h JOIN volajuci v ON h.id_volajuceho=v.id_volajuceho
                JOIN dispecer d ON h.id_dispecera=d.id_dispecera
                JOIN incident i ON h.id_hovoru=i.id_hovoru
WHERE
    h.id_hovoru = :callId`,
      { callId: Number(callId) }
    );

    //console.log(result.rows);
    return result.rows;
    // Správna kontrola prázdneho výsledku:
    // if (!result.rows || result.rows.length === 0) {
    //   throw new Error("Call not found");
    // }

    // const row = result.rows[0];
    // // Vraciame zploštený objekt bez vnorených kľúčov
    // return {
    //   name: row.VOLAJUCI_NAME,
    //   age: row.VOLAJUCI_AGE,
    //   gender: row.VOLAJUCI_GENDER,
    //   phone: row.VOLAJUCI_PHONE,
    //   dispecerId: row.DISPECER_ID,
    //   incidentType: row.INCIDENT_TYPE,
    //   incidentLocation: row.INCIDENT_LOCATION,
    // };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  getAllHovors,
  getDetails,
};
