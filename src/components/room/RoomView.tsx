import React from 'react';
import { Building2, Users, Stethoscope, CheckCircle2 } from 'lucide-react';
import { Room, Equipment } from '../../types/inventory';

interface RoomViewProps {
  rooms: Room[];
  equipment: Equipment[];
  onSelectRoomFilter?: (roomId: string) => void;
}

export const RoomView: React.FC<RoomViewProps> = ({ rooms, equipment, onSelectRoomFilter }) => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-sky-600" />
            <span>Manajemen Ruangan Perawatan IRIN</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar unit ICU, HCU, NICU, PICU, Kepala Ruangan penanggung jawab, dan distribusi alat kesehatan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const roomEquip = equipment.filter(e => e.roomId === room.id);
          return (
            <div key={room.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                    {room.code}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {room.conditionStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 mt-2">{room.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Lokasi: {room.location}</p>

                <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-semibold">Kepala Ruangan:</span>
                    <span className="font-bold text-slate-800">{room.headName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-semibold">Kapasitas Tempat Tidur:</span>
                    <span className="font-bold text-slate-800">{room.capacity} Bed</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-semibold">Jumlah Alat Kesehatan:</span>
                    <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {roomEquip.length} Unit Alat
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Daftar Alat di Ruangan Ini:
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {roomEquip.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Belum ada alat terdaftar.</p>
                  ) : (
                    roomEquip.map((eq) => (
                      <div key={eq.id} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-50 border border-slate-100">
                        <span className="font-medium text-slate-700 truncate max-w-[160px]">{eq.name}</span>
                        <span className="font-mono text-[9px] text-slate-500">{eq.inventoryNo}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
