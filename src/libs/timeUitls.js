export const formatDate = time =>{
  var date = new Date(time);

  var year = date.getFullYear(),
    month = date.getMonth()+1,//月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  var newTime = year + '-' +
    (month < 10? '0' + month : month) + '-' +
    (day < 10? '0' + day : day) + ' ' +
    (hour < 10? '0' + hour : hour) + ':' +
    (min < 10? '0' + min : min) + ':' +
    (sec < 10? '0' + sec : sec);

  return newTime;
}

export const timeAgo = days =>{
  var time = new Date();
  time.setTime(time.getTime()- days*24*60*60*1000);
  return time;
}

export const str2time = timeStr =>{
  var time = new Date();
  time.setTime(timeStr);
  return formatDate(time);
}
