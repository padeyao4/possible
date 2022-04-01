function dateToString(date: Date) {
  return date.toDateString();
}

export function add(date: Date, day: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + day);
  return newDate;
}
