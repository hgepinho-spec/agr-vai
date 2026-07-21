import { useGetFaq } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  const { data: faqs, isLoading } = useGetFaq();

  const groupedFaqs = faqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>) || {};

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col items-center text-center mb-12">
        <HelpCircle className="h-16 w-16 text-secondary mb-4 opacity-80" />
        <h1 className="font-display text-5xl md:text-6xl tracking-widest text-white mb-2">MANUAL DE CAMPO</h1>
        <p className="text-muted-foreground uppercase tracking-wider">Perguntas Frequentes</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full bg-card" />)}
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedFaqs).map(([category, items]) => (
            <div key={category} className="space-y-6">
              <h2 className="font-display text-3xl tracking-widest text-primary border-b border-border pb-2">
                {category.toUpperCase()}
              </h2>
              
              <Accordion type="single" collapsible className="w-full bg-card border border-border p-2">
                {items.sort((a, b) => a.order - b.order).map((faq) => (
                  <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border-border">
                    <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors px-4 font-bold tracking-wide text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-muted-foreground pb-6 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
