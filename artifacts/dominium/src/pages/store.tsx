import { useGetStorePackages } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ShoppingCart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Store() {
  const { data: packages, isLoading } = useGetStorePackages();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl md:text-7xl tracking-widest text-white mb-4">ARMEIRO</h1>
        <p className="text-muted-foreground uppercase tracking-wider max-w-2xl mx-auto">
          Apoie o servidor e seja recompensado. Todo o valor vai diretamente para hospedagem e desenvolvimento.
          Mecânicas pay-to-win são estritamente proibidas.
        </p>
      </div>

      <Alert className="mb-12 max-w-3xl mx-auto bg-card border-secondary/50 rounded-none">
        <AlertCircle className="h-4 w-4 text-secondary" />
        <AlertTitle className="text-secondary font-display tracking-widest">COMO COMPRAR</AlertTitle>
        <AlertDescription className="text-muted-foreground font-mono text-xs mt-2">
          Atualmente, todas as compras são realizadas manualmente via Discord para garantir a entrega correta.
          Clicar em "COMPRAR" irá abrir um ticket no nosso servidor.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-[500px] w-full bg-card" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages?.map(pkg => (
            <div 
              key={pkg.id} 
              className={`relative bg-card border flex flex-col ${pkg.popular ? 'border-primary shadow-[0_0_30px_rgba(204,0,0,0.15)] scale-105 z-10' : 'border-border'}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white font-display tracking-widest px-4 py-1 text-sm font-bold">
                  MAIS POPULAR
                </div>
              )}
              
              <div className={`p-8 border-b ${pkg.popular ? 'border-primary/20' : 'border-border'}`}>
                <h3 className="font-display text-3xl tracking-widest text-white mb-2">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground h-10 line-clamp-2">{pkg.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl text-white">R${pkg.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-muted-foreground font-mono text-sm">/mês</span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <Check className={`h-5 w-5 shrink-0 ${pkg.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full rounded-none h-12 font-display tracking-widest text-lg ${
                    pkg.popular 
                      ? 'bg-primary hover:bg-primary/90 text-white' 
                      : 'bg-background border border-border hover:bg-accent text-white'
                  }`}
                  asChild
                >
                  <a href="https://discord.gg/CAbVyZNHD8" target="_blank" rel="noreferrer">
                    <ShoppingCart className="mr-2 h-5 w-5" /> COMPRAR
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
