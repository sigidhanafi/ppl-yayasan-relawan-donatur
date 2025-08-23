'use client';

import { useState } from 'react';

function StatusBadge({ status }) {
  const color =
    status === 'APPROVED'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : status === 'REJECTED'
      ? 'bg-rose-100 text-rose-800 border-rose-200'
      : 'bg-amber-100 text-amber-800 border-amber-200';
  const label =
    status === 'APPROVED'
      ? 'Disetujui'
      : status === 'REJECTED'
      ? 'Ditolak'
      : 'Menunggu';
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}

export default function RelawanList({ rows: initialRows }) {
  const [rows, setRows] = useState(initialRows || []);
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  async function callAction(vaId, action) {
    setBusyId(vaId);
    setMsg(null);
    setErr(null);
    try {
      // Panggil endpoint kamu (buat di /api/volunteers/[id]/approve & /reject)
      const res = await fetch(`/api/volunteers/${vaId}/${action}`, {
        method: 'POST',
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.message || `Gagal ${action}.`);

      // update UI lokal
      setRows((prev) =>
        prev.map((r) =>
          r.vaId === vaId
            ? { ...r, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
            : r
        )
      );
      setMsg(
        j?.message ||
          `Berhasil ${action === 'approve' ? 'menyetujui' : 'menolak'} relawan.`
      );
    } catch (e) {
      setErr(e.message || 'Terjadi kesalahan.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className='rounded-md border border-slate-200 bg-white overflow-hidden mt-6'>
      {(msg || err) && (
        <div className='p-3 border-b border-slate-200'>
          {msg && <div className='text-sm text-emerald-700'>{msg}</div>}
          {err && <div className='text-sm text-rose-700'>{err}</div>}
        </div>
      )}

      <div className='overflow-x-auto'>
        <table className='min-w-full text-sm'>
          <thead className='bg-slate-50 text-slate-700'>
            <tr>
              <th className='px-4 py-3 text-left font-medium'>Nama</th>
              <th className='px-4 py-3 text-left font-medium'>Phone</th>
              <th className='px-4 py-3 text-left font-medium'>Alamat</th>
              <th className='px-4 py-3 text-left font-medium'>Status</th>
              <th className='px-4 py-3 text-center font-medium'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className='px-4 py-6 text-center text-slate-500'
                >
                  Belum ada data relawan.
                </td>
              </tr>
            )}

            {rows.map((r) => (
              <tr key={r.user.id} className='border-t border-slate-100'>
                <td className='px-4 py-3'>
                  <div className='font-medium text-slate-900'>
                    {r.user.name}
                  </div>
                  <div className='text-xs text-slate-500'>{r.user.email}</div>
                </td>
                <td className='px-4 py-3'>{r.user.phone || '-'}</td>
                <td className='px-4 py-3'>{r.user.address || '-'}</td>
                <td className='px-4 py-3'>
                  <StatusBadge status={r.status} />
                </td>
                <td className='px-4 py-3'>
                  <div className='flex justify-end gap-2'>
                    <button
                      onClick={() => callAction(r.vaId, 'approve')}
                      disabled={busyId === r.vaId || r.status === 'APPROVED'}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium text-white 
                        ${
                          busyId === r.vaId || r.status === 'APPROVED'
                            ? 'bg-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => callAction(r.vaId, 'reject')}
                      disabled={busyId === r.vaId || r.status === 'REJECTED'}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium text-white 
                        ${
                          busyId === r.vaId || r.status === 'REJECTED'
                            ? 'bg-slate-400 cursor-not-allowed'
                            : 'bg-rose-600 hover:bg-rose-700'
                        }`}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
