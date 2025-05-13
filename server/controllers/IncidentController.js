const incident = require("../models/incident");

module.exports = {
    getIncidents: (req, res) => {
        console.log("Dostal som sa sem /all");
        //const hovor = require("../models/hovor");
        (async () => {
            incidents = await incident.getAllIncidents();
            res.status(200).json(incidents);
        })();
    },

    getDetail: (req, res) => {
            console.log("Dostal som sa sem /detail");
            (async () => {
                try {
                    const incidentID = req.params.id;
                    const incidentData = await incident.getBasicIncidentInfo(incidentID);
                    if (incidentData.ID_PODUJATIA === null) {
                        ret_val = await incident.getDetailsWithoutEvent(incidentID);
                        console.log(ret_val);
                    } else {
                        ret_val = await incident.getDetails(incidentID);
                        console.log(ret_val);
                    }
                    
                    res.status(200).json(ret_val);
                } catch (err) {
                    console.error("Chyba pri získavaní detailov incidentu:", err);
                    res.status(500).json({ error: err.message });
                }
            })();
        },
        
        getNumberOfIncidentOfMonth: (req, res) => {
            console.log("Dostal som sa sem /detail");
            (async () => {
                try {
                    const month = req.params.id;
                    ret_val = await incident.incidentsNumberOfMonth(month)
                    res.status(200).json(ret_val);
                } catch (err) {
                    console.error("Chyba pri získavaní počtu incidentov za mesiac:", err);
                    res.status(500).json({ error: err.message });
                }
            })();
        },
};
