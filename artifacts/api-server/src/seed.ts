import { db, newsTable, staffTable, storePackagesTable, leaderboardTable, faqTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./lib/logger";

async function isEmpty(table: Parameters<typeof db.select>[0] extends undefined ? never : any): Promise<boolean> {
  const result = await db.execute(sql`SELECT COUNT(*) as count FROM ${table}`);
  return Number((result.rows[0] as any).count) === 0;
}

export async function seedDatabase() {
  try {
    // Seed news
    const newsCount = await db.execute(sql`SELECT COUNT(*) as count FROM news`);
    if (Number((newsCount.rows[0] as any).count) === 0) {
      await db.insert(newsTable).values([
        {
          title: "Bem-vindo ao Dominium DayZ!",
          content: "Somos um servidor brasileiro de DayZ com foco em roleplay, PvP e sobrevivência. Junte-se à nossa comunidade no Discord e comece sua jornada em Chernarus.",
          category: "announcement",
          author: "Administração",
          pinned: true,
        },
        {
          title: "Atualização 1.1 — Novas Zonas de Saque",
          content: "Adicionamos três novas zonas de saque de alto risco ao mapa. Cuidado: a competição será intensa. As zonas estão localizadas nas regiões norte do mapa.",
          category: "update",
          author: "Dev Team",
          pinned: false,
        },
        {
          title: "Evento PvP — Torneio de Sobrevivência",
          content: "No próximo fim de semana realizaremos um torneio oficial de PvP. Os três primeiros colocados receberão itens exclusivos no servidor. Inscrições via Discord.",
          category: "event",
          author: "Moderação",
          pinned: false,
        },
        {
          title: "Regras Atualizadas",
          content: "Atualizamos as regras do servidor. Por favor leia com atenção as novas diretrizes sobre base building e combate urbano. O desconhecimento das regras não isenta de punição.",
          category: "announcement",
          author: "Administração",
          pinned: false,
        },
      ]);
      logger.info("News seeded");
    }

    // Seed staff
    const staffCount = await db.execute(sql`SELECT COUNT(*) as count FROM staff`);
    if (Number((staffCount.rows[0] as any).count) === 0) {
      await db.insert(staffTable).values([
        { name: "Mrhgepo", role: "owner", discordTag: "mrhgepo", online: true, bio: "Fundador e desenvolvedor principal do Dominium DayZ." },
        { name: "DarkWolf", role: "co_owner", discordTag: "darkwolf#0001", online: false, bio: "Co-fundador responsável pela gestão da comunidade." },
        { name: "ShadowFox", role: "admin", discordTag: "shadowfox#0002", online: true, bio: "Administrador sênior com foco em moderação e eventos." },
        { name: "IronBear", role: "admin", discordTag: "ironbear#0003", online: false, bio: "Responsável pela administração técnica do servidor." },
        { name: "StormRaven", role: "moderator", discordTag: "stormraven#0004", online: true, bio: "Moderador ativo na comunidade e no servidor." },
        { name: "GhostSniper", role: "moderator", discordTag: "ghostsniper#0005", online: false, bio: "Moderador especialista em resolução de conflitos." },
        { name: "CryptoWolf", role: "helper", discordTag: "cryptowolf#0006", online: true, bio: "Helper dedicado a auxiliar novos jogadores." },
        { name: "NeonBlade", role: "developer", discordTag: "neonblade#0007", online: false, bio: "Desenvolvedor de mods e scripts para o servidor." },
      ]);
      logger.info("Staff seeded");
    }

    // Seed store packages
    const storeCount = await db.execute(sql`SELECT COUNT(*) as count FROM store_packages`);
    if (Number((storeCount.rows[0] as any).count) === 0) {
      await db.insert(storePackagesTable).values([
        {
          name: "VIP Bronze",
          description: "Pacote inicial para apoiadores do servidor. Ganhe acesso a canais exclusivos no Discord e um tag especial no servidor.",
          price: 15.00,
          type: "vip",
          features: JSON.stringify(["Tag [VIP] no servidor", "Canal exclusivo no Discord", "Suporte prioritário", "1 kit de início por wipe"]),
          popular: false,
          color: "#CD7F32",
        },
        {
          name: "VIP Prata",
          description: "Pacote intermediário com benefícios ampliados. Ideal para jogadores regulares que querem mais vantagens.",
          price: 30.00,
          type: "vip",
          features: JSON.stringify(["Tudo do Bronze", "Tag [VIP+] no servidor", "2 kits por wipe", "Acesso antecipado a eventos", "Cargo especial no Discord"]),
          popular: true,
          color: "#C0C0C0",
          badgeText: "POPULAR",
        },
        {
          name: "VIP Ouro",
          description: "Pacote premium com todos os benefícios disponíveis. Para os verdadeiros apoiadores da comunidade Dominium.",
          price: 50.00,
          type: "vip",
          features: JSON.stringify(["Tudo do Prata", "Tag [VIP++] dourada", "3 kits por wipe", "Prioridade na fila", "Nome colorido no chat", "Acesso ao canal de sugestões VIP"]),
          popular: false,
          color: "#FFD700",
          badgeText: "ELITE",
        },
      ]);
      logger.info("Store packages seeded");
    }

    // Seed leaderboard
    const lbCount = await db.execute(sql`SELECT COUNT(*) as count FROM leaderboard`);
    if (Number((lbCount.rows[0] as any).count) === 0) {
      const players = [
        { playerName: "ShadowKiller", kills: 847, deaths: 42, survived: 312, playtime: 4820, loot: 2341 },
        { playerName: "NightHunter", kills: 723, deaths: 67, survived: 289, playtime: 3950, loot: 1987 },
        { playerName: "IronWolf", kills: 698, deaths: 55, survived: 340, playtime: 5200, loot: 3102 },
        { playerName: "DarkRaven", kills: 612, deaths: 89, survived: 198, playtime: 2800, loot: 1543 },
        { playerName: "StormBlade", kills: 589, deaths: 73, survived: 267, playtime: 3600, loot: 2018 },
        { playerName: "GhostWalker", kills: 534, deaths: 91, survived: 421, playtime: 6100, loot: 4201 },
        { playerName: "CrimsonFox", kills: 498, deaths: 62, survived: 178, playtime: 2400, loot: 1321 },
        { playerName: "BattleBorn", kills: 467, deaths: 108, survived: 156, playtime: 2100, loot: 987 },
        { playerName: "SilentSniper", kills: 423, deaths: 34, survived: 389, playtime: 4300, loot: 2876 },
        { playerName: "DeathMarch", kills: 398, deaths: 145, survived: 112, playtime: 1800, loot: 743 },
        { playerName: "VoidWalker", kills: 356, deaths: 78, survived: 234, playtime: 3200, loot: 1654 },
        { playerName: "TundraWolf", kills: 334, deaths: 56, survived: 302, playtime: 4100, loot: 2234 },
        { playerName: "ApexPredator", kills: 312, deaths: 43, survived: 356, playtime: 4800, loot: 3456 },
        { playerName: "BloodMoon", kills: 289, deaths: 167, survived: 98, playtime: 1500, loot: 621 },
        { playerName: "FrostBite", kills: 267, deaths: 92, survived: 198, playtime: 2700, loot: 1432 },
      ];
      await db.insert(leaderboardTable).values(players);
      logger.info("Leaderboard seeded");
    }

    // Seed FAQ
    const faqCount = await db.execute(sql`SELECT COUNT(*) as count FROM faq`);
    if (Number((faqCount.rows[0] as any).count) === 0) {
      await db.insert(faqTable).values([
        { question: "Como entro no servidor?", answer: "Abra o DayZ, vá em Servidores da Comunidade e pesquise por 'Dominium'. O IP também está disponível no nosso Discord.", category: "Geral", order: 1 },
        { question: "O servidor é gratuito?", answer: "Sim! O servidor é totalmente gratuito. Os pacotes VIP são opcionais e ajudam a manter os custos do servidor.", category: "Geral", order: 2 },
        { question: "Com que frequência ocorre o wipe?", answer: "O wipe acontece a cada 30 dias ou após grandes atualizações do DayZ que requeiram reinício do mapa.", category: "Geral", order: 3 },
        { question: "Posso construir base em qualquer lugar?", answer: "Não. Certas áreas são protegidas. Consulte as regras completas de base building na página de Regras.", category: "Base Building", order: 4 },
        { question: "Qual o limite de peças por base?", answer: "O limite é de 150 peças por grupo. Bases que excederem este limite serão removidas pela administração.", category: "Base Building", order: 5 },
        { question: "KOS é permitido?", answer: "Sim, KOS (Kill on Sight) é permitido na maioria das zonas. Consulte as regras para áreas de proteção para novatos.", category: "PvP", order: 6 },
        { question: "Existe zona segura?", answer: "Sim, as cidades de spawn inicial possuem proteção por 30 minutos para novos jogadores. Atacar novatos nessa área é banível.", category: "PvP", order: 7 },
        { question: "Como faço recurso de banimento?", answer: "Acesse a página de Recurso neste site e preencha o formulário com seu nome no servidor, motivo e provas que tiver.", category: "Punições", order: 8 },
        { question: "Como compro VIP?", answer: "Acesse a página de Loja, escolha o pacote desejado e clique em Comprar. Um ticket será aberto automaticamente no Discord.", category: "Loja", order: 9 },
      ]);
      logger.info("FAQ seeded");
    }

    logger.info("Database seed complete");
  } catch (err) {
    logger.error({ err }, "Seed error");
  }
}
