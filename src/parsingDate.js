export default function parsingDate(date) {
  date = new Date(date);
  let today = new Date();
  let gap = today - date;
  if (gap < 1000 * 60) return "방금 전";
  const daySeconds = 24 * 60 * 60 * 1000;
  let minuteGap = Math.floor(
    (gap % (daySeconds / 24)) / (daySeconds / (60 * 24))
  );
  let hourGap = Math.floor((gap % daySeconds) / (daySeconds / 24));
  let dayGap = parseInt(gap / daySeconds);
  let monthGap = parseInt(gap / (daySeconds * 30));
  let yearGap = parseInt(gap / (daySeconds * 30 * 12));
  if (yearGap) return yearGap + "년 전";
  if (monthGap) return monthGap + "달 전";
  if (dayGap) return dayGap + "일 전";
  if (hourGap) return hourGap + "시간 전";
  if (minuteGap) return minuteGap + "분 전";
}
