var async = require( 'async' );
var simhash = require( 'simhash' )();
var hamming_distance = require( 'hamming-distance' );
var Segment = require( 'node-segment' ).Segment;
var request = require( 'request' );
var cheerio = require( 'cheerio' );
//var url = 'http://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2666130517&idx=1&sn=ef75d71d307a0052b7011848ce9038eb&scene=0#wechat_redirect';

/**
 * 根据微信文章地址解析出对应的文章对象,
 * 返回的文章content是html
 * @param url
 * @param callback
 */
exports.parseArticleUrl = function( url, callback ){
    parseWxUrl( url, callback )
};
/**
 * 根据微信文章地址解析出对应的文章对象,
 * 返回的文章content是text
 * @param url
 * @param callback
 */
exports.parseArticleUrlWithText = function( url, callback ){
    request.get( url, function( err, res, body ){
        "use strict";
        //console.log(err);
        //console.log(body);
        var $ = cheerio.load( body );
        var title = $( '#img-content' ).children( '.rich_media_title' ).text();
        var author = $( '#img-content' ).children( '.rich_media_meta_list' ).find( '.rich_media_meta_text' ).eq( 1 ).text();
        var img = $( '#js_content' ).find( 'img' ).attr( 'data-src' );
        var summary = $( '#js_content' ).find( 'p' ).eq( 3 ).text();
        var content = $( '#js_content' ).text();
        var startIndex = body.indexOf( 'msg_source_url' );
        var str = body.substring( startIndex, body.length );
        str = str.substring( str.indexOf( '\'' ) + 1, body.length );
        var link = str.substring( 0, str.indexOf( '\'' ) );
        var article = {
            title : title.trim(), author : author, img : img, summary : summary, content : content, link : link
        };
        /*console.log('title:'+title.trim());
         console.log('author:'+author);
         console.log('img:'+img);
         console.log('summary:'+summary);
         console.log('content:'+content);
         console.log('link:'+link);*/
        callback( err, article );
    } );
};
/**
 * 对比两个字符的相似读
 * @param textA
 * @param textB
 */
exports.checkArticle = function( textA, textB ){
    var importArticle = textA;
    var exportArticle = textB;

    var distance1 = similar( importArticle.content.substr( 0, 3000 ), exportArticle.content.substr( 0, 3000 ) );
    console.log( 'distance1:' + distance1 );
    var distance2 = similar( importArticle.content.substr( importArticle.content.length - 3000, importArticle.content.length ), exportArticle.content.substr( exportArticle.content.length - 3000, exportArticle.content.length ) );
    console.log( 'distance2:' + distance2 );
    if( distance1 <= 3 && distance2 <= 3 ){
        return true;
    } else{
        return false;
    }
}
/**
 * 计算两个文本的海明距离，通常认为海明距离<3的是高度相似的文本
 * @param str1
 * @param str2
 * @returns {*|exports}
 */
function similar( str1, str2 ){
    console.log( str1.trim() );
    console.log( str2.trim() );
    console.log( 'str1.length:' + str1.length );
    console.log( 'str2.length:' + str2.length );
    startTime = new Date().getTime();
    var segment = new Segment();
    // 使用默认的识别模块及字典
    segment.useDefault();
    // 开始分词
    var array1 = segment.doSegment( str1 );
    var temp1 = [];
    for( var i = 0; i < array1.length; i++ ){
        temp1.push( array1[i].w );
    }

    var array2 = segment.doSegment( str2 );
    var temp2 = [];
    for( var i = 0; i < array2.length; i++ ){
        temp2.push( array2[i].w );
    }

    var hash1 = simhash( temp1 );
    var hash2 = simhash( temp2 );

    console.log( 'array1:' + JSON.stringify( array1 ) );
    console.log( 'array2:' + JSON.stringify( array2 ) );
    console.log( 'temp1:' + temp1 );
    console.log( 'temp2:' + temp2 );
    console.log( 'hash1:' + hash1 );
    console.log( 'hash2:' + hash2 );
    var distance = hamming_distance( new Buffer( hash1, 'hex' ), new Buffer( hash2, 'hex' ) );
    console.log( 'distance:' + distance );
    endTime = new Date().getTime();
    console.log( 'waste:' + (endTime - startTime) );
    return distance;
};

