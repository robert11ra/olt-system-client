export function formatNumberInput(value="0,00", separator = ",", symbol) {
  
  let number = value?.toString()?.replace(/[^0-9]/g, "");
  if (number.length <= 2) {
    number = number.padStart(3, "0");
  }
  const formattedNumber = `${number.slice(0, -2)}.${number.slice(-2)}`; // Agregar el separador antes de los últimos 3 dígitos

  return `${symbol ? symbol + " " : ""}${Number(formattedNumber)
    .toFixed(2)
    .toString()
    .replace(".", separator)
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator === "," ? "." : ",")}`; // Reemplazar el punto por el separador y agregar el separador cada 3 dígitos
}

export function formatInputToNumber(value, separator = ",") {
  const number = value
    .replaceAll(separator === "," ? "." : ",", "")
    .replaceAll(separator === "," ? "," : ".", ".")
    .replace(/[^0-9.]/g, "");
  return parseFloat(number);
}
