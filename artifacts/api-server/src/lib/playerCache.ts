/** Cache compartilhado de jogadores online entre server.ts e players.ts */

export interface CachedPlayer {
  name: string;
  playtime: number; // segundos
}

let cachedPlayers: CachedPlayer[] = [];
let cachedAt = 0;

export function setPlayerCache(players: CachedPlayer[]) {
  cachedPlayers = players;
  cachedAt = Date.now();
}

/** Retorna os jogadores em cache. age = quantos ms desde a última atualização. */
export function getPlayerCache(): { players: CachedPlayer[]; age: number } {
  return { players: cachedPlayers, age: Date.now() - cachedAt };
}
