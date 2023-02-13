export type timeType = `${string}:${string} ${'AM' | 'PM'}`
export type dateType = `${string}/${string}/${string}`;

export const parseDateTimeString = (date: dateType, time: timeType) => {
  const [day, month, year] = date.split('/').map((s) => +s);
  const finalDate = new Date(year + 2000, month, day)

  const timeArray = time.split(" ");
  const hoursAndMinutes = timeArray[0].split(":");

  let hours = parseInt(hoursAndMinutes[0]);
  const minutes = parseInt(hoursAndMinutes[1]);
  const period = timeArray[1];

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  finalDate.setHours(hours);
  finalDate.setMinutes(minutes);
  return finalDate.valueOf();
}
