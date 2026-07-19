import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const STEAM_API_KEY = process.env.STEAM_API_KEY ?? "";
const APP_URL = (process.env.APP_URL ?? "http://localhost:8080").replace(/\/$/, "");

if (!STEAM_API_KEY) {
  console.warn("[auth] STEAM_API_KEY não definido — perfis Steam serão genéricos");
}

function getSteamAuthUrl(): string {
  const callbackUrl = `${APP_URL}/api/auth/steam/callback`;
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": callbackUrl,
    "openid.realm": APP_URL,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  return `https://steamcommunity.com/openid/login?${params}`;
}

async function verifySteamCallback(
  query: Record<string, string>,
): Promise<string | null> {
  if (query["openid.mode"] !== "id_res") return null;

  const verifyParams = new URLSearchParams(query);
  verifyParams.set("openid.mode", "check_authentication");

  const response = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    body: verifyParams.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const text = await response.text();
  if (!text.includes("is_valid:true")) return null;

  const claimedId = query["openid.claimed_id"] ?? "";
  const match = claimedId.match(/\/id\/(\d+)$/);
  return match ? match[1] : null;
}

async function getSteamProfile(steamId: string) {
  if (!STEAM_API_KEY) {
    return {
      steamId,
      username: `Jogador_${steamId.slice(-6)}`,
      avatar: null,
      avatarFull: null,
      profileUrl: `https://steamcommunity.com/profiles/${steamId}`,
    };
  }

  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`;
  const res = await fetch(url);
  const data = (await res.json()) as {
    response?: {
      players?: Array<{
        personaname: string;
        avatar: string;
        avatarfull: string;
        profileurl: string;
      }>;
    };
  };
  const player = data.response?.players?.[0];
  if (!player) return null;

  return {
    steamId,
    username: player.personaname,
    avatar: player.avatar,
    avatarFull: player.avatarfull,
    profileUrl: player.profileurl,
  };
}

// GET /api/auth/steam → redireciona para o Steam
router.get("/auth/steam", (_req, res) => {
  res.redirect(getSteamAuthUrl());
});

// GET /api/auth/steam/callback → verifica e cria sessão
router.get("/auth/steam/callback", async (req, res): Promise<void> => {
  try {
    const query = req.query as Record<string, string>;
    const steamId = await verifySteamCallback(query);

    if (!steamId) {
      res.redirect("/?auth=failed");
      return;
    }

    const profile = await getSteamProfile(steamId);
    if (!profile) {
      res.redirect("/?auth=failed");
      return;
    }

    const [user] = await db
      .insert(usersTable)
      .values(profile)
      .onConflictDoUpdate({
        target: usersTable.steamId,
        set: {
          username: profile.username,
          avatar: profile.avatar,
          avatarFull: profile.avatarFull,
          profileUrl: profile.profileUrl,
          updatedAt: new Date(),
        },
      })
      .returning();

    req.session.userId = user.id;
    req.session.steamId = user.steamId;

    req.session.save(() => {
      res.redirect("/");
    });
  } catch (err) {
    console.error("[auth] Erro no callback:", err);
    res.redirect("/?auth=error");
  }
});

// GET /api/auth/me → retorna usuário logado
router.get("/auth/me", async (req, res): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ user: null });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.session.userId));

    if (!user) {
      req.session.destroy(() => {});
      res.status(401).json({ user: null });
      return;
    }

    res.json({
      user: {
        id: user.id,
        steamId: user.steamId,
        username: user.username,
        avatar: user.avatar,
        avatarFull: user.avatarFull,
        profileUrl: user.profileUrl,
      },
    });
  } catch (err) {
    console.error("[auth] Erro em /me:", err);
    res.status(500).json({ user: null });
  }
});

// POST /api/auth/logout
router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.json({ success: true });
  });
});

export default router;
