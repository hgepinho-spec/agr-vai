import { Link } from "wouter";
import { SiDiscord, SiSteam } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-display text-2xl font-bold tracking-widest text-white inline-block mb-4">
              DOMINIUM<span className="text-primary">DAYZ</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
              Sobrevivência hardcore e imersiva. Não confie em ninguém. Sobreviva a qualquer custo. Bem-vindo ao servidor mais brutal de Chernarus.
            </p>
            <div className="flex gap-4">
              <a
              href="https://discord.gg/CAbVyZNHD8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 bg-background border border-border rounded-sm"
              >
              <SiDiscord className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 bg-background border border-border rounded-sm">
                <SiSteam className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-lg tracking-widest text-white mb-4">NAVEGAÇÃO</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/status" className="hover:text-primary transition-colors">Status do Servidor</Link></li>
              <li><Link href="/news" className="hover:text-primary transition-colors">Notícias</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Ranking</Link></li>
              <li><Link href="/store" className="hover:text-primary transition-colors">Loja</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-lg tracking-widest text-white mb-4">SUPORTE</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/rules" className="hover:text-primary transition-colors">Regras do Servidor</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/ban-appeal" className="hover:text-primary transition-colors">Recurso de Ban</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col gap-1">
            <p>&copy; {new Date().getFullYear()} Andarilhos E-Sports. Todos os direitos reservados.</p>
            <p>Created By: Mrhgepo</p>
          </div>
          <p>Não afiliado à Bohemia Interactive.</p>
        </div>
      </div>
    </footer>
  );
}
