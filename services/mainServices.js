export function parseTime(time) {
   var timeArr = time.split(':');
   let minutes = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
   return minutes;
}

export function totalRecycle(remainder) {
   let hour = Math.floor(remainder/60);
   let minute = remainder % 60;
   minute = (minute < 10) ? ('0' + minute) : minute;
   return hour + " час" + minute + ' минут';
}

export function dateStringFormat(time) {
	return time.getHours() + ':' + (time.getMinutes()<10 ? '0': '') + time.getMinutes()
}