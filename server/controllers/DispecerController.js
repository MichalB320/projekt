const dispecer = require("../models/dispecer");

module.exports = {
    getDispeceri: (req, res) => {
        console.log("dispečer controller");
        (async () => {
            dispeceri = await dispecer.getAllDispatchers();
            res.status(200).json(dispeceri);
        })();
    },

    getChybovostDispecera: (req, res) => {
        console.log("dispecer chybovost controller");
        (async () => {
            try {
                dispeceri = await dispecer.getErrorRateOf(req.params.id);
                res.status(200).json(dispeceri);
            } catch (err) {
                console.log(err);
            }
        })();
    },

    getPocetChybDispecerovZaMesiac: (req, res) => {
        console.log("dispecer chybovost controller");
        (async () => {
            try {
                dispeceri = await dispecer.getErrorOfAllDispatcherPerMonth(req.params.id);
                res.status(200).json(dispeceri);
            } catch (err) {
                console.log(err);
            }
        })();
    },
};


