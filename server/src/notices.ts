import { env } from "./env.js";
import { sendNotice } from "./email.js";
import { formatSlot } from "./time.js";
import { REC_LABELS, REC_LINK_DAYS, type InterviewKind, type RecKind } from "./constants.js";

// Every email the portal sends besides sign-in codes. Family-facing ones are bilingual;
// recommenders are teachers and counselors, so theirs are English.
export type Lang = "en" | "zh";
const L = <T>(lang: Lang, en: T, zh: T): T => (lang === "zh" ? zh : en);

export const recommendUrl = (token: string) => `${env.CLIENT_ORIGIN}/recommend/${encodeURIComponent(token)}`;

const REC_ZH: Record<RecKind, string> = {
  principal_counselor: "现任校长或辅导员",
  math_teacher: "现任数学老师",
  english_teacher: "现任英语老师",
};
const INTERVIEW_LABEL: Record<InterviewKind, { en: string; zh: string }> = {
  athletic: { en: "athletic interview", zh: "体育面试" },
  admissions: { en: "admissions interview", zh: "招生面试" },
};

export type StudentInfo = { studentName: string; grade: string; schoolYear: string };

export function emailRecommenderRequest(
  to: string,
  p: StudentInfo & { recommenderName: string; kind: RecKind; token: string; expiresAt: Date },
) {
  const until = p.expiresAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return sendNotice(to, {
    subject: `Recommendation requested for ${p.studentName}`,
    heading: "A recommendation has been requested",
    paragraphs: [
      `Dear ${p.recommenderName},`,
      `The family of ${p.studentName} has asked you to write a recommendation as their ${REC_LABELS[p.kind]}. ${p.studentName} is applying to grade ${p.grade} at JMC Sports Academy for the ${p.schoolYear} school year.`,
      `Please upload your recommendation as a PDF, JPG or PNG file (up to 10 MB) using the secure link below. The link is unique to you, works until ${until}, and takes only a couple of minutes. Please don’t forward it.`,
      `Your recommendation is confidential. The family will not be able to see it.`,
    ],
    button: { label: "Upload recommendation", url: recommendUrl(p.token) },
    footer: "If you weren’t expecting this request, you can safely ignore this email.",
  });
}

export function emailParentRequestSent(
  to: string, lang: Lang,
  p: StudentInfo & { recommenderName: string; recommenderEmail: string; kind: RecKind; resent: boolean },
) {
  return sendNotice(to, {
    subject: L(lang, `Recommendation request sent for ${p.studentName}`, `已为 ${p.studentName} 发送推荐信邀请`),
    heading: L(lang, p.resent ? "We sent the link again" : "Your request was sent", p.resent ? "我们已重新发送链接" : "您的邀请已发送"),
    paragraphs: [
      L(
        lang,
        `We emailed a secure upload link to ${p.recommenderName} (${p.recommenderEmail}), your child’s ${REC_LABELS[p.kind]}, to submit a recommendation for ${p.studentName}.`,
        `我们已向 ${p.recommenderName}（${p.recommenderEmail}）——${p.studentName} 的${REC_ZH[p.kind]}——发送了安全上传链接，请其为 ${p.studentName} 提交推荐信。`,
      ),
      L(
        lang,
        `You’ll get another email as soon as the recommendation arrives, and your checklist will show a check mark. If it doesn’t arrive, you can resend the link from your checklist.`,
        `推荐信送达后您会立即收到另一封邮件，清单上也会显示勾选标记。如果对方没有收到，您可以在清单中重新发送链接。`,
      ),
    ],
  });
}

export function emailRecommenderThanks(to: string, p: StudentInfo & { recommenderName: string }) {
  return sendNotice(to, {
    subject: `We received your recommendation for ${p.studentName}`,
    heading: "Thank you",
    paragraphs: [
      `Dear ${p.recommenderName},`,
      `We’ve received your recommendation for ${p.studentName}. Thank you for taking the time — nothing more is needed from you.`,
    ],
  });
}

export function emailParentRecommendationReceived(
  to: string, lang: Lang, p: StudentInfo & { recommenderName: string; kind: RecKind },
) {
  return sendNotice(to, {
    subject: L(lang, `Recommendation received for ${p.studentName}`, `已收到 ${p.studentName} 的推荐信`),
    heading: L(lang, "A recommendation arrived", "推荐信已送达"),
    paragraphs: [
      L(
        lang,
        `${p.recommenderName}, your child’s ${REC_LABELS[p.kind]}, has submitted a recommendation for ${p.studentName}. It’s now checked off on your checklist.`,
        `${p.recommenderName}（${p.studentName} 的${REC_ZH[p.kind]}）已提交推荐信，清单中已勾选此项。`,
      ),
    ],
  });
}

export function emailInterviewBooked(
  to: string, lang: Lang,
  p: StudentInfo & { kind: InterviewKind; startsAt: string; endsAt: string; location: string },
) {
  const what = INTERVIEW_LABEL[p.kind];
  return sendNotice(to, {
    subject: L(lang, `Your ${what.en} is scheduled`, `${what.zh}已预约`),
    heading: L(lang, "Interview confirmed", "面试已确认"),
    paragraphs: [
      L(lang, `${p.studentName}’s ${what.en} is scheduled for:`, `${p.studentName} 的${what.zh}已安排在：`),
      formatSlot(p.startsAt, p.endsAt, lang),
      L(lang, `Where: ${p.location}`, `地点：${p.location}`),
      L(
        lang,
        `You can cancel from your checklist up to 24 hours before the start time. If you need to change it later, please contact the Admission Office.`,
        `您可在开始前 24 小时之前于清单中取消预约。如需之后更改，请联系招生办公室。`,
      ),
    ],
  });
}

export function emailInterviewCancelled(
  to: string, lang: Lang,
  p: StudentInfo & { kind: InterviewKind; startsAt: string; endsAt: string },
) {
  const what = INTERVIEW_LABEL[p.kind];
  return sendNotice(to, {
    subject: L(lang, `Your ${what.en} was cancelled`, `${what.zh}已取消`),
    heading: L(lang, "Interview cancelled", "面试已取消"),
    paragraphs: [
      L(
        lang,
        `${p.studentName}’s ${what.en} on ${formatSlot(p.startsAt, p.endsAt, lang)} has been cancelled. You can pick a new time from your checklist.`,
        `${p.studentName} 在 ${formatSlot(p.startsAt, p.endsAt, lang)} 的${what.zh}已取消。您可以在清单中重新选择时间。`,
      ),
    ],
  });
}
