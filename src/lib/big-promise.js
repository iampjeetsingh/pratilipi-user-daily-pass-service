const {validationResult} = require("express-validator");
const AppError = require("./app-error");
const HttpStatus = require("./http-status-codes");
const handleError = require("./error-handler")

const validateRequest = (req)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError(HttpStatus.BAD_REQUEST, errors.array()[0].msg);
    }
}

const BigPromise = func => async (req, res, next) => {
    try {
        validateRequest(req);
        await Promise.resolve(func(req, res, next));
        next();
    } catch (err) {
        handleError(req, res, err);
    }
}

exports.attachBigPromise = (controller)=>{
    for(const key of Object.keys(controller)){
        controller[key] = BigPromise(controller[key])
    }
    return controller
}