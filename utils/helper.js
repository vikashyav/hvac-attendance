import moment from "moment";
export function formatTimeDifference(startTime, endTime) {
  const diffMs = Math.abs(new Date(endTime) - new Date(startTime));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (totalHours < 24) {
    return `${totalHours} hour${totalHours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
  }
}


export function formatWorkingHours(hoursDecimal) {
  const hours = Math.floor(hoursDecimal);
  const minutes = Math.round((hoursDecimal - hours) * 60);

  const hText = hours === 1 ? "1 hour" : `${hours} h`;
  const mText = minutes === 1 ? "1 minute" : `${minutes} m`;

  if (hours && minutes) return `${hText} ${mText}`;
  if (hours) return hText;
  if (minutes) return mText;
  return "0 minutes";
}

export function formatDate(date) {
  return moment(date).calendar(null, {
    sameDay: "[Today]",      // If the date is today
    nextDay: "[Tomorrow]",   // If the date is tomorrow
    nextWeek: "dddd",        // If the date is within the next week
    lastDay: "[Yesterday]",  // If the date was yesterday
    lastWeek: "[Last] dddd", // If the date is within the last week
    sameElse: "DD/MM/YYYY"   // Everything else
  });
}