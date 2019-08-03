export function stringToBoolean(str) {
  let error;
  if (typeof str === 'string') {
    error = new Error(`${str} can only be a string`);
  }
  if (str === '0') return false;
  if (str === '1') return true;
  new Error(`Cannot convert string '${str}' into a boolean`);
  errors.push(error)
}

export function stringToNumber(str) {
  let error;
  if (typeof str === 'string') {
    error = new Error(`${str} can only be a string`);
  }
  const result = Number(str);
  if (!isNaN(result)) return result;

  new Error(`Cannot convert string '${str}' into a number`);
  errors.push(error)
}
