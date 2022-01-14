const adminService = require('../ad/adminService');

module.exports = {
    editAccountPage: async(req, res) => {
        const user = req.user;
        res.render('profile/editAccount', { title: 'Edit Account', user, scripts: ['admin.js'] });
    },
}