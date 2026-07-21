import { useGetNewsById } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_LABELS: Record<string, string> = {
  update: "Atualização",
  event: "Evento",
  announcement: "Anúncio",
  maintenance: "Manutenção",
};

export default function NewsDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;
  
  const { data: article, isLoading } = useGetNewsById(id, {
    query: { enabled: !!id, queryKey: ['news', id] }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8 bg-card" />
        <Skeleton className="h-12 w-3/4 mb-6 bg-card" />
        <Skeleton className="h-64 w-full mb-8 bg-card" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full bg-card" />
          <Skeleton className="h-4 w-full bg-card" />
          <Skeleton className="h-4 w-5/6 bg-card" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-4xl mb-4 text-white">NOTÍCIA NÃO ENCONTRADA</h1>
        <p className="text-muted-foreground mb-8">O comunicado solicitado não pôde ser encontrado em nossos registros.</p>
        <Button asChild variant="outline" className="rounded-none border-border">
          <Link href="/news">VOLTAR AO ARQUIVO</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button asChild variant="ghost" className="mb-8 text-muted-foreground hover:text-white pl-0">
        <Link href="/news">
          <ArrowLeft className="mr-2 h-4 w-4" /> VOLTAR ÀS NOTÍCIAS
        </Link>
      </Button>

      <div className="bg-card border border-border p-1 space-y-1 mb-8">
        {article.imageUrl ? (
          <div className="w-full h-[400px] relative overflow-hidden bg-background">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-background text-muted-foreground">
            <Skull className="h-16 w-16 opacity-10" />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Badge className="rounded-none bg-primary hover:bg-primary/90 font-display tracking-widest text-sm py-1 px-3">
            {CATEGORY_LABELS[article.category] ?? article.category}
          </Badge>
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(article.createdAt), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
          </div>
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground ml-auto">
            <User className="h-4 w-4" />
            POR {article.author}
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-6xl tracking-wide text-white border-b border-border pb-6">
          {article.title}
        </h1>

        <div 
          className="prose prose-invert prose-p:text-muted-foreground prose-headings:font-display prose-headings:tracking-widest prose-a:text-primary max-w-none font-sans"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}
