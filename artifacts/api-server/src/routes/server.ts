import { Router } from "express";
import { GameDig } from "gamedig";

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

/** Consulta via Steam Web API (HTTPS — funciona em qualquer ambiente cloud) */
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
    if (!server) return null;

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
    console.warn("[server] Steam API query failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Consulta via BattleMetrics (HTTPS público, sem chave) */
async function queryViaBattleMetrics(): Promise<ServerStatus | null> {
  try {
    const url = `https://api.battlemetrics.com/servers?filter[search]=${SERVER_IP}&filter[game]=dayz&page[size]=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const json = (await res.json()) as {
      data?: Array<{
        attributes: {
          name: string;
          players: number;
          maxPlayers: number;
          status: string;
          details?: { map?: string; version?: string };
          ip: string;
          port: number;
        };
      }>;
    };

    const srv = json.data?.[0]?.attributes;
    if (!srv || srv.ip !== SERVER_IP) return null;

    return {
      online: srv.status === "online",
      playerCount: srv.players,
      maxPlayers: srv.maxPlayers,
      serverName: srv.name,
      map: srv.details?.map ?? "Chernarus",
      ip: SERVER_IP,
      port: SERVER_PORT,
      ping: 0,
      password: false,
      version: srv.details?.version ?? null,
      uptime: null,
    };
  } catch (err) {
    console.warn("[server] BattleMetrics query failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Consulta via GameDig (UDP — pode ser bloqueado em alguns ambientes cloud) */
async function queryViaGameDig(): Promise<ServerStatus | null> {
  try {
    const result = await GameDig.query({
      type: "dayz",
      host: SERVER_IP,
      port: SERVER_PORT,
      givenUp: 5000,
    });

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
    console.warn("[server] GameDig query failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

async function queryServer(): Promise<ServerStatus> {
  if (statusCache && Date.now() - statusCache.ts < CACHE_TTL_MS) {
    return statusCache.data;
  }

  // 1. Steam Web API (HTTPS, requer STEAM_API_KEY)
  // 2. BattleMetrics (HTTPS público, sem chave)
  // 3. GameDig UDP (pode ser bloqueado em cloud)
  const data =
    (await queryViaSteamAPI()) ??
    (await queryViaBattleMetrics()) ??
    (await queryViaGameDig()) ??
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
