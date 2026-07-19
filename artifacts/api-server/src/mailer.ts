const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const DEST_EMAIL = "dominiumzdayz@gmail.com";

// Com o plano gratuito do Resend sem domínio verificado,
// o remetente deve ser onboarding@resend.dev.
// O reply-to é definido por formulário para respostas irem ao remetente certo.
const FROM = "Dominium DayZ <onboarding@resend.dev>";

if (!RESEND_API_KEY) {
  console.error("[mailer] AVISO: RESEND_API_KEY não definido — e-mails não serão enviados!");
} else {
  console.info("[mailer] Resend HTTP API configurado ✅");
}

export { DEST_EMAIL };

export async function sendMail(opts: {
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!RESEND_API_KEY) {
    console.error("[mailer] E-mail NÃO enviado — RESEND_API_KEY ausente. Assunto:", opts.subject);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [DEST_EMAIL],
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
        subject: opts.subject,
        html: opts.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[mailer] ❌ Resend retornou erro:", res.status, body);
      return;
    }

    const data = await res.json() as { id?: string };
    console.info("[mailer] ✅ E-mail enviado via Resend. ID:", data.id, "| Assunto:", opts.subject);
  } catch (err) {
    console.error("[mailer] ❌ Falha na requisição ao Resend:", opts.subject, err);
  }
}
