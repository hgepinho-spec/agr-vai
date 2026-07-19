import { useGetStaff } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Shield, Wrench, Gavel, UserCog, Ghost } from "lucide-react";
import { SiDiscord } from "react-icons/si";

const ROLE_LABELS: Record<string, string> = {
  owner: "Fundador",
  co_owner: "Co-Fundador",
  admin: "Admin",
  developer: "Desenvolvedor",
  moderator: "Moderador",
  helper: "Helper",
};

export default function Staff() {
  const { data: staff, isLoading } = useGetStaff();

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
      case 'co_owner': return <Shield className="h-5 w-5" />;
      case 'admin': return <Gavel className="h-5 w-5" />;
      case 'developer': return <Wrench className="h-5 w-5" />;
      case 'moderator': return <UserCog className="h-5 w-5" />;
      default: return <Ghost className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
      case 'co_owner': return 'bg-primary text-white border-primary';
      case 'admin': return 'bg-destructive text-white border-destructive';
      case 'developer': return 'bg-blue-600 text-white border-blue-600';
      case 'moderator': return 'bg-secondary text-white border-secondary';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const roleWeight: Record<string, number> = {
    'owner': 0,
    'co_owner': 1,
    'developer': 2,
    'admin': 3,
    'moderator': 4,
    'helper': 5
  };

  const sortedStaff = staff ? [...staff].sort((a, b) => {
    return (roleWeight[a.role] ?? 99) - (roleWeight[b.role] ?? 99);
  }) : [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="font-display text-5xl md:text-7xl tracking-widest text-white mb-4">CADEIA DE COMANDO</h1>
        <p className="text-muted-foreground uppercase tracking-wider max-w-2xl mx-auto">
          A equipe responsável por manter Chernarus brutal, mas justo. Não envie DM para membros da equipe para suporte — use o sistema de tickets oficial no Discord.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[250px] w-full bg-card" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStaff.map((member) => (
            <div key={member.id} className="bg-card border border-border flex flex-col relative group overflow-hidden">
              <div className="p-6 flex items-start gap-4 z-10 bg-background/90 backdrop-blur border-b border-border">
                <div className="relative">
                  <div className="h-16 w-16 bg-muted border border-border flex items-center justify-center overflow-hidden">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="h-8 w-8 text-muted-foreground opacity-50" />
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${member.online ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-1">{member.name}</h3>
                  <Badge variant="outline" className={`rounded-none font-display tracking-widest uppercase text-[10px] py-0 px-2 flex items-center gap-1 w-fit ${getRoleColor(member.role)}`}>
                    {getRoleIcon(member.role)} {ROLE_LABELS[member.role] ?? member.role.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col z-10 bg-card">
                <p className="text-sm text-muted-foreground flex-1 italic mb-6">
                  {member.bio || `"Nenhuma biografia fornecida."`}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground bg-background p-2 border border-border mt-auto">
                  <SiDiscord className="h-4 w-4 text-blue-400" />
                  {member.discordTag}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
