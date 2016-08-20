var wxUtils = require('../utils/wxUtils');
var url = "http://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2666137041&idx=1&sn=47d1359a3c588610e38afa64b33416dd&scene=0#rd";
wxUtils.getWxArticleData(url,function(err,data){
    console.log(err);
    console.log(data);
})