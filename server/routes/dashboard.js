const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController');
const { isLoggedIn } = require('../../middleware/checkAuth');

router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteView);
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNote);
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.dashboardViewNote);
router.put('/dashboard/item/:id', isLoggedIn, dashboardController.dashboardUpdateNote);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.dashboardDeleteNote);

router.get('/dashboard/search', isLoggedIn, dashboardController.dashboardSearchView);
router.post('/dashboard/search', isLoggedIn, dashboardController.dashboardSearchPost);

module.exports = router;