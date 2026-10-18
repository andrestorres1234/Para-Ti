import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DedicationConfig, DEFAULT_DEDICATION, UniverseItem } from '../data/universes';
import { X, Save, RotateCcw, Heart, Edit3, Plus, Trash2 } from 'lucide-react';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DedicationConfig;
  onSaveConfig: (newConfig: DedicationConfig) => void;
  universes: UniverseItem[];
  onSaveUniverses: (newUniverses: UniverseItem[]) => void;
  onResetAll: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  universes,
  onSaveUniverses,
  onResetAll,
}) => {
  const [activeTab, setActiveTab] = useState<'names' | 'messages'>('names');
  const [partnerName, setPartnerName] = useState(config.partnerName);
  const [senderName, setSenderName] = useState(config.senderName);
  const [specialDate, setSpecialDate] = useState(config.specialDate);

  // Editable universes list state
  const [editableUniverses, setEditableUniverses] = useState<UniverseItem[]>(universes);
  const [editingUniverseId, setEditingUniverseId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSaveNames = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      partnerName: partnerName.trim() || 'Mi Amor',
      senderName: senderName.trim() || 'Tu Novio',
      specialDate: specialDate.trim() || 'Por siempre',
    });
    onClose();
  };

  const handleSaveUniverseItem = (id: number, updatedFields: Partial<UniverseItem>) => {
    const updated = editableUniverses.map((u) => (u.id === id ? { ...u, ...updatedFields } : u));
    setEditableUniverses(updated);
    onSaveUniverses(updated);
    setEditingUniverseId(null);
  };

  const handleAddNewUniverse = () => {
    const nextId = editableUniverses.length + 1;
    const newUniverse: UniverseItem = {
      id: nextId,
      name: `Universo #${nextId}: Amor Cósmico`,
      subtitle: "Un rincón nuevo creado solo para ti",
      emoji: "💖",
      shortMessage: "Un nuevo universo que inventé para recordarte lo mucho que te amo.",
      fullLetter: [
        "Cada día que paso contigo descubro una nueva razón para amarte más, por eso el universo sigue creciendo sin límite."
      ],
      type: "galaxy",
      coordinates: {
        x: Math.floor(20 + Math.random() * 60),
        y: Math.floor(25 + Math.random() * 55)
      },
      color: {
        primary: "#EC4899",
        secondary: "#F472B6",
        glow: "rgba(236, 72, 153, 0.6)",
        accent: "#FCE7F3",
        bgRing: "from-pink-500/30 to-rose-500/10"
      },
      stats: {
        distance: "Infinito",
        luminosity: "100% Amor",
        gravity: "Inquebrantable"
      },
      soundPitch: 1.2
    };

    const updated = [...editableUniverses, newUniverse];
    setEditableUniverses(updated);
    onSaveUniverses(updated);
    setEditingUniverseId(nextId);
  };

  const handleDeleteUniverse = (id: number) => {
    if (editableUniverses.length <= 3) {
      alert("Es mejor mantener al menos 3 universos para que el cosmos se vea hermoso.");
      return;
    }
    const updated = editableUniverses.filter((u) => u.id !== id);
    setEditableUniverses(updated);
    onSaveUniverses(updated);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-slate-950/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                Personalizar Experiencia
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pon el nombre de tu novia y personaliza los mensajes que ella leerá
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 pt-4 pb-2">
            <button
              onClick={() => setActiveTab('names')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'names'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Nombres y Dedicatoria
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'messages'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Editar Universos ({editableUniverses.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            {activeTab === 'names' ? (
              <form onSubmit={handleSaveNames} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ¿Cómo se llama tu novia? (o su apodo de cariño)
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Ej. Valentina, Mi Princesa, Mi Niña Hermosa"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Aparecerá en los títulos, en el zoom de los universos y en el certificado estelar.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ¿Cómo firmas tú? (Tu nombre o apodo)
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ej. Tu Novio, Andrés, Tu amor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fecha especial o dedicatoria
                  </label>
                  <input
                    type="text"
                    value={specialDate}
                    onChange={(e) => setSpecialDate(e.target.value)}
                    placeholder="Ej. 14 de Febrero, Nuestro Aniversario, Por siempre"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onResetAll}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer todo a predeterminado</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl shadow-lg transition-transform active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar y Aplicar</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs text-slate-400">
                    Puedes modificar los textos, títulos y emojis de cada universo:
                  </span>
                  <button
                    onClick={handleAddNewUniverse}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-pink-300 bg-pink-950/60 border border-pink-700/50 rounded-lg hover:bg-pink-900/60 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Universo</span>
                  </button>
                </div>

                {editableUniverses.map((u) => {
                  const isEditing = editingUniverseId === u.id;
                  return (
                    <div
                      key={u.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{u.emoji}</span>
                          <div>
                            <div className="text-sm font-semibold text-slate-200">
                              #{u.id} {u.name}
                            </div>
                            <div className="text-xs text-pink-300/80">{u.subtitle}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingUniverseId(isEditing ? null : u.id)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors"
                            title="Editar universo"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUniverse(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg bg-slate-800 transition-colors"
                            title="Eliminar universo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <div className="grid grid-cols-4 gap-2">
                            <div className="col-span-1">
                              <label className="text-[10px] text-slate-400 block mb-0.5">Emoji</label>
                              <input
                                type="text"
                                defaultValue={u.emoji}
                                onBlur={(e) =>
                                  handleSaveUniverseItem(u.id, { emoji: e.target.value.trim() || '✨' })
                                }
                                className="w-full px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                              />
                            </div>
                            <div className="col-span-3">
                              <label className="text-[10px] text-slate-400 block mb-0.5">Título</label>
                              <input
                                type="text"
                                defaultValue={u.name}
                                onBlur={(e) =>
                                  handleSaveUniverseItem(u.id, { name: e.target.value.trim() })
                                }
                                className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Mensaje Corto (Frase de portada)</label>
                            <input
                              type="text"
                              defaultValue={u.shortMessage}
                              onBlur={(e) =>
                                handleSaveUniverseItem(u.id, { shortMessage: e.target.value.trim() })
                              }
                              className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Carta / Explicación profunda</label>
                            <textarea
                              rows={3}
                              defaultValue={u.fullLetter.join('\n\n')}
                              onBlur={(e) =>
                                handleSaveUniverseItem(u.id, {
                                  fullLetter: e.target.value
                                    .split('\n\n')
                                    .filter((p) => p.trim().length > 0),
                                })
                              }
                              className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic line-clamp-1">
                          "{u.shortMessage}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
