const ALLOWED_STATUS = ['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED'];

export function toIntOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// export function nonNegOrNull(v) {
//   const n = toIntOrNull(v);
//   if (n === null) return null;
//   if (n < 0) throw new Error('quota harus >= 0');
//   return n;
// }

// export function assertRequired(obj, keys) {
//   for (const k of keys) {
//     if (obj[k] === undefined || obj[k] === null || obj[k] === '')
//       throw new Error(`Field '${k}' wajib diisi`);
//   }
// }

export function assertRequired(obj, keys) {
  const miss = keys.filter(
    (k) => obj[k] === undefined || obj[k] === null || obj[k] === ''
  );

  if (miss.length) {
    const e = new Error(`Missing required field(s): ${miss.join(', ')}`);
    e.code = 'VALIDATION';
    throw e;
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

export function parseDateAny(input) {
  // input dari form sudah ISO UTC; tetap aman untuk datetime-local juga
  const d = new Date(String(input));
  if (isNaN(d.getTime())) {
    const e = new Error('Tanggal tidak valid.');
    e.code = 'VALIDATION';
    throw e;
  }
  return d; // biarkan Date; Prisma akan simpan sebagai timestamp
}

export function nonNegOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) {
    const e = new Error('Kuota harus angka >= 0.');
    e.code = 'VALIDATION';
    throw e;
  }
  // jika ingin integer:
  return Math.floor(n);
}

export function pickStatus(s) {
  if (!s) return 'DRAFT';
  if (!ALLOWED_STATUS.includes(s)) {
    const e = new Error(
      `Status tidak valid. Gunakan salah satu: ${ALLOWED_STATUS.join(', ')}`
    );
    e.code = 'VALIDATION';
    throw e;
  }
  return s;
}
