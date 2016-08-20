var wxUtils = require('../utils/wxUtils');
var url = "http://mp.weixin.qq.com/s?src=3&timestamp=1471673527&ver=1&signature=tu7Z7dFoN0UJrPIBvihajHjA3KplU2q3bbJ-GHCeDYNUH3lZpUW8ltA-riaNdzsLH1fDykC01rH1YZmaXRPXenD-DKPGjIHVZed0wgcNOX4lOBYnWvVNAK4jw7kKlA4aG6y1QrnGIK8CijJQnfYPZQyUsJaMCLOApjIkNGEnWXU=";
wxUtils.getWxArticleData(url,function(err,data){
    console.log(err);
    console.log(data);
})