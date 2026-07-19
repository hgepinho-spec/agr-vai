import { useGetNews } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skull } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  update: "Atualização",
  event: "Evento",
  announcement: "Anúncio",
  maintenance: "Manutenção",
};

export default function News() {
  const { data: news, isLoading } = useGetNews();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'update': return 'bg-primary text-primary-foreground';
      case 'event': return 'bg-secondary text-secondary-foreground';
      case 'announcement': return 'bg-blue-600 text-white';
      case 'maintenance': return 'bg-orange-600 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-display text-5xl tracking-widest text-white mb-2">NOTÍCIAS E COMUNICADOS</h1>
        <p className="text-muted-foreground uppercase tracking-wider text-sm font-bold">Notícias, atualizações e anúncios do servidor</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-sm mb-8 flex flex-wrap h-auto">
          <TabsTrigger value="all" className="font-display tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">TODAS</TabsTrigger>
          <TabsTrigger value="update" className="font-display tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">ATUALIZAÇÕES</TabsTrigger>
          <TabsTrigger value="event" className="font-display tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">EVENTOS</TabsTrigger>
          <TabsTrigger value="announcement" className="font-display tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">ANÚNCIOS</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <NewsGrid news={news} isLoading={isLoading} getCategoryColor={getCategoryColor} />
        </TabsContent>
        <TabsContent value="update" className="mt-0">
          <NewsGrid news={news?.filter(n => n.category === 'update')} isLoading={isLoading} getCategoryColor={getCategoryColor} />
        </TabsContent>
        <TabsContent value="event" className="mt-0">
          <NewsGrid news={news?.filter(n => n.category === 'event')} isLoading={isLoading} getCategoryColor={getCategoryColor} />
        </TabsContent>
        <TabsContent value="announcement" className="mt-0">
          <NewsGrid news={news?.filter(n => n.category === 'announcement')} isLoading={isLoading} getCategoryColor={getCategoryColor} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewsGrid({ news, isLoading, getCategoryColor }: { news?: any[], isLoading: boolean, getCategoryColor: (cat: string) => string }) {
  const CATEGORY_LABELS: Record<string, string> = {
    update: "Atualização",
    event: "Evento",
    announcement: "Anúncio",
    maintenance: "Manutenção",
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[400px] w-full bg-card" />)}
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-24 bg-card border border-border rounded-sm">
        <p className="text-muted-foreground font-mono">NENHUMA NOTÍCIA DISPONÍVEL.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map(article => (
        <Link key={article.id} href={`/news/${article.id}`}>
          <div className="bg-card border border-border group hover:border-primary/50 transition-all flex flex-col h-full cursor-pointer relative overflow-hidden">
            {article.pinned && (
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="destructive" className="rounded-none font-display tracking-widest text-xs py-1">FIXADO</Badge>
              </div>
            )}
            
            <div className="h-48 bg-background relative overflow-hidden">
              {article.imageUrl ? (
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Skull className="h-16 w-16 opacity-10" />
                </div>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`rounded-none font-display tracking-widest text-xs ${getCategoryColor(article.category)}`}>
                  {CATEGORY_LABELS[article.category] ?? article.category}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  {format(new Date(article.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                </span>
              </div>
              
              <h3 className="font-display text-2xl tracking-wide text-white mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              
              <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                {article.content.replace(/<[^>]*>?/gm, '')}
              </p>
              
              <div className="mt-auto pt-4 border-t border-border/50 text-xs font-mono text-muted-foreground">
                AUTOR: <span className="text-white">{article.author}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
