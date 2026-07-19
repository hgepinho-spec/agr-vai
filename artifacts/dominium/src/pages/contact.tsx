import { useSubmitContact } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Deve ser um endereço de e-mail válido"),
  subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContact.mutate(
      { data },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: () => {
          toast({
            title: "Falha no Envio",
            description: "Não foi possível enviar a mensagem. Tente novamente mais tarde.",
            variant: "destructive",
          });
        }
      }
    );
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <div className="bg-card border border-border p-12 flex flex-col items-center">
          <CheckCircle2 className="h-16 w-16 text-primary mb-6" />
          <h1 className="font-display text-4xl tracking-widest text-white mb-4">MENSAGEM RECEBIDA</h1>
          <p className="text-muted-foreground mb-8">
            Sua mensagem foi registrada. Se uma resposta for necessária, entraremos em contato pelo e-mail fornecido.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-none border-border">
            ENVIAR OUTRA MENSAGEM
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-8">
          <div>
            <h1 className="font-display text-5xl tracking-widest text-white mb-2">CONTATO</h1>
            <p className="text-muted-foreground uppercase tracking-wider text-sm font-bold mb-6">Fale com a Equipe Admin</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use este formulário para assuntos comerciais, para reportar exploits graves ou para comunicação oficial.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border p-4 flex items-center gap-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase">E-mail Direto</div>
                <div className="text-white font-mono text-sm">dominiumzdayz@gmail.com</div>
              </div>
            </div>
            
            <div className="bg-card border border-border p-4">
              <div className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Aviso</div>
              <div className="text-sm text-muted-foreground">
                Não use este formulário para recursos de ban. Use o formulário dedicado de Recurso de Ban.
                Para suporte geral, abra um ticket no Discord.
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-card border border-border p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">SEU NOME OU APELIDO</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome ou Apelido" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">E-MAIL PARA RESPOSTA</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="voce@exemplo.com" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">ASSUNTO</FormLabel>
                      <FormControl>
                        <Input placeholder="Assunto da mensagem" className="bg-background border-border rounded-none focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground font-bold tracking-wider text-xs">CONTEÚDO DA MENSAGEM</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Sua mensagem aqui..." 
                          className="bg-background border-border rounded-none focus-visible:ring-primary min-h-[200px] resize-y" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full rounded-none font-display tracking-widest text-lg h-14 bg-white text-black hover:bg-white/90 mt-4"
                  disabled={submitContact.isPending}
                >
                  {submitContact.isPending ? "ENVIANDO..." : "ENVIAR MENSAGEM"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
