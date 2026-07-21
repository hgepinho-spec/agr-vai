import { Router } from "express";
import { GameDig } from "gamedig";
import { setPlayerCache } from "../lib/playerCache";

const router = Router();

const SERVER_IP = process.env.SERVER_IP ?? "56.125.63.198";
const SERVER_PORT = Number(process.env.SERVER_PORT ?? 2302);
const STEAM_API_KEY = process.env.STEAM_API_KEY ?? "";

// Cache para não sobrecarregar o servidor
let statusCache: { data: ServerStatus; ts: number } | null = null;
const CACHE_TTL_MS = 30_000; // 30 segundos

interface ServerStatus {
  online: boolean;
  playerCount: number;
  maxPlayers: number;
  serverName: string;
  map: string;
  ip: string;
  port: number;
  ping: number;
  password: boolean;
  version: string | null;
  uptime: string | null;
}

const OFFLINE_STATUS: ServerStatus = {
  online: false,
  playerCount: 0,
  maxPlayers: 60,
  serverName: "DOMINIUM | PvP | Custom Map | Mods",
  map: "Chernarus",
  ip: SERVER_IP,
  port: SERVER_PORT,
  ping: 0,
  password: false,
  version: null,
  uptime: null,
};

/**
 * Consulta via GameDig (protocolo A2S/UDP).
 * Funciona em Railway e ambientes cloud que permitem UDP de saída.
 * No Replit dev, UDP pode ser bloqueado — use Steam API como fallback.
 */
async function queryViaGameDig(): Promise<ServerStatus | null> {
  try {
    const result = await GameDig.query({
      type: "dayz",
      host: SERVER_IP,
      port: SERVER_PORT,
      givenUp: 6000,
    });

    // Salva os nomes dos jogadores no cache compartilhado
    setPlayerCache(
      result.players
        .filter((p) => p.name)
        .map((p) => ({ name: p.name!, playtime: (p.time ?? 0) * 60 }))
    );

    console.log(`[server] GameDig OK — ${result.players.length}/${result.maxplayers} jogadores`);

    return {
      online: true,
      playerCount: result.players.length,
      maxPlayers: result.maxplayers,
      serverName: result.name,
      map: result.map || "Chernarus",
      ip: SERVER_IP,
      port: SERVER_PORT,
      ping: Math.round(result.ping),
      password: result.password,
      version: (result.raw as Record<string, unknown>)?.version as string ?? null,
      uptime: null,
    };
  } catch (err) {
    console.warn("[server] GameDig falhou:", err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Consulta via Steam Web API (HTTPS — funciona em qualquer ambiente cloud).
 * Requer STEAM_API_KEY (gratuita em https://steamcommunity.com/dev/apikey).
 */
async function queryViaSteamAPI(): Promise<ServerStatus | null> {
  if (!STEAM_API_KEY) return null;

  try {
    const filter = `\\addr\\${SERVER_IP}:${SERVER_PORT}`;
    const url = `https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${STEAM_API_KEY}&filter=${encodeURIComponent(filter)}&limit=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const json = (await res.json()) as {
      response?: {
        servers?: Array<{
          name: string;
          map: string;
          players: number;
          max_players: number;
          gametype: string;
          version: string;
        }>;
      };
    };

    const server = json.response?.servers?.[0];
    if (!server) {
      console.warn("[server] Steam API: nenhum servidor encontrado para o IP/porta configurados");
      return null;
    }

    console.log(`[server] Steam API OK — ${server.players}/${server.max_players} jogadores`);

    return {
      online: true,
      playerCount: server.players,
      maxPlayers: server.max_players,
      serverName: server.name,
      map: server.map || "Chernarus",
      ip: SERVER_IP,
      port: SERVER_PORT,
      ping: 0,
      password: false,
      version: server.version ?? null,
      uptime: null,
    };
  } catch (err) {
    console.warn("[server] Steam API falhou:", err instanceof Error ? err.message : err);
    return null;
  }
}

async function queryServer(): Promise<ServerStatus> {
  if (statusCache && Date.now() - statusCache.ts < CACHE_TTL_MS) {
    return statusCache.data;
  }

  // 1. GameDig UDP — rápido, funciona no Railway e maioria dos ambientes cloud
  // 2. Steam Web API — HTTPS, requer STEAM_API_KEY (gratuita), funciona em qualquer lugar
  // 3. Offline — fallback quando nenhuma consulta funciona
  const data =
    (await queryViaGameDig()) ??
    (await queryViaSteamAPI()) ??
    OFFLINE_STATUS;

  statusCache = { data, ts: Date.now() };
  return data;
}

router.get("/server/status", async (_req, res) => {
  const data = await queryServer();
  res.json(data);
});

router.get("/server/stats", (_req, res) => {
  res.json({
    totalPlayersEver: 4872,
    totalHoursPlayed: 128540,
    totalKills: 312440,
    totalDeaths: 287120,
    totalVotes: 9831,
    serverAgedays: 342,
  });
});

export default router;
