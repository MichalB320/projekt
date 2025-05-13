const database = require("../database/Database");

async function getAllDispatchers() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute('SELECT * FROM dispecer');
    console.log("dispečer model");
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    console.log("som v errori");
    console.log(err);
    console.log("print err");
  }
}

async function getErrorRateOf(dispatcherID) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
    typ_chyby,
    zavaznost_chyby,
    riesenie_chyby,
    cas_sposobenia_chyby,
    cas_najdenia_chyby,
    cas_riesenia_chyby
      FROM 
    chybovost
      WHERE
    id_dispecera = :dispatcherID`,
      { dispatcherID: Number(dispatcherID) }
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getErrorOfAllDispatcherPerMonth(month) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
    COUNT(cas_sposobenia_chyby) AS pocet_chyb
FROM
    chybovost
WHERE
    SUBSTR(cas_sposobenia_chyby, 4, 2) = :month`,
      { month: Number(month) }
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getAllDispatchers,
  getErrorRateOf,
  getErrorOfAllDispatcherPerMonth,
};
