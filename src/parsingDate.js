export default function parsingDate(date) {
  date = new Date(date);
  let month = date.getMonth() + 1;
  let _date = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  if (month < 10) {
    month = "0" + month;
  }
  return (
    date.getFullYear() +
    "-" +
    month +
    "-" +
    _date +
    " " +
    hours +
    ":" +
    minutes +
    ""
  );
}
