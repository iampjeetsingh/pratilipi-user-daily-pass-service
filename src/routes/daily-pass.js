const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const DailyPassController = require('../controllers/daily-pass.controller');


router.post('/unlock', [
    check('user_id', 'user_id is mandatory'),
    check('series_id', 'series_id is mandatory')
], DailyPassController.unlockOneChapter);

router.get('/:userId/chapters', DailyPassController.getUnlockedChapters);

router.post('/create-chapters', DailyPassController.createChapters);

module.exports = router
