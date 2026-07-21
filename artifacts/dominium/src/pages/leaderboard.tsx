import { useGetLeaderboard } from "@workspace/api-client-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crosshair, Clock, ShieldAlert, Skull } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Leaderboard() {
  const [category, setCategory] = useState<'kills' | 'survived' | 'playtime' | 'loot'>('kills');
  
  const { data: leaderboard, isLoading } = useGetLeaderboard({ category }, {
    query: { queryKey: ['leaderboard', category] }
  });

  const getCategoryIcon = () => {
    switch (category) {
      case 'kills': return <Crosshair className="h-5 w-5 text-primary" />;
      case 'survived': return <ShieldAlert className="h-5 w-5 text-secondary" />;
      case 'playtime': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'loot': return <Trophy className="h-5 w-5 text-amber-500" />;
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'kills': return 'ABATES CONFIRMADOS';
      case 'survived': return 'HORAS SOBREVIVIDO';
      case 'playtime': return 'TEMPO TOTAL';
      case 'loot': return 'PONTUAÇÃO DE LOOT';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col items-center text-center mb-12">
        <Trophy className="h-16 w-16 text-primary mb-4 opacity-80" />
        <h1 className="font-display text-5xl md:text-6xl tracking-widest text-white mb-2">SALÃO DA INFÂMIA</h1>
        <p className="text-muted-foreground uppercase tracking-wider">Os sobreviventes mais letais e persistentes de Chernarus.</p>
      </div>

      <Tabs 
        defaultValue="kills" 
        value={category} 
        onValueChange={(v) => setCategory(v as any)} 
        className="w-full mb-8"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-card border border-border p-1 rounded-sm h-auto">
          <TabsTrigger value="kills" className="font-display tracking-widest py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">ABATES</TabsTrigger>
          <TabsTrigger value="survived" className="font-display tracking-widest py-3 data-[state=active]:bg-secondary data-[state=active]:text-white rounded-none">SOBREVIVEU</TabsTrigger>
          <TabsTrigger value="playtime" className="font-display tracking-widest py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none">TEMPO</TabsTrigger>
          <TabsTrigger value="loot" className="font-display tracking-widest py-3 data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-none">LOOT</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-card border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border">
                <th className="py-4 px-6 font-display tracking-widest text-muted-foreground w-20 text-center">RANK</th>
                <th className="py-4 px-6 font-display tracking-widest text-muted-foreground">SOBREVIVENTE</th>
                <th className="py-4 px-6 font-display tracking-widest text-muted-foreground text-right">
                  <div className="flex items-center justify-end gap-2">
                    {getCategoryLabel()} {getCategoryIcon()}
                  </div>
                </th>
                <th className="py-4 px-6 font-display tracking-widest text-muted-foreground text-right hidden sm:table-cell">ÚLTIMA VEZ VISTO</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-4 px-6"><Skeleton className="h-6 w-8 mx-auto" /></td>
                    <td className="py-4 px-6 flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                    </td>
                    <td className="py-4 px-6"><Skeleton className="h-6 w-16 ml-auto" /></td>
                    <td className="py-4 px-6 hidden sm:table-cell"><Skeleton className="h-4 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : leaderboard?.length ? (
                leaderboard.map((entry, index) => (
                  <tr 
                    key={`${entry.playerName}-${index}`} 
                    className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-center">
                      <span className={`font-display text-2xl ${
                        index === 0 ? 'text-primary drop-shadow-[0_0_10px_rgba(204,0,0,0.8)]' : 
                        index === 1 ? 'text-white/90' : 
                        index === 2 ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-background border border-border overflow-hidden flex items-center justify-center">
                          {entry.avatarUrl ? (
                            <img src={entry.avatarUrl} alt={entry.playerName} className="w-full h-full object-cover" />
                          ) : (
                            <Skull className="h-5 w-5 text-muted-foreground opacity-50" />
                          )}
                        </div>
                        <span className={`font-bold tracking-wide ${index < 3 ? 'text-white' : 'text-white/80'}`}>
                          {entry.playerName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-mono text-xl text-white">
                        {entry.value.toLocaleString("pt-BR")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right hidden sm:table-cell">
                      <span className="text-xs font-mono text-muted-foreground uppercase">
                        {formatDistanceToNow(new Date(entry.lastSeen), { addSuffix: true, locale: ptBR })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground">
                    Nenhum dado disponível para esta categoria ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
