import React, { useState } from 'react';
import { Building2, Users, Stethoscope, CheckCircle2, Plus, Pencil, Trash2, X, Search, Filter } from 'lucide-react';
import { Room, Equipment } from '../../types/inventory';

interface RoomViewProps {
  rooms: Room[];
  equipment: Equipment[];
  onSelectRoomFilter?: (roomId: string) => void;
  onAddRoom?: (r: Partial<Room>) => void;
  onUpdateRoom?: (id: string, r: Partial<Room>) => void;
  onDeleteRoom?: (id: string) => void;
}

export const RoomView: React.FC<RoomViewProps> = ({
  rooms,
  equipment,
  onSelectRoomFilter,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({
    code: `R-ICU-00${rooms.length + 1}`,
    name: '',
    building: 'Gedung Medis',
    floor: 'Lantai 2',
    location: 'Gedung Medis Fl 2',
    headName: 'Ns. Kepala Ruangan, S.Kep',
    headPhone: '0812-3344-5566',
    capacity: 10,
    conditionStatus: 'Steril / Siap',
    notes: ''
  });

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      code: `R-ICU-00${rooms.length + 1}`,
      name: '',
      building: 'Gedung Medis',
      floor: 'Lantai 2',
      location: 'Gedung Medis Fl 2',
      headName: 'Ns. Kepala Ruangan, S.Kep',
      headPhone: '0812-3344-5566',
      capacity: 10,
      conditionStatus: 'Steril / Siap',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      ...room,
      building: room.building || room.location?.split(' ')[0] || 'Gedung Medis',
      floor: room.floor || 'Lantai 2',
      notes: room.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ruangan ini?')) {
      if (onDeleteRoom) onDeleteRoom(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = `${formData.building || 'Gedung Medis'} ${formData.floor || ''}`.trim();
    const payload = {
      ...formData,
      location: loc
    };
    if (editingRoom) {
      if (onUpdateRoom) onUpdateRoom(editingRoom.id, payload);
    } else {
      if (onAddRoom) onAddRoom(payload);
    }
    setIsModalOpen(false);
  };

  // Buildings list for filter
  const buildingsList = Array.from(new Set(rooms.map(r => r.building || r.location?.split(' ')[0] || 'Gedung Medis')));

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.headName && room.headName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.location && room.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const roomBldg = room.building || room.location?.split(' ')[0] || 'Gedung Medis';
    const matchesBuilding = selectedBuilding === 'ALL' || roomBldg === selectedBuilding;

    return matchesSearch && matchesBuilding;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-sky-600" />
            <span>Manajemen Lokasi & Ruangan IRIN</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar unit ICU, HCU, NICU, PICU, Gedung, Lantai, Penanggung Jawab (PIC), dan kapasitas bed
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Ruangan Baru</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama ruangan, kode, gedung, atau penanggung jawab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2 min-w-[200px]">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="ALL">Semua Gedung</option>
            {buildingsList.map(bldg => (
              <option key={bldg} value={bldg}>{bldg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const roomEquip = equipment.filter(e => e.roomId === room.id);
          return (
            <div key={room.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                    {room.code}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {room.conditionStatus}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(room)}
                        className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
                        title="Edit Ruangan"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Hapus Ruangan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 mt-2">{room.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">{room.building || 'Gedung Medis'}</span> • {room.floor || 'Lantai 2'}
                </p>

                <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-semibold">Penanggung Jawab (PIC):</span>
                    <span className="font-bold text-slate-800">{room.headName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-semibold">No. Kontak PIC:</span>
                    <span className="font-mono text-slate-600">{room.headPhone || '-'}</span>
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
                  {room.notes && (
                    <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded mt-1 border border-slate-100">
                      Catatan: {room.notes}
                    </div>
                  )}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingRoom ? 'Edit Data Ruangan' : 'Tambah Ruangan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Ruangan:</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ruangan / Unit:</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gedung:</label>
                  <input
                    type="text"
                    value={formData.building || ''}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    placeholder="mis. Gedung Medis / Gedung A"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lantai:</label>
                  <input
                    type="text"
                    value={formData.floor || ''}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="mis. Lantai 2"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab (PIC):</label>
                  <input
                    type="text"
                    value={formData.headName || ''}
                    onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. HP PIC:</label>
                  <input
                    type="text"
                    value={formData.headPhone || ''}
                    onChange={(e) => setFormData({ ...formData, headPhone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kapasitas Tempat Tidur:</label>
                  <input
                    type="number"
                    value={formData.capacity || 0}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Ruangan:</label>
                  <select
                    value={formData.conditionStatus || 'Steril / Siap'}
                    onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-semibold"
                  >
                    <option value="Steril / Siap">Steril / Siap</option>
                    <option value="Penuh">Penuh</option>
                    <option value="Perawatan / Renovasi">Perawatan / Renovasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Catatan Tambahan:</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Catatan fasilitas khusus ruangan..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20"
                >
                  Simpan Ruangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
