const hovor = require("../models/hovor");

module.exports = {
    getHovori: (req, res) => {
        console.log("Dostal som sa sem /all");
        //const hovor = require("../models/hovor");
        (async () => {
            hovori = await hovor.getAllHovors();

//            console.log(res);
            res.status(200).json(hovori);
        })();
    },

    getDetail: (req, res) => {
        console.log("Dostal som sa sem /detail");
        (async () => {
            try {
                ret_val = await hovor.getDetails(req.params.id);
                console.log(ret_val);
                res.status(200).json(ret_val);
            } catch (err) {
                console.error("Chyba pri získavaní detailov hovoru:", err);
                res.status(500).json({ error: err.message });
            }
        })();
    }
};


