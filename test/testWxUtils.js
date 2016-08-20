var wxUtils = require('../utils/wxUtils');
var url = "http://mp.weixin.qq.com/s?src=3&timestamp=1471675327&ver=1&signature=vpRcnDWL4y-O1NScjqfxBhgwSnJGMIjv1sdNvkDUCNa1bPUK*Mw7XsYFtrj55jgl6YMNlP*h*IF5nZnJZW0tCBgYxWHkliyOzuMP9GDgvqSGZCJZmWARwzqPM*IGWOMughRvDHds4Jz6nbdz*3nRKBWSRgz4vqBPIK4JffL9z0M=";
wxUtils.getWxArticleData(url,function(err,data){
    console.log(err);
    console.log(data);
})