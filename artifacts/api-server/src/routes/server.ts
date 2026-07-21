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

interface SteamServer {
  name: string;
  map: string;
  players: number;
  max_players: number;
  gametype?: string;
  version?: string;
  addr: string;
}

/**
 * Consulta via Steam Web API (HTTPS).
 * Tenta duas estratégias:
 *   1. Filtro exato por IP:PORT (porta configurada)
 *   2. Filtro por IP apenas (qualquer porta) — cobre DayZ com query port diferente
 */
async function queryViaSteamAPI(): Promise<ServerStatus | null> {
  if (!STEAM_API_KEY) {
    console.warn("[server] STEAM_API_KEY não configurada — pulando Steam API");
    return null;
  }

  const base = "https://api.steampowered.com/IGameServersService/GetServerList/v1/";

  const tryFilter = async (filter: string): Promise<SteamServer | null> => {
    const url = `${base}?key=${STEAM_API_KEY}&filter=${encodeURIComponent(filter)}&limit=5`;
    console.log(`[server] Steam API query: filter="${filter}"`);
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.warn(`[server] Steam API HTTP ${res.status}: ${await res.text()}`);
      return null;
    }
    const json = (await res.json()) as { response?: { servers?: SteamServer[] } };
    const servers = json.response?.servers ?? [];
    console.log(`[server] Steam API retornou ${servers.length} servidor(es) para filter="${filter}"`);
    if (servers.length > 0) {
      servers.forEach((s) => console.log(`  → ${s.addr} | ${s.name} | ${s.players}/${s.max_players}`));
    }
    return servers[0] ?? null;
  };

  try {
    // Estratégia 1: IP + porta exata
    let server = await tryFilter(`\\appid\\221100\\addr\\${SERVER_IP}:${SERVER_PORT}`);

    // Estratégia 2: IP sem porta (cobre qualquer query port)
    if (!server) {
      server = await tryFilter(`\\appid\\221100\\gameaddr\\${SERVER_IP}`);
    }

    // Estratégia 3: apenas o IP sem filtro de appid (mais amplo)
    if (!server) {
      server = await tryFilter(`\\gameaddr\\${SERVER_IP}`);
    }

    if (!server) {
      console.warn(`[server] Steam API: nenhum servidor encontrado no IP ${SERVER_IP}`);
      return null;
    }

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
    console.error("[server] Steam API erro:", err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Consulta via GameDig (A2S/UDP).
 * Funciona em Railway (UDP liberado). No Replit dev pode ser bloqueado.
 */
async function queryViaGameDig(): Promise<ServerStatus | null> {
  try {
    const result = await GameDig.query({
      type: "dayz",
      host: SERVER_IP,
      port: SERVER_PORT,
      socketTimeout: 5000,
      attemptTimeout: 10000,
      maxAttempts: 2,
    });

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

async function queryServer(): Promise<ServerStatus> {
  if (statusCache && Date.now() - statusCache.ts < CACHE_TTL_MS) {
    return statusCache.data;
  }

  console.log(`[server] Consultando ${SERVER_IP}:${SERVER_PORT} ...`);

  // 1. Steam API via HTTPS (funciona em qualquer cloud com STEAM_API_KEY)
  // 2. GameDig UDP (funciona no Railway se UDP liberado)
  // 3. Offline
  const data =
    (await queryViaSteamAPI()) ??
    (await queryViaGameDig()) ??
    OFFLINE_STATUS;

  console.log(`[server] Status final: online=${data.online} players=${data.playerCount}`);
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
    serverAgeDays: 342,
  });
});

export default router;
