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

export function dateFormat(_value: Date){
    let value = new Date(_value)
    let yyyy = value.getFullYear()
    let mm = value.getMonth()
    let dd = value.getDate()
    return `${yyyy}-${mm>=10?mm:'0'+mm}-${dd>=10?dd:'0'+dd}`
}

export function timeFormat(_value: Date){
  let value = new Date(_value)
  let hh = value.getHours();
  let mm = value.getMinutes();
  return `${hh>=10?hh:'0'+hh}:${mm>=10?mm:'0'+mm}`
}