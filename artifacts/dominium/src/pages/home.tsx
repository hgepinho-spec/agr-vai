import { Link } from "wouter";
import { ArrowRight, Crosshair, Map, ShieldAlert, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetServerStatus, useGetServerStats, useGetNews } from "@workspace/api-client-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { SiDiscord } from "react-icons/si";

const CATEGORY_LABELS: Record<string, string> = {
  update: "Atualização",
  event: "Evento",
  announcement: "Anúncio",
  maintenance: "Manutenção",
};

export default function Home() {
  const { data: status, isLoading: statusLoading } = useGetServerStatus({ query: { refetchInterval: 30000 } });
  const { data: stats, isLoading: statsLoading } = useGetServerStats();
  const { data: news, isLoading: newsLoading } = useGetNews();

  const recentNews = news?.slice(0, 3);

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85dvh] flex flex-col items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-background z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,0,0,0.15)_0%,rgba(10,10,11,1)_70%)] z-0" />
        
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="font-display text-7xl md:text-9xl font-bold tracking-[0.2em] text-white drop-shadow-2xl">
              DOMINIUM<span className="text-primary">DAYZ</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium tracking-wide">
              SEM CONCESSÕES. SEM PIEDADE. SOBREVIVÊNCIA PURA.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
            <Button size="lg" className="h-14 px-8 text-lg font-display tracking-widest uppercase bg-primary hover:bg-primary/90 text-white rounded-none border border-primary-foreground/20" asChild>
              <a href="steam://connect/127.0.0.1:2302" target="_blank" rel="noreferrer">
                CONECTAR AO SERVIDOR
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-display tracking-widest uppercase rounded-none border-border bg-background/50 backdrop-blur" asChild>
              <a href="https://discord.gg/CAbVyZNHD8" target="_blank" rel="noreferrer">
                <SiDiscord className="mr-2 h-5 w-5" /> ENTRAR NO DISCORD
              </a>
            </Button>
          </div>

          {/* Server Live Status Widget */}
          <div className="mt-16 pt-8 w-full max-w-3xl border-t border-border/50">
            {statusLoading ? (
              <Skeleton className="h-24 w-full bg-card" />
            ) : status ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-card/40 backdrop-blur p-4 rounded-sm border border-border">
                <div className="flex flex-col items-center p-2 border-r border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">STATUS</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.online ? 'bg-green-500 animate-pulse' : 'bg-destructive'}`} />
                    <span className="font-display text-xl tracking-wider">{status.online ? 'ONLINE' : 'OFFLINE'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center p-2 border-r border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">JOGADORES</span>
                  <span className="font-display text-xl tracking-wider text-white">{status.playerCount} / {status.maxPlayers}</span>
                </div>
                <div className="flex flex-col items-center p-2 border-r border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">MAPA</span>
                  <span className="font-display text-xl tracking-wider text-white uppercase">{status.map}</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <span className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">PING</span>
                  <span className="font-display text-xl tracking-wider text-secondary">{status.ping}ms</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Features / Stats */}
      <section className="py-24 bg-card border-b border-border relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-background border border-border p-6 rounded-sm flex flex-col items-center text-center group hover:border-primary/50 transition-colors">
              <Crosshair className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl tracking-widest mb-2">ARMAS CUSTOMIZADAS</h3>
              <p className="text-sm text-muted-foreground">Arsenal cuidadosamente selecionado focado em realismo e profundidade tática.</p>
            </div>
            <div className="bg-background border border-border p-6 rounded-sm flex flex-col items-center text-center group hover:border-primary/50 transition-colors">
              <Map className="h-10 w-10 text-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl tracking-widest mb-2">EVENTOS DINÂMICOS</h3>
              <p className="text-sm text-muted-foreground">Quedas de suprimentos, colisões de comboios e zonas tóxicas para impulsionar a interação entre jogadores.</p>
            </div>
            <div className="bg-background border border-border p-6 rounded-sm flex flex-col items-center text-center group hover:border-primary/50 transition-colors">
              <ShieldAlert className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl tracking-widest mb-2">ADMINS ATIVOS</h3>
              <p className="text-sm text-muted-foreground">Tolerância zero com trapaceiros. Jogo justo garantido 24 horas por dia, 7 dias por semana.</p>
            </div>
            <div className="bg-background border border-border p-6 rounded-sm flex flex-col items-center text-center group hover:border-primary/50 transition-colors">
              <Skull className="h-10 w-10 text-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl tracking-widest mb-2">SOBREVIVÊNCIA EXTREMA</h3>
              <p className="text-sm text-muted-foreground">Loot reduzido, clima mais severo, infectados mais fortes.</p>
            </div>
          </div>

          {/* Server Stats */}
          <div className="mt-24 pt-16 border-t border-border">
            <h2 className="font-display text-4xl tracking-widest text-center mb-12">RECORDES DO SERVIDOR</h2>
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 bg-background border border-border" />)}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-6 bg-background border border-border">
                  <span className="font-display text-4xl md:text-5xl text-white mb-2">{stats.totalKills.toLocaleString("pt-BR")}</span>
                  <span className="text-sm tracking-widest text-muted-foreground uppercase font-bold">Total de Abates</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-background border border-border">
                  <span className="font-display text-4xl md:text-5xl text-white mb-2">{stats.totalPlayersEver.toLocaleString("pt-BR")}</span>
                  <span className="text-sm tracking-widest text-muted-foreground uppercase font-bold">Sobreviventes Únicos</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-background border border-border">
                  <span className="font-display text-4xl md:text-5xl text-white mb-2">{Math.floor(stats.totalHoursPlayed).toLocaleString("pt-BR")}</span>
                  <span className="text-sm tracking-widest text-muted-foreground uppercase font-bold">Horas Jogadas</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-background border border-border">
                  <span className="font-display text-4xl md:text-5xl text-white mb-2">{stats.serverAgedays}</span>
                  <span className="text-sm tracking-widest text-muted-foreground uppercase font-bold">Dias Ativos</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl tracking-widest">ÚLTIMAS NOTÍCIAS</h2>
              <p className="text-muted-foreground mt-2">Atualizações, eventos e anúncios.</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10">
              <Link href="/news">
                VER TODAS <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80 bg-card rounded-none" />
              ))}
            </div>
          ) : recentNews && recentNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((article) => (
                <Link key={article.id} href={`/news/${article.id}`}>
                  <div className="group bg-card border border-border hover:border-primary/50 transition-colors h-full flex flex-col cursor-pointer">
                    <div className="h-48 bg-muted relative overflow-hidden">
                      {article.imageUrl ? (
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-muted-foreground">
                          <Skull className="h-12 w-12 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-primary px-2 py-1 text-xs font-bold tracking-wider text-white uppercase">
                        {CATEGORY_LABELS[article.category] ?? article.category}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-xs text-muted-foreground mb-2 font-mono">
                        {format(new Date(article.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                      </div>
                      <h3 className="font-display text-2xl tracking-wide mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mt-auto">
                        {article.content.replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-border bg-card">
              <p className="text-muted-foreground">Sem notícias recentes.</p>
            </div>
          )}
          
          <Button variant="outline" asChild className="w-full mt-8 sm:hidden rounded-none border-border">
            <Link href="/news">
              VER TODAS AS NOTÍCIAS <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
