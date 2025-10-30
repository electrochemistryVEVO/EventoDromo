export function compactFormat(value: number) {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });

  return formatter.format(value);
}

export function standardFormat(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function dateFormat(_value: Date) {
  const value = new Date(_value);
  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const yyyy = value.getFullYear();
  const mm = value.getMonth() + 1;
  const dd = value.getDate();

  const monthLabel = mm >= 10 ? `${mm}` : `0${mm}`;
  const dayLabel = dd >= 10 ? `${dd}` : `0${dd}`;

  return `${yyyy}-${monthLabel}-${dayLabel}`;
}

export function timeFormat(_value: Date){
  let value = new Date(_value)
  let hh = value.getHours();
  let mm = value.getMinutes();
  return `${hh>=10?hh:'0'+hh}:${mm>=10?mm:'0'+mm}`
}