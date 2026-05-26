export default function formatMiles(number, withoutDecimal = false) {
const formatter = new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: withoutDecimal ? 0 : 2,
    maximumFractionDigits: withoutDecimal ? 0 : 2,
    useGrouping: true, 
  });

  return formatter.format(number);
}


