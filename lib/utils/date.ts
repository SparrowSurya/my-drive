
export const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDate = (d: Date): string => {
  const date = d.getDate();
  const month = Months[d.getMonth()];
  const year = d.getFullYear();
  return `${date} ${month}, ${year}`;
}
