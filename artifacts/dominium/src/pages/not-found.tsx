import { Link } from "wouter";
import { Skull } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center p-12 border border-border bg-card max-w-md w-full mx-4">
        <Skull className="h-16 w-16 text-primary mx-auto mb-6 opacity-80" />
        <h1 className="font-display text-6xl text-white mb-4">404</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm mb-8">
          Página Não Encontrada
        </p>
        <Button asChild className="rounded-none font-display tracking-widest bg-primary hover:bg-primary/90 text-white">
          <Link href="/">VOLTAR AO INÍCIO</Link>
        </Button>
      </div>
    </div>
  );
}
