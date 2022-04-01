const User = require('../models/user');
const Chapter = require('../models/chapter');
const AppError = require('../lib/app-error');
const HttpStatus = require('../lib/http-status-codes');
const {attachBigPromise} = require('../lib/big-promise');

const unlockOneChapter = async (req, res)=>{
    const {user_id, series_id} = req.body
    const user = await User.findById(user_id).select('daily_pass_info');
    if(!user){
        throw new AppError(HttpStatus.BAD_REQUEST, 'User not found!');
    }
    const offset = user.daily_pass_info[series_id] || 0
    await user.updateOne({[`daily_pass_info.${series_id}`]: offset+1})
    return res.json({message: "Unlocked new chapter!!!"});
}

const getUnlockedChapters = async (req, res)=>{
    const user = await User.findById(req.params.userId)
        .select('_id createdAt daily_pass_info');
    if(!user){
        throw new AppError(HttpStatus.BAD_REQUEST, 'User not found!');
    }
    const dailyPassInfo = user.daily_pass_info
    const chapters = await Chapter.find();
    const unlockedChapters = []
    const userRegistered = new Date(user.createdAt)
    for(const chapter of chapters){
        const seriesReleased = new Date(chapter.release_date)
        const now = new Date();
        const currentDay = Math.floor(Math.abs(now-Math.max(userRegistered, seriesReleased))/(24*60*60*1000));
        let offset = dailyPassInfo[chapter.series_id] || 0;
        const index = chapter.index;
        const unlockDay = index<4 ? 0 : index-3;
        if(currentDay+offset>=unlockDay){
            unlockedChapters.push(chapter.chapter_id)
        }
    }
    return res.json(unlockedChapters);
}

const createChapters = async (req, res)=>{
    const chapters = req.body;
    await Chapter.insertMany(chapters);
    return res.json({message: "Chapters created successfully!!!"});
}

const DailyPassController = {
    unlockOneChapter,
    getUnlockedChapters,
    createChapters
};
attachBigPromise(DailyPassController);
module.exports = DailyPassController;
