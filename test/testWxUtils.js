var wxUtils = require('../utils/wxUtils');
var url = "http://mp.weixin.qq.com/s?__biz=MjI3Njc0NTk4MQ==&mid=2649915715&idx=1&sn=c6228fcd1a32a48928ae9f97a8f8ce48&scene=0#rd";
wxUtils.getWxArticleData(url,function(err,data){
    console.log(err);
    console.log(data);
})