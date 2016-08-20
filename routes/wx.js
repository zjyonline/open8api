var express = require('express');
var router = express.Router();
var wxUtils = require('../utils/wxUtils');
var Result = require('../Result');

/**
 * 解析微信的文章成一个article对象
 * body:{
 *      "url":"asdsad"//文章地址
 * }
 */
router.post('/parseArticle', function(req, res, next) {
    var result = new Result();
    result.errorCode = 0;
    //参数校验
    req.checkBody('url','required').notEmpty().withMessage('url is required');
    var errors = req.validationErrors();
    if (errors) {
        result.errorCode = 400;
        result.errorMessage = errors;
        res.status(400).json(result);
        return;
    }
    wxUtils.parseArticleUrlWithText(req.body.url,function(err,data){
        console.log(err);
        console.log(data);
        res.status(200 ).json(data);
    })
});
/**
 * 解析微信的文章的阅读量
 * body:{
 *      "url":"asdsad"//文章地址
 * }
 */
router.post('/countArticle', function(req, res, next) {
    var result = new Result();
    result.errorCode = 0;
    //参数校验
    req.checkBody('url','required').notEmpty().withMessage('url is required');
    var errors = req.validationErrors();
    if (errors) {
        result.errorCode = 400;
        result.errorMessage = errors;
        res.status(400).json(result);
        return;
    }
    wxUtils.getWxArticleData(req.body.url,function(err,data){
        res.status(200 ).json(data);
        res.end();
    })
});

module.exports = router;
