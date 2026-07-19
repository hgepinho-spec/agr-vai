import { useGetServerStatus } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, Activity, Users, Map as MapIcon, Shield, Clock, Wifi } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Status() {
  const { data: status, isLoading } = useGetServerStatus({ query: { refetchInterval: 30000 } });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-display text-5xl tracking-widest text-white mb-2">STATUS DO SERVIDOR</h1>
        <p className="text-muted-foreground uppercase tracking-wider text-sm font-bold">Telemetria ao vivo e detalhes de conexão</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Status Panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border p-6 relative overflow-hidden">
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : status ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${status.online ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-destructive'}`} />
                      <h2 className="font-display text-3xl tracking-widest">{status.serverName}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono flex items-center gap-2">
                      <Wifi className="h-4 w-4" /> {status.ip}:{status.port}
                    </p>
                  </div>
                  
                  <div className="bg-background border border-border px-6 py-4 flex flex-col items-center">
                    <span className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">JOGADORES</span>
                    <span className="font-display text-3xl text-white">{status.playerCount} / {status.maxPlayers}</span>
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between text-xs font-bold tracking-widest uppercase text-muted-foreground">
                    <span>Capacidade</span>
                    <span>{Math.round((status.playerCount / status.maxPlayers) * 100)}%</span>
                  </div>
                  <Progress value={(status.playerCount / status.maxPlayers) * 100} className="h-2 rounded-none bg-background border border-border" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <MapIcon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-[10px] text-muted-foreground tracking-widest uppercase font-bold">Mapa</div>
                      <div className="font-mono text-sm uppercase">{status.map}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-secondary" />
                    <div>
                      <div className="text-[10px] text-muted-foreground tracking-widest uppercase font-bold">Ping</div>
                      <div className="font-mono text-sm uppercase">{status.ping}ms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-[10px] text-muted-foreground tracking-widest uppercase font-bold">Tempo Online</div>
                      <div className="font-mono text-sm uppercase">{status.uptime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5 text-secondary" />
                    <div>
                      <div className="text-[10px] text-muted-foreground tracking-widest uppercase font-bold">Versão</div>
                      <div className="font-mono text-sm uppercase">{status.version || 'Desconhecida'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                  <Server className="h-64 w-64" />
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">Status indisponível</div>
            )}
          </div>

          <div className="bg-card border border-border p-6">
            <h3 className="font-display text-2xl tracking-widest mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" /> MODS E CONFIGURAÇÕES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Multiplicador de Tempo</span>
                <span className="font-mono text-white">4x Dia / 2x Noite</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Perspectiva</span>
                <span className="font-mono text-white">Somente 1ª Pessoa</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Mira</span>
                <span className="font-mono text-white">Desativada</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Construção de Base</span>
                <span className="font-mono text-white">Vanilla+</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Economia de Loot</span>
                <span className="font-mono text-white">Hardcore / Reduzido</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Stamina</span>
                <span className="font-mono text-white">Ativada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Player List Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border flex flex-col h-[600px]">
            <div className="p-4 border-b border-border bg-background/50 flex justify-between items-center">
              <h3 className="font-display text-xl tracking-widest flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" /> SOBREVIVENTES ONLINE
              </h3>
              {status && (
                <span className="text-xs font-mono bg-primary/20 text-primary px-2 py-1 rounded-sm border border-primary/30">
                  {status.playerCount}
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                <Users className="h-10 w-10 mb-4 opacity-20" />
                <p>Lista de jogadores oculta</p>
                <p className="text-xs mt-2">Segurança operacional ativa.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
