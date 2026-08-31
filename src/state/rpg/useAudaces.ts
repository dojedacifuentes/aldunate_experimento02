'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { evidenceById } from '@/data/rpg/evidence';
import { especialidades, statsBase } from '@/data/rpg/skills';
import {
  impulsoTrasAcierto,
  impulsoTrasFallo,
  nivelDesde,
  xpConCombo,
} from '@/lib/rpg/scoring';
import { SAVE_KEY, SAVE_VERSION, almacenamientoSeguro, migrar, type SaveShape } from '@/lib/rpg/save';
import type { AvatarId, Effects, Especialidad, Stats } from '@/types/game';

export type Fase = 'portada' | 'creacion' | 'juego' | 'fin';

export interface Aviso {
  id: number;
  texto: string;
  tono: 'xp' | 'evidencia' | 'stat' | 'aviso';
}

type Estado = SaveShape & {
  fase: Fase;
  avisos: Aviso[];
  /** Sólo memoria: no se persiste, se recalcula al montar. */
  hidratado: boolean;
};

type Acciones = {
  crearPersonaje: (datos: {
    nombre: string;
    avatar: AvatarId;
    especialidad: Especialidad;
  }) => void;
  irA: (nodeId: string) => void;
  aplicar: (efectos: Effects | undefined, acierta: boolean) => void;
  registrarDecision: (nodeId: string, opcionId: string, acierta: boolean) => void;
  otorgarEvidencia: (id: string) => void;
  tieneEvidencia: (id: string) => boolean;
  setFlag: (flag: string) => void;
  terminar: (finalId: string) => void;
  descartarAviso: (id: number) => void;
  reiniciar: () => void;
  marcarHidratado: () => void;
};

const INICIAL: SaveShape = {
  saveVersion: SAVE_VERSION,
  creado: 0,
  ultimoGuardado: 0,
  player: null,
  capitulo: 'prologo',
  nodeId: null,
  evidencias: [],
  flags: {},
  impulso: 0,
  combo: 0,
  decisiones: [],
  finales: [],
};

let avisoSeq = 0;

/**
 * `set` del propio store, capturado al crearlo.
 *
 * Lo necesita `onRehydrateStorage`: cuando `localStorage` está bloqueado, Zustand
 * invoca ese callback **sin estado**, y sin esta referencia no habría forma de
 * levantar la bandera de hidratado. La consecuencia era una pantalla de
 * «Cargando…» permanente en navegación privada.
 */
let setStore: ((parcial: Partial<Estado>) => void) | null = null;

function aplicarVentaja(base: Stats, especialidad: Especialidad): Stats {
  const perfil = especialidades.find((e) => e.id === especialidad);
  if (!perfil) return { ...base };
  return { ...base, ...sumar(base, perfil.ventaja) };
}

function sumar(base: Stats, delta: Partial<Stats>): Partial<Stats> {
  const salida: Partial<Stats> = {};
  (Object.keys(delta) as (keyof Stats)[]).forEach((k) => {
    salida[k] = Math.max(0, base[k] + (delta[k] ?? 0));
  });
  return salida;
}

