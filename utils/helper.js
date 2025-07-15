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
