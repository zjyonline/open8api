var nowDate = new Date(1467003934000);
var dateStr = '2015-8-19';
var compareDate = new Date();
compareDate.setFullYear(dateStr.split('-')[0])
compareDate.setMonth(parseInt(dateStr.split('-')[1])-1)
compareDate.setDate(dateStr.split('-')[2])
console.log(compareDate);
console.log(nowDate);
console.log(nowDate-compareDate)


//一天  0-86400000
//一周  86400000-604800000
//一月  604800000-2678400000
//一年  2678400000-31622400000