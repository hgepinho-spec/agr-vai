import { useCreateBanAppeal } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

const appealSchema = z.object({
  playerName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  steamId: z.string().length(17, "O Steam64 ID deve ter exatamente 17 caracteres").regex(/^\d+$/, "O Steam64 ID deve conter apenas números"),
  discordTag: z.string().min(2, "O usuário do Discord é obrigatório"),
  reason: z.string().min(5, "Por favor, informe o motivo do ban"),
  description: z.string().min(20, "Por favor, forneça mais detalhes na sua explicação"),
  proofUrl: z.string().url("Deve ser uma URL válida").optional().or(z.literal('')),
});

type AppealFormValues = z.infer<typeof appealSchema>;

export default function BanAppeal() {
  const { toast } = useToast();
  const createAppeal = useCreateBanAppeal();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<AppealFormValues>({
    resolver: zodResolver(appealSchema),
    defaultValues: {
      playerName: "",
      steamId: "",
      discordTag: "",
      reason: "",
      description: "",
      proofUrl: "",
    },
  });

  const onSubmit = (data: AppealFormValues) => {
    createAppeal.mutate(
      { data },
      {
        onSuccess: () => {
          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: () => {
          toast({
            title: "Falha no Envio",
            description: "Ocorreu um erro ao enviar seu recurso. Tente novamente ou entre em contato pelo Discord.",
            variant: "destructive",
          });
        }
      }
    );
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <div className="bg-card border border-primary p-12 flex flex-col items-center">
          <Send className="h-16 w-16 text-primary mb-6" />
          <h1 className="font-display text-4xl tracking-widest text-white mb-4">RECURSO ENVIADO</h1>
          <p className="text-muted-foreground mb-8">
            Seu recurso de ban foi transmitido com segurança para a equipe de administração.
            Analisamos todos os recursos em até 48-72 horas. Não envie múltiplos recursos nem mencione admins sobre seu status.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-none border-border">
            ENVIAR OUTRO RECURSO
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12">
        <h1 className="font-display text-5xl tracking-widest text-white mb-2">TRIBUNAL</h1>
        <p className="text-muted-foreground uppercase tracking-wider text-sm font-bold">Envio de Recurso de Ban</p>
      </div>

      <Alert className="mb-8 bg-destructive/10 border-destructive rounded-none">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <AlertTitle className="text-destructive font-display tracking-widest text-lg">AVISO</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Mentir no seu recurso resultará em negação imediata e permanente.
          Forneça apenas informações verdadeiras. Se você foi banido por trapaça com provas irrefutáveis, não perca nosso tempo.
        </AlertDescription>
      </Alert>

      <div className="bg-card border border-border p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="playerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">NOME NO JOGO</FormLabel>
                    <FormControl>
                      <Input placeholder="Sobrevivente" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="steamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">STEAM64 ID</FormLabel>
                    <FormControl>
                      <Input placeholder="7656119..." className="bg-background border-border rounded-none focus-visible:ring-primary font-mono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="discordTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">USUÁRIO DO DISCORD</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario#0000" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">MOTIVO DO BAN (EXIBIDO NO LOGIN)</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Exploit, Toxicidade..." className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">SEU DEPOIMENTO</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explique o que aconteceu do seu ponto de vista..." 
                      className="bg-background border-border rounded-none focus-visible:ring-primary min-h-[150px] resize-y" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Forneça o máximo de contexto possível.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proofUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">URL DE EVIDÊNCIA (OPCIONAL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/..." className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">Link para YouTube, Medal, Imgur, etc.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full rounded-none font-display tracking-widest text-lg h-14 bg-primary hover:bg-primary/90 text-white mt-8"
              disabled={createAppeal.isPending}
            >
              {createAppeal.isPending ? "ENVIANDO..." : "ENVIAR RECURSO"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
