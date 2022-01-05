const planeService = require('./planeService');

module.exports = {
    list: async(req, res) => {
        try {
            //get request params and url
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const url = req.url;

            //get plane list and page count
            const planes = await planeService.list(page - 1);
            const maxPage = Math.floor((planes.count - 1) / 6) + 1;
            res.render('plane/planes', { title: 'Planes', planes: planes.rows, currentPage: page, maxPage, url, scripts: ['plane.js'] });
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

            //get plane and page count
            const planes = search ? await planeService.search(search, page - 1) : await planeService.list(page - 1);
            const maxPage = Math.floor((planes.count - 1) / 6) + 1;
            res.render('plane/planes', { title: 'Planes', planes: planes.rows, currentPage: page, maxPage, search, url, scripts: ['planes.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addPlanePage: async(req, res) => {
        try {
            res.render('plane/addPlane', { title: 'Add Plane', scripts: ['plane.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addPlaneForm: async(req, res) => {
        try {
            const { aircraftNumber, airlineName } = req.body;
            await planeService.addPlane(aircraftNumber, airlineName);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    updatePlanePage: async(req, res) => {
        try {
            const id = req.params.planeId;
            const plane = await planeService.findPlaneById(id);
            res.render('plane/updatePlane', { title: 'Update Plane', plane, scripts: ['plane.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    updatePlaneForm: async(req, res) => {
        try {
            const { id, aircraftNumber, airlineName } = req.body;
            await planeService.updatePlane(id, aircraftNumber, airlineName);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
}