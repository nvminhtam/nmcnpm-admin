const seatClassService = require('./seatClassService');

module.exports = {
    list: async(req, res) => {
        try {
            //get request params and url
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const url = req.url;

            //get seatclass list and page count
            const seatclasses = await seatClassService.list(page - 1);
            const maxPage = Math.floor((seatclasses.count - 1) / 6) + 1;
            res.render('seatclass/seatclasses', { title: 'Seat Classes', seatclasses: seatclasses.rows, currentPage: page, maxPage, url, scripts: ['seatclass.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    search: async(req, res) => {
        try {
            //get request params
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const search = req.query.keyword;
            const url = req.url;

            //get seatclass and page count
            const seatclasses = search ? await seatClassService.search(search, page - 1) : await seatClassService.list(page - 1);
            const maxPage = Math.floor((seatclasses.count - 1) / 6) + 1;
            res.render('seatclass/seatclasses', { title: 'Seat Classes', seatclasses: seatclasses.rows, currentPage: page, maxPage, search, url, scripts: ['seatclass.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addSeatClassPage: async(req, res) => {
        try {
            res.render('seatclass/addSeatClass', { title: 'Add Seat Class', scripts: ['seatclass.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addSeatClassForm: async(req, res) => {
        try {
            const { seatClassName } = req.body;
            await seatClassService.addSeatClass(seatClassName);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    updateSeatClassPage: async(req, res) => {
        try {
            const id = req.params.seatClassId;
            const seatclass = await seatClassService.findSeatClassById(id);
            res.render('seatclass/updateSeatClass', { title: 'Update Seat Class', seatclass, scripts: ['seatclass.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    updateSeatClassForm: async(req, res) => {
        try {
            const { id, seatClassName } = req.body;
            await seatClassService.updateSeatClass(id, seatClassName);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
}