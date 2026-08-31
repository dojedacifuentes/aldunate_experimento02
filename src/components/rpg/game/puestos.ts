import type { FocusTarget } from '@/types/game';
import type { CharacterId } from '@/types/rpg';

/**
 * Dónde se sienta cada quien en la sala del Capítulo 0.
 *
 * Vive fuera de la escena Phaser a propósito: el guion habla de personajes, la
 * escena habla de puestos, y esta tabla es la traducción. Cambiar quién ocupa
 * la testigo es cambiar una línea aquí.
 */
export const PUESTO_DE: Record<CharacterId, FocusTarget> = {
  judge_achurra: 'estrado',
  prosecutor_naveas: 'fiscalia',
  witness_zapata: 'testigo',
  player_tomas: 'defensa',
  player_renata: 'defensa',
  client_marta: 'defensa',
  eva: 'defensa',
  director_sofia: 'publico',
  rival_ignacio: 'publico',
  counterparty_hector: 'publico',
  amb_procurador: 'publico',
  amb_administrativa: 'publico',
  amb_estudiante: 'publico',
  amb_funcionario: 'publico',
  amb_senior: 'publico',
  amb_visita: 'publico',
};
