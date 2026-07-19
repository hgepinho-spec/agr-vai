import { Router } from "express";
import { GameDig } from "gamedig";

const router = Router();

const SERVER_IP = "56.125.63.198";
const SERVER_PORT = 2302;

// Cache para não sobrecarregar o servidor com queries a cada request
let statusCache: { data: object; ts: number } | null = null;
const CACHE_TTL_MS = 30_000; // 30 segundos

async function queryServer() {
  if (statusCache && Date.now() - statusCache.ts < CACHE_TTL_MS) {
    return statusCache.data;
  }

  try {
    const result = await GameDig.query({
      type: "dayz",
      host: SERVER_IP,
      port: SERVER_PORT,
    });

    const data = {
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
      uptime: null as string | null,
    };

    statusCache = { data, ts: Date.now() };
    return data;
  } catch {
    // Servidor offline ou sem resposta
    const data = {
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
    statusCache = { data, ts: Date.now() };
    return data;
  }
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
