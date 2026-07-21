import { Book } from "lucide-react";

export default function Rules() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col items-center text-center mb-12">
        <Book className="h-16 w-16 text-primary mb-4 opacity-80" />
        <h1 className="font-display text-5xl md:text-6xl tracking-widest text-white mb-2">REGRAS DO SERVIDOR</h1>
        <p className="text-muted-foreground uppercase tracking-wider">Ignorância não é desculpa. Leia com atenção.</p>
      </div>

      <div className="space-y-12">
        <section className="bg-card border border-border p-8">
          <h2 className="font-display text-3xl tracking-widest text-primary mb-6 border-b border-border pb-4">1. CONDUTA GERAL</h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="font-display text-2xl text-muted-foreground">1.1</span>
              <div>
                <h3 className="font-bold text-white mb-1">Sem Trapaças ou Exploits</h3>
                <p className="text-muted-foreground text-sm">O uso de softwares de terceiros, scripts, macros ou exploits de bugs do jogo (duping, atravessar paredes) resultará em banimento permanente e sem recurso.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-display text-2xl text-muted-foreground">1.2</span>
              <div>
                <h3 className="font-bold text-white mb-1">Sem Racismo, Preconceito ou Toxicidade Extrema</h3>
                <p className="text-muted-foreground text-sm">Provocações no contexto do jogo são permitidas. O uso de slurs raciais, discurso de ódio ou ameaças reais no VOIP ou chat resultará em banimento imediato.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-display text-2xl text-muted-foreground">1.3</span>
              <div>
                <h3 className="font-bold text-white mb-1">Sem Combat Logging</h3>
                <p className="text-muted-foreground text-sm">Deslogar durante um tiroteio, ou dentro de 5 minutos após receber ou causar dano, é estritamente proibido.</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-card border border-border p-8">
          <h2 className="font-display text-3xl tracking-widest text-secondary mb-6 border-b border-border pb-4">2. CONSTRUÇÃO DE BASES</h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="font-display text-2xl text-muted-foreground">2.1</span>
              <div>
                <h3 className="font-bold text-white mb-1">Zonas Proibidas para Construção</h3>
                <p className="text-muted-foreground text-sm">Proibido construir dentro de 1000m de zonas militares (Tisy, NWAF, Kamensk, VMC). Proibido construir dentro de 500m da zona segura do trader.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-display text-2xl text-muted-foreground">2.2</span>
              <div>
                <h3 className="font-bold text-white mb-1">Bloqueio de Estradas</h3>
                <p className="text-muted-foreground text-sm">Não construa paredes ou portões que bloqueiem completamente estradas pavimentadas principais. Estradas de terra e trilhas florestais são permitidas.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-display text-2xl text-muted-foreground">2.3</span>
              <div>
                <h3 className="font-bold text-white mb-1">Skybases</h3>
                <p className="text-muted-foreground text-sm">Estruturas flutuantes ou construções acima do limite de altura natural de edifícios existentes usando mirantes não são permitidas.</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-card border border-border p-8">
          <h2 className="font-display text-3xl tracking-widest text-white mb-6 border-b border-border pb-4">3. PVP E RAID</h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="font-display text-2xl text-muted-foreground">3.1</span>
              <div>
                <h3 className="font-bold text-white mb-1">KoS (Kill on Sight)</h3>
                <p className="text-muted-foreground text-sm">KoS é permitido e esperado em todo o mapa, EXCETO dentro de zonas seguras designadas.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-display text-2xl text-muted-foreground">3.2</span>
              <div>
                <h3 className="font-bold text-white mb-1">Horários de Raid</h3>
                <p className="text-muted-foreground text-sm">Dano a bases é SOMENTE permitido nos fins de semana (Sexta às 18:00 até Domingo às 23:59, horário de Brasília). Durante a semana, as paredes são indestrutíveis.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-display text-2xl text-muted-foreground">3.3</span>
              <div>
                <h3 className="font-bold text-white mb-1">Griefing</h3>
                <p className="text-muted-foreground text-sm">Ao realizar um raid, pegue o que precisar e destrua apenas o necessário para ter acesso. Desaparecer com loot apenas para prejudicar outros jogadores é mal visto, mas não é estritamente punível.</p>
              </div>
            </li>
          </ul>
        </section>

        <div className="text-center p-6 border border-primary/30 bg-primary/5">
          <p className="text-white font-bold tracking-widest uppercase">A palavra do admin é final. Burlar estas regras resultará em punição.</p>
        </div>
      </div>
    </div>
  );
}