export const useAudaces = create<Estado & Acciones>()(
  persist(
    (set, get) => {
      setStore = set as (parcial: Partial<Estado>) => void;
      return {
      ...INICIAL,
      fase: 'portada',
      avisos: [],
      hidratado: false,

      marcarHidratado: () => set({ hidratado: true }),

      crearPersonaje: ({ nombre, avatar, especialidad }) => {
        const ahora = Date.now();
        set({
          ...INICIAL,
          creado: ahora,
          ultimoGuardado: ahora,
          fase: 'juego',
          player: {
            nombre: nombre.trim() || 'Sin nombre',
            avatar,
            especialidad,
            stats: aplicarVentaja(statsBase, especialidad),
            xp: 0,
            nivel: 1,
          },
          avisos: [],
        });
      },

      irA: (nodeId) => set({ nodeId, ultimoGuardado: Date.now() }),

      aplicar: (efectos, acierta) => {
        const estado = get();
        const player = estado.player;
        const combo = acierta ? estado.combo + 1 : 0;
        const avisos: Aviso[] = [];

        let xp = player?.xp ?? 0;
        if (efectos?.xp) {
          const ganada = xpConCombo(efectos.xp, estado.combo);
          xp += ganada;
          avisos.push({ id: (avisoSeq += 1), texto: `+${ganada} XP`, tono: 'xp' });
        }

        let stats = player?.stats ?? statsBase;
        if (efectos?.stats) {
          stats = { ...stats, ...sumar(stats, efectos.stats) } as Stats;
          (Object.keys(efectos.stats) as (keyof Stats)[]).forEach((k) => {
            const d = efectos.stats?.[k] ?? 0;
            if (d !== 0) {
              avisos.push({
                id: (avisoSeq += 1),
                texto: `${d > 0 ? '+' : ''}${d} ${k}`,
                tono: 'stat',
              });
            }
          });
        }

        const flags = { ...estado.flags };
        if (efectos?.flag) flags[efectos.flag] = true;

        const evidencias = [...estado.evidencias];
        if (efectos?.otorgaEvidencia && !evidencias.some((e) => e.id === efectos.otorgaEvidencia)) {
          const pieza = evidenceById(efectos.otorgaEvidencia);
          if (pieza) {
            evidencias.push(pieza);
            avisos.push({ id: (avisoSeq += 1), texto: `Expediente: ${pieza.nombre}`, tono: 'evidencia' });
          }
        }

        const nivelNuevo = nivelDesde(xp);
        if (player && nivelNuevo > player.nivel) {
          avisos.push({ id: (avisoSeq += 1), texto: `Nivel ${nivelNuevo}`, tono: 'aviso' });
        }

        set({
          player: player ? { ...player, xp, stats, nivel: nivelNuevo } : null,
          flags,
          evidencias,
          combo,
          impulso: acierta ? impulsoTrasAcierto(estado.impulso) : impulsoTrasFallo(estado.impulso),
          avisos: [...estado.avisos, ...avisos].slice(-5),
          ultimoGuardado: Date.now(),
        });
      },

      registrarDecision: (nodeId, opcionId, acierta) =>
        set((s) => ({ decisiones: [...s.decisiones, { nodeId, opcionId, acierta }] })),

      otorgarEvidencia: (id) => {
        const pieza = evidenceById(id);
        if (!pieza) return;
        set((s) =>
          s.evidencias.some((e) => e.id === id)
            ? s
            : {
                evidencias: [...s.evidencias, pieza],
                avisos: [
                  ...s.avisos,
                  { id: (avisoSeq += 1), texto: `Expediente: ${pieza.nombre}`, tono: 'evidencia' as const },
                ].slice(-5),
              },
        );
      },

      tieneEvidencia: (id) => get().evidencias.some((e) => e.id === id),

      setFlag: (flag) => set((s) => ({ flags: { ...s.flags, [flag]: true } })),

      /**
       * Cierra el capítulo.
       *
       * Deja `veredicto_cobrado` en los flags: la recompensa del desenlace se
       * entrega una sola vez, aunque alguien recargue la página sobre el nodo
       * final. Sin esa marca, recargar volvía a sumar la XP del veredicto.
       */
      terminar: (finalId) =>
        set((s) => ({
          fase: 'fin',
          flags: { ...s.flags, veredicto_cobrado: true },
          finales: s.finales.includes(finalId) ? s.finales : [...s.finales, finalId],
          ultimoGuardado: Date.now(),
        })),

      descartarAviso: (id) => set((s) => ({ avisos: s.avisos.filter((a) => a.id !== id) })),

      reiniciar: () => set({ ...INICIAL, fase: 'portada', avisos: [], hidratado: true }),
      };
    },
    {
      name: SAVE_KEY,
      version: SAVE_VERSION,
      storage: createJSONStorage(almacenamientoSeguro),
      migrate: (persistido, version) => migrar(persistido, version) as Estado & Acciones,
      // Los avisos son estado de sesión y no se guardan. La fase sí: sin ella,
      // recargar sobre el nodo final devolvía al jugador al veredicto.
      partialize: (s) => ({
        saveVersion: s.saveVersion,
        fase: s.fase,
        creado: s.creado,
        ultimoGuardado: s.ultimoGuardado,
        player: s.player,
        capitulo: s.capitulo,
        nodeId: s.nodeId,
        evidencias: s.evidencias,
        flags: s.flags,
        impulso: s.impulso,
        combo: s.combo,
        decisiones: s.decisiones,
        finales: s.finales,
      }),
      /**
       * Se ejecuta al terminar la rehidratación, haya o no datos que rehidratar.
       * Si `localStorage` falla —navegación privada, permisos, cuota— Zustand
       * llama a este callback sin estado: la bandera se levanta igual y el juego
       * arranca sin partida guardada, que es exactamente lo que corresponde.
       */
      onRehydrateStorage: () => (estado) => {
        if (estado) estado.marcarHidratado();
        else setStore?.({ hidratado: true });
      },
    },
  ),
);