//过滤中文字符
var reg = /[\ |\：|\）|\（|\—|\＂|\？|\【|\】|\*|\“|\”|\，|\！|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g;
//模拟微信的USER_AGENT_ARR
var USER_AGENT_ARR = ["Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50", "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0;", "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1", "Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1", "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11", "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Maxthon 2.0)", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; The World)", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; 360SE)", "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10", "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:7.0.1) Gecko/20100101 Firefox/7.0.1", "Mozilla/5.0 (Windows NT 6.1; rv:5.0) Gecko/20100101 Firefox/5.0", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1", "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)7", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:7.0.1) Gecko/20100101 Firefox/7.0.1", "Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.34 (KHTML, like Gecko) rekonq Safari/534.34", "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+", "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.23) Gecko/20110920 Firefox/3.6.23 SearchToolbar/1.2", "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1", "Mozilla/5.0 (Windows NT 5.1; rv:9.0.1) Gecko/20100101 Firefox/9.0.1", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36"];
var PAGE_LENGTH=2;
/**
 * 根据微信文章的url获取阅读数
 * @param url
 * @param callback
 */
exports.getWxArticleData = function( url, callback ){
    var result ={    };
    async.waterfall( [function( cb ){
        parseWxUrl( url, function( err, article ){
            if( !article.title ){
                result.url = url;
                cb( 'error url', null );
            } else{
                cb( null, article );
            }
        } );
    }, function( article, cb ){
        console.log(article)
        result.title = article.title;
        result.author = article.author;
        result.date = article.date;
        //console.log(article)
        //根据文章发布的时间，计算值
        var nowDate = new Date();
        var dateStr = article.date;
        var compareDate = new Date();
        compareDate.setFullYear( dateStr.split( '-' )[0] )
        compareDate.setMonth( parseInt( dateStr.split( '-' )[1] ) - 1 )
        compareDate.setDate( dateStr.split( '-' )[2] )
        var between = nowDate - compareDate;
        var WEIXIN_URL_IDG = '';
        //一天  0-86400000
        //一周  86400000-604800000
        //一月  604800000-2678400000
        //一年  2678400000-31622400000
        //根据文章标题去搜狗搜索
        if( between >= 0 && between < 86400000 ){
            WEIXIN_URL_IDG = 'http://weixin.sogou.com/weixin?query=' + encodeURI( article.title ) + '&_sug_type_=&sourceid=inttime_day&_sug_=n&type=2&ie=utf8&interation=&interV=kKIOkrELjboJmLkElbYTkKIKmbELjbkRmLkElbk=_1893302304&tsn=1';
        } else if( between >= 86400000 && between < 604800000 ){
            WEIXIN_URL_IDG = 'http://weixin.sogou.com/weixin?query=' + encodeURI( article.title ) + '&_sug_type_=&tsn=2&sourceid=inttime_week&_sug_=n&type=2&interation=&ie=utf8&interV=kKIOkrELjboJmLkElbYTkKIKmbELjbkRmLkElbk=_1893302304'
        } else if( between >= 604800000 && between < 2678400000 ){
            WEIXIN_URL_IDG = 'http://weixin.sogou.com/weixin?query=' + encodeURI( article.title ) + '&_sug_type_=&tsn=3&sourceid=inttime_month&_sug_=n&type=2&interation=&ie=utf8&interV=kKIOkrELjboJmLkElbYTkKIKmbELjbkRmLkElbk=_1893302304'
        } else if( between >= 2678400000 && between < 31622400000 ){
            WEIXIN_URL_IDG = 'http://weixin.sogou.com/weixin?query=' + encodeURI( article.title ) + '&_sug_type_=&tsn=4&sourceid=inttime_year&_sug_=n&type=2&interation=&ie=utf8&interV=kKIOkrELjboJmLkElbYTkKIKmbELjbkRmLkElbk=_1893302304'
        } else{
            WEIXIN_URL_IDG = "http://weixin.sogou.com/weixin?type=2&query=" + encodeURI( article.title ) + "&ie=utf8&_sug_=n&_sug_type_=";
        }
        var dataUrls = null;
        async.parallel([function(cb1){
            //没有日期选择的
            //有日期选择的
            //需要查询几页
            var index = 1;
            var length = PAGE_LENGTH;
            var dataUrl = null;
            var isFound = false;
            var searchUrl ="http://weixin.sogou.com/weixin?type=2&query=" + encodeURI( article.title ) + "&ie=utf8&_sug_=n&_sug_type_=";
            //WEIXIN_URL_IDG = "http://weixin.sogou.com/weixin?type=2&query=" + encodeURI( article.title ) + "&ie=utf8&_sug_=n&_sug_type_=";
            async.whilst(function(){
                return index<length;
            },function(cb2){
                //console.log('no date:'+index)
                var url = searchUrl+'&page='+(index++);
                //console.log('no date.url:'+url)
                var option = {
                    "uri" : url, "method" : "GET", "headers" : {
                        //"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
                        "User-Agent" : USER_AGENT_ARR[Math.floor( Math.random() * USER_AGENT_ARR.length + 1 )],
                        "SNUID" : "8263ED786573860A57104A7C00096335",
                        "SUV" : "00E75A037176F6875771EE779F7E4418"
                    }
                };
                request( option, function( err, res, body ){
                    //console.log(err);
                    //console.log(body);
                    var $ = cheerio.load( body );
                    var contentLeft = $( ".main" );
                    var links = $( '.results .txt-box' );
                    var articles = $( '.txt-box' );
                    //console.log('no date.links:'+links.length)
                    if( links.length > 0 ){
                        var found = false;
                        links.each( function( i, e ){
                            var element = $( this ).find( 'h4 a[href]' ).eq( 0 );
                            //console.log(element)
                            var title = element.text();
                            var beforeUrl = element.attr( 'href' );
                            var account_link = $( this ).find( '.s-p a[href]' ).eq( 0 );
                            var author = account_link.attr( 'title' );
                            var time = $( this ).find( '.s-p span' ).eq( 0 ).text();
                            time = time.substring( time.indexOf( '\'' ) + 1, time.lastIndexOf( '\'' ) );
                            var articleDate = new Date( parseInt( time + '000' ) );
                            //time.replace('vrTimeHandle552write(','').replace(')','');
                            var url = beforeUrl.replace( 'http://mp.weixin.qq.com/s', 'http://mp.weixin.qq.com/mp/getcomment' );
                            console.log( '------------' )
                            console.log( 'no date:'+'author:' + author.replace( reg, "" ) )
                            console.log( 'no date:'+'title:' + title.replace( reg, "" ) )
                            console.log('no date:'+articleDate.getFullYear() + ' ' + (articleDate.getMonth()+1) + ' ' + articleDate.getDate())
                            console.log( 'no date:'+'article.author:' + article.author.replace( reg, "" ) )
                            console.log( 'no date:'+'article.title:' + article.title.replace( reg, "" ) )
                            console.log('no date:'+compareDate.getFullYear() + ' ' + (compareDate.getMonth()+1) + ' ' + compareDate.getDate())
                            //过滤所有中文符号
                            //文章标题、作者、发布日期 三个条件的校验
                            if( article.title.replace( reg, "" ) == title.replace( reg, "" ) && article.author.replace( reg, "" ) == author.replace( reg, "" ) && articleDate.getFullYear() + ' ' + articleDate.getMonth() + ' ' + articleDate.getDate() == compareDate.getFullYear() + ' ' + compareDate.getMonth() + ' ' + compareDate.getDate() ){
                                found = true;
                                dataUrl =url;
                                cb2( 'found', url );
                                return;
                            }
                        } );
                        if(!found){
                            cb2( null, null );
                        }
                    } else{
                        cb2( null, null );
                    }
                } );
            },function(err){
                if(err=='found'){
                    //找到文章
                    dataUrls =dataUrl;
                    cb1('found',dataUrl);
                    return;
                }
                if(dataUrl==null){
                    cb1('not found',null);
                    return;
                }
                cb1(null,dataUrl);
            })
        },function(cb1){
            //有日期选择的
            //需要查询几页
            var index = 1;
            var length = PAGE_LENGTH;
            var dataUrl = null;
            var isFound = false;
            async.whilst(function(){
                return index<length;
            },function(cb2){
                //console.log('have date:'+index)
                var url = WEIXIN_URL_IDG+'&page='+(index++);
                //console.log('have date.url:'+url)

                var option = {
                    "uri" : url, "method" : "GET", "headers" : {
                        //"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
                        "User-Agent" : USER_AGENT_ARR[Math.floor( Math.random() * USER_AGENT_ARR.length + 1 )],
                        "SNUID" : "8263ED786573860A57104A7C00096335",
                        "SUV" : "00E75A037176F6875771EE779F7E4418"
                    }
                };
                request( option, function( err, res, body ){
                    //console.log(err);
                    //console.log(body);
                    var $ = cheerio.load( body );
                    var contentLeft = $( ".main" );
                    var links = $( '.results .txt-box' );
                    var articles = $( '.txt-box' );
                    if( links.length > 0 ){
                        var found = false;
                        //console.log('have date.links:'+links.length)
                        links.each( function( i, e ){
                            var element = $( this ).find( 'h4 a[href]' ).eq( 0 );
                            //console.log(element)
                            var title = element.text();
                            var beforeUrl = element.attr( 'href' );
                            var account_link = $( this ).find( '.s-p a[href]' ).eq( 0 );
                            var author = account_link.attr( 'title' );
                            var time = $( this ).find( '.s-p span' ).eq( 0 ).text();
                            time = time.substring( time.indexOf( '\'' ) + 1, time.lastIndexOf( '\'' ) );
                            var articleDate = new Date( parseInt( time + '000' ) );
                            //time.replace('vrTimeHandle552write(','').replace(')','');
                            var url = beforeUrl.replace( 'http://mp.weixin.qq.com/s', 'http://mp.weixin.qq.com/mp/getcomment' );
                            //console.log( 'have date:'+'------------' )
                            //console.log('have date:'+ 'author:' + author.replace( reg, "" ) )
                            //console.log( 'have date:'+'title:' + title.replace( reg, "" ) )
                            //console.log('have date:'+articleDate.getFullYear() + ' ' + (articleDate.getMonth()+1) + ' ' + articleDate.getDate())
                            //console.log('have date:'+ 'article.author:' + article.author.replace( reg, "" ) )
                            //console.log('have date:'+ 'article.title:' + article.title.replace( reg, "" ) )
                            //console.log('have date:'+compareDate.getFullYear() + ' ' + (compareDate.getMonth()+1) + ' ' + compareDate.getDate())
                            //过滤所有中文符号
                            //文章标题、作者、发布日期 三个条件的校验
                            if( article.title.replace( reg, "" ) == title.replace( reg, "" ) && article.author.replace( reg, "" ) == author.replace( reg, "" ) && articleDate.getFullYear() + ' ' + articleDate.getMonth() + ' ' + articleDate.getDate() == compareDate.getFullYear() + ' ' + compareDate.getMonth() + ' ' + compareDate.getDate() ){
                                found = true;
                                dataUrl =url;
                                cb2( 'found', url );
                                return;
                            }
                        } );
                        if(!found){
                            cb2( null, null );
                        }
                    } else{
                        cb2( null, null );
                    }
                } );
            },function(err){
                //console.log(dataUrl)
                if(err=='found'){
                    //找到文章
                    dataUrls =dataUrl;
                    cb1('found',dataUrl);
                    return;
                }
                if(dataUrl==null){
                    cb1('not found',null);
                    return;
                }
                cb1(null,dataUrl);
            })
        }],function(err,results){
            if(err=='found'){
                cb(null,dataUrls);
                return;
            }
            cb('not found',dataUrls);
        })
    }, function( url, cb ){
        var option = {
            "uri" : url, "method" : "GET", "headers" : {
                "User-Agent" : USER_AGENT_ARR[Math.floor( Math.random() * 17 + 1 )],
                "SNUID" : "B21D87D2090C3C55DFF20A8009467E07",
                "SUV" : "1466052015964554"
            }
        };
        request( option, function( err, res, body ){
            result.read_num = JSON.parse( body ).read_num;
            result.like_num = JSON.parse( body ).like_num;
            cb( err, {read_num:JSON.parse( body ).read_num,like_num:JSON.parse( body ).like_num} );
        } );
    }], function( err, res ){
        if(err){
            result.read_num = 0;
            result.like_num = 0;
        }
        result.url=url;
        callback( err, result );
    } )
}

function parseWxUrl( url, callback ){
    request.get( url, function( err, res, body ){
        //console.log(err);
        //console.log(body);
        var $ = cheerio.load( body );
        var title = $( '#img-content' ).children( '.rich_media_title' ).text();
        var author = $( '#img-content' ).children( '.rich_media_meta_list' ).find( '.rich_media_meta_nickname' ).eq( 1 ).text();
        var date = $( '#post-date', '#img-content' ).text();
        var img = $( '#js_content' ).find( 'img' ).attr( 'data-src' );
        var summary = $( '#js_content' ).find( 'p' ).eq( 3 ).text();
        var content = $( '#js_content' ).html();
        var startIndex = body.indexOf( 'msg_source_url' );
        var str = body.substring( startIndex, body.length );
        str = str.substring( str.indexOf( '\'' ) + 1, body.length );
        var link = str.substring( 0, str.indexOf( '\'' ) );
        var article = {
            title : title.trim(),
            author : author,
            img : img,
            date : date,
            summary : summary,
            content : content,
            link : link
        };
        /*console.log('title:'+title.trim());
         console.log('author:'+author);
         console.log('img:'+img);
         console.log('summary:'+summary);
         console.log('content:'+content);
         console.log('link:'+link);*/
        callback( err, article );
    } );
}