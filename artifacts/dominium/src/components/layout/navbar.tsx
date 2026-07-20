import { Link, useLocation } from "wouter";
import { useGetServerStatus } from "@workspace/api-client-react";
import { Menu, X, LogIn, LogOut, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";

const NAV_LINKS = [
  { href: "/", label: "INÍCIO" },
  { href: "/status", label: "STATUS" },
  { href: "/news", label: "NOTÍCIAS" },
  { href: "/store", label: "LOJA" },
  { href: "/leaderboard", label: "RANKING" },
  { href: "/rules", label: "REGRAS" },
  { href: "/staff", label: "EQUIPE" },
  { href: "/map", label: "MAPA" },
  { href: "/faq", label: "FAQ" },
  { href: "/ban-appeal", label: "RECURSO" },
  { href: "/contact", label: "CONTATO" },
];

function SteamLoginButton() {
  return (
    <a href="/api/auth/steam">
      <Button
        variant="outline"
        size="sm"
        className="rounded-none border-border text-xs font-bold tracking-widest gap-2 hover:border-primary hover:text-primary"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
        </svg>
        ENTRAR COM STEAM
      </Button>
    </a>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1 rounded-sm border border-border hover:border-primary/50 transition-colors">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-7 h-7 rounded-sm"
            />
          ) : (
            <div className="w-7 h-7 rounded-sm bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {user.username[0]}
            </div>
          )}
          <span className="text-xs font-bold tracking-wider text-white max-w-[120px] truncate">
            {user.username}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-none border-border w-48">
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground">Logado como</p>
          <p className="text-sm font-bold text-white truncate">{user.username}</p>
        </div>
        <DropdownMenuSeparator />
        {user.profileUrl && (
          <DropdownMenuItem asChild>
            <a
              href={user.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver perfil Steam
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2 text-red-400 focus:text-red-400 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: status } = useGetServerStatus({ query: { refetchInterval: 30000 } });
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src={logoImg} alt="Dominium DayZ" className="h-20 w-20 object-contain flex-shrink-0 scale-125" />
              <span className="font-display text-3xl font-bold tracking-widest text-white">
                DOMINIUM<span className="text-primary">DAYZ</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-sm text-sm font-medium tracking-wider transition-colors",
                    location === link.href
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop right side: status + auth */}
          <div className="hidden md:flex items-center gap-3">
            {status && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-sm">
                <div className={cn("w-2 h-2 rounded-full", status.online ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                <span className="text-xs font-bold font-display tracking-widest">
                  {status.online ? `${status.playerCount}/${status.maxPlayers}` : "OFFLINE"}
                </span>
              </div>
            )}
            {!isLoading && (user ? <UserMenu /> : <SteamLoginButton />)}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileOpen && (
        <div className="md:hidden border-b border-border bg-card">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-sm text-base font-medium tracking-wider",
                  location === link.href
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile auth */}
            <div className="pt-2 border-t border-border mt-2">
              {!isLoading && user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    {user.avatar && (
                      <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-sm" />
                    )}
                    <span className="text-sm font-bold text-white truncate max-w-[150px]">{user.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { logout(); setIsMobileOpen(false); }}
                    className="text-red-400 hover:text-red-300 text-xs gap-1"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sair
                  </Button>
                </div>
              ) : (
                <a href="/api/auth/steam" className="block">
                  <Button
                    variant="outline"
                    className="w-full rounded-none border-border text-xs font-bold tracking-widest gap-2"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    ENTRAR COM STEAM
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
