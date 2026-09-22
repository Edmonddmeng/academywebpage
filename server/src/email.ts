import { Resend } from "resend";
import { env, isProd } from "./env.js";

// Emails are sent from here with Resend's API, so their content, language and links
// are ours, not Supabase's dashboard templates.
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// Placeholder branding until the official name/logo is final.
const SCHOOL = "JMC Sports Academy";

export type Locale = "en" | "zh";
export type EmailKind = "verify" | "reset" | "exists";

const copy = {
  en: {
    verify: {
      subject: `Your ${SCHOOL} verification code`,
      heading: "Verify your email",
      body: "Enter this code to finish creating your account.",
    },
    reset: {
      subject: `Your ${SCHOOL} password reset code`,
      heading: "Reset your password",
      body: "Enter this code, along with your new password, to reset it.",
    },
    exists: {
      subject: `You already have a ${SCHOOL} account`,
      heading: "You already have an account",
      body: "Someone tried to create an account with this email address, but one already exists. Go back to the sign-in page and sign in, or choose “Forgot your password?” if you need to reset it.",
    },
    footer: "If you didn’t request this, you can safely ignore this email.",
    codeNote: "This code expires shortly. Never share it with anyone.",
  },
  zh: {
    verify: {
      subject: `您的 ${SCHOOL} 验证码`,
      heading: "验证您的邮箱",
      body: "请输入此验证码以完成账户创建。",
    },
    reset: {
      subject: `您的 ${SCHOOL} 密码重置验证码`,
      heading: "重置密码",
      body: "请输入此验证码和您的新密码以重置密码。",
    },
    exists: {
      subject: `您已拥有 ${SCHOOL} 账户`,
      heading: "您已拥有账户",
      body: "有人尝试使用此邮箱创建账户，但该邮箱已注册。请返回登录页面登录；如需重置密码，请选择“忘记密码？”。",
    },
    footer: "如果这不是您本人的操作，请忽略此邮件。",
    codeNote: "验证码很快会过期，请勿告诉任何人。",
  },
} as const;

export async function sendAuthEmail(to: string, kind: EmailKind, locale: Locale, code?: string) {
  const t = copy[locale];
  const c = t[kind];
  const codeText = code ? `\n\n${code}\n\n${t.codeNote}` : "";
  const text = `${c.heading}\n\n${c.body}${codeText}\n\n${t.footer}\n\n${SCHOOL}`;
  const html = `<div style="font-family:Georgia,'Times New Roman',serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#123d28">
<p style="font-size:14px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 24px">${SCHOOL}</p>
<h1 style="font-size:24px;margin:0 0 12px">${c.heading}</h1>
<p style="font-size:16px;line-height:1.5;margin:0 0 20px">${c.body}</p>
${
  code
    ? `<p style="font-size:34px;letter-spacing:.3em;font-weight:bold;background:#fcfbf2;border:1px solid #e8e7d0;padding:16px;text-align:center;margin:0 0 12px">${code}</p>
<p style="font-size:13px;color:#555;margin:0 0 24px">${t.codeNote}</p>`
    : ""
}
<p style="font-size:13px;color:#555;margin:0">${t.footer}</p>
</div>`;

  if (env.EMAIL_DRY_RUN === "true" && !isProd) {
    console.log(`[dry-run email] ${JSON.stringify({ to, subject: c.subject, kind })}`);
    return;
  }
  if (!resend) {
    if (isProd) throw new Error("RESEND_API_KEY is not configured");
    console.warn(`[dev] RESEND_API_KEY not set; ${kind} email to ${to}${code ? `, code ${code}` : ""}`);
    return;
  }

  const { error } = await resend.emails.send({
    from: `${SCHOOL} <${env.EMAIL_FROM}>`,
    to,
    subject: c.subject,
    text,
    html,
  });
  if (error) throw new Error(`Resend: ${error.name}: ${error.message}`);
}

// --- Generic notices (recommendation requests, interview confirmations, …) ---------

export type Notice = {
  subject: string;
  heading: string;
  paragraphs: string[];
  button?: { label: string; url: string };
  footer?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Names and other user-typed text are escaped, so nothing a family types can inject HTML into an email. */
export async function sendNotice(to: string, n: Notice) {
  const text = [n.heading, ...n.paragraphs, ...(n.button ? [`${n.button.label}: ${n.button.url}`] : []), n.footer ?? "", SCHOOL]
    .filter(Boolean)
    .join("\n\n");
  const html = `<div style="font-family:Georgia,'Times New Roman',serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#123d28">
<p style="font-size:14px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 24px">${esc(SCHOOL)}</p>
<h1 style="font-size:24px;margin:0 0 16px">${esc(n.heading)}</h1>
${n.paragraphs.map((p) => `<p style="font-size:16px;line-height:1.5;margin:0 0 16px">${esc(p)}</p>`).join("\n")}
${n.button ? `<p style="margin:24px 0"><a href="${esc(n.button.url)}" style="background:#123d28;color:#ffffff;padding:14px 28px;text-decoration:none;font-size:14px;letter-spacing:.14em;text-transform:uppercase;display:inline-block">${esc(n.button.label)}</a></p>` : ""}
${n.footer ? `<p style="font-size:13px;color:#555;margin:24px 0 0">${esc(n.footer)}</p>` : ""}
</div>`;

  if (env.EMAIL_DRY_RUN === "true" && !isProd) {
    console.log(`[dry-run email] ${JSON.stringify({ to, subject: n.subject, url: n.button?.url ?? null })}`);
    return;
  }
  if (!resend) {
    if (isProd) throw new Error("RESEND_API_KEY is not configured");
    console.warn(`[dev] RESEND_API_KEY not set; email "${n.subject}" to ${to}${n.button ? ` (${n.button.url})` : ""}`);
    return;
  }
  const { error } = await resend.emails.send({ from: `${SCHOOL} <${env.EMAIL_FROM}>`, to, subject: n.subject, text, html });
  if (error) throw new Error(`Resend: ${error.name}: ${error.message}`);
}
