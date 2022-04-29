export default function formatDecimals(value: string | number, units?: number): string {
  let number: string;
  let formattedValue: string;
  if (typeof value === 'number') {
    number = value.toString()
  } else {
    number = value;
  }
  let indexDot = number.indexOf('.')
  if (indexDot < 3) {
    formattedValue = new Number(number).toFixed(6)
  } else {
    formattedValue = new Number(number).toFixed(2)
  }
  return formattedValue
}