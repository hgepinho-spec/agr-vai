import { Map as MapIcon, Target, Skull, ShieldAlert } from "lucide-react";

export default function MapPage() {
  return (
    <div className="w-full flex flex-col">
      {/* Header Section */}
      <section className="bg-card border-b border-border py-16">
        <div className="container mx-auto px-4 text-center">
          <MapIcon className="h-16 w-16 text-primary mx-auto mb-6 opacity-80" />
          <h1 className="font-display text-5xl md:text-7xl tracking-widest text-white mb-4">TEATRO DE OPERAÇÕES</h1>
          <p className="text-muted-foreground uppercase tracking-wider max-w-2xl mx-auto">
            Chernarus. 225km² de terreno implacável. Conheça seus arredores, ou morra na ignorância.
          </p>
        </div>
      </section>

      {/* Map Area */}
      <section className="relative w-full h-[60dvh] bg-[#050505] border-b border-border overflow-hidden">
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: `radial-gradient(#cc0000 1px, transparent 1px)`, 
               backgroundSize: '40px 40px' 
             }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 bg-background/80 backdrop-blur border border-border">
            <h2 className="font-display text-3xl tracking-widest text-white mb-2">MAPA INTERATIVO OFFLINE</h2>
            <p className="text-muted-foreground font-mono text-sm">Aguardando telemetria de satélite...</p>
          </div>
        </div>
      </section>

      {/* Custom Locations / Lore */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="font-display text-4xl tracking-widest text-white mb-12 text-center border-b border-border pb-6">ZONAS NOTÁVEIS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 group hover:border-primary/50 transition-colors">
              <Skull className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl tracking-widest text-white mb-4">TISY MILITAR (ZONA VERMELHA)</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                O loot de mais alto nível de Chernarus, completamente irradiado. Um traje NBC completo e máscara de gás são obrigatórios para entrar.
                Espere PvP intenso, patrulhas de IA customizadas e risco constante de dano ao traje.
              </p>
            </div>

            <div className="bg-card border border-border p-8 group hover:border-secondary/50 transition-colors">
              <Target className="h-10 w-10 text-secondary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl tracking-widest text-white mb-4">MERCADO NEGRO DO ALTAR</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Uma zona segura neutra localizada na torre de rádio do Altar. Troque itens raros com NPCs, deposite seus rublos
                e aceite missões de recompensa. Armas são desativadas dentro do perímetro.
              </p>
            </div>

            <div className="bg-card border border-border p-8 group hover:border-blue-500/50 transition-colors">
              <ShieldAlert className="h-10 w-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-2xl tracking-widest text-white mb-4">QUARENTENA DO AERÓDROMO NOROESTE</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                O Aeródromo Noroeste foi reformulado com barricadas customizadas e bunkers fortemente fortificados.
                Um local chave para spawns de armas de nível médio-alto e peças de veículos.
              </p>
            </div>
          </div>
          
          <div className="mt-24 p-8 border border-border bg-card">
            <h2 className="font-display text-3xl tracking-widest text-primary mb-6">LORE DO SERVIDOR</h2>
            <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none">
              <p>
                O surto não foi uma explosão repentina de violência. Foi uma descida lenta e agoniante para a loucura.
                Chernarus caiu pedaço por pedaço. As quarentenas militares duraram exatamente onze dias antes dos infectados
                romperem as barricadas em Zelenogorsk.
              </p>
              <p>
                Agora, anos depois, os remanescentes da humanidade se arrastam pelo chão em busca de feijão enlatado e munição enferrujada.
                As facções que um dia afirmaram restaurar a ordem se tornaram senhores da guerra. Dominium não é uma nação —
                é um estado de espírito. Você possui o que consegue segurar. Você guarda o que consegue defender.
              </p>
              <p>
                Confiança é a moeda mais rara aqui. Balas são baratas. Vidas são mais baratas ainda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
