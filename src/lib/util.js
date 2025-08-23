export function toIntOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function nonNegOrNull(v) {
  const n = toIntOrNull(v);
  if (n === null) return null;
  if (n < 0) throw new Error('quota harus >= 0');
  return n;
}

export function assertRequired(obj, keys) {
  for (const k of keys) {
    if (obj[k] === undefined || obj[k] === null || obj[k] === '')
      throw new Error(`Field '${k}' wajib diisi`);
  }
}

export function toUTC(dateStr) {
  const hasTZ = /[zZ]|[+\-]\d{2}:?\d{2}$/.test(dateStr);
  if (hasTZ) return new Date(dateStr);
  const normalized = String(dateStr).replace(' ', 'T');
  const local = new Date(normalized);
  return new Date(
    Date.UTC(
      local.getFullYear(),
      local.getMonth(),
      local.getDate(),
      local.getHours(),
      local.getMinutes(),
      local.getSeconds(),
      local.getMilliseconds()
    )
  );
}
