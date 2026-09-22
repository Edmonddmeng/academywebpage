// The application intake, defined once. The server validates against this and serves it to
// the browser, which renders it — so fields, options and required rules can never drift.
//
// Chinese labels are optional: the client falls back to English until `zh` is filled in.

export type Localized = { en: string; zh?: string };
export type Option = { value: string; label: Localized };
export type ShowIf = { field: string; equals?: string; in?: string[] };

export type FieldType =
  | "text" | "textarea" | "email" | "tel" | "date" | "number"
  | "select" | "yesno" | "checkboxes" | "checkbox"
  | "group" | "repeat" | "note";

export type Field = {
  id: string;
  type: FieldType;
  label: Localized;
  help?: Localized;
  required?: boolean;
  options?: Option[];
  fields?: Field[]; // group / repeat
  showIf?: ShowIf; // refers to a sibling field in the same object
  max?: number; // text: max length · repeat: max items
  half?: boolean; // render at half width on wide screens
};

export type Step = { id: string; title: Localized; intro?: Localized; fields: Field[] };

const L = (en: string, zh?: string): Localized => ({ en, zh });
type Extra = Partial<Omit<Field, "id" | "type" | "label">>;
const f = (type: FieldType, id: string, label: string, extra: Extra = {}): Field => ({
  id, type, label: L(label), ...extra,
});
const text = (id: string, label: string, e?: Extra) => f("text", id, label, e);
const textarea = (id: string, label: string, e?: Extra) => f("textarea", id, label, { max: 4000, ...e });
const email = (id: string, label: string, e?: Extra) => f("email", id, label, e);
const tel = (id: string, label: string, e?: Extra) => f("tel", id, label, e);
const date = (id: string, label: string, e?: Extra) => f("date", id, label, e);
const number = (id: string, label: string, e?: Extra) => f("number", id, label, e);
const yesno = (id: string, label: string, e?: Extra) => f("yesno", id, label, e);
const note = (id: string, label: string, e?: Extra) => f("note", id, label, e);
const options = (pairs: [string, string][]): Option[] => pairs.map(([value, label]) => ({ value, label: L(label) }));
const select = (id: string, label: string, pairs: [string, string][], e?: Extra) =>
  f("select", id, label, { options: options(pairs), ...e });
const checkboxes = (id: string, label: string, pairs: [string, string][], e?: Extra) =>
  f("checkboxes", id, label, { options: options(pairs), ...e });
const group = (id: string, label: string, fields: Field[], e?: Extra) => f("group", id, label, { fields, ...e });
const repeat = (id: string, label: string, fields: Field[], e?: Extra) =>
  f("repeat", id, label, { fields, max: 6, ...e });

const yes = (field: string): ShowIf => ({ field, equals: "yes" });
const no = (field: string): ShowIf => ({ field, equals: "no" });

const address = (id: string, label: string, e?: Extra) =>
  group(
    id,
    label,
    [
      text("line1", "Street address", { required: true }),
      text("line2", "Apartment, suite, etc."),
      text("city", "City", { required: true, half: true }),
      text("state", "State / province", { half: true }),
      text("postal", "ZIP / postal code", { half: true }),
      text("country", "Country", { required: true, half: true }),
    ],
    e,
  );

const RELATIONSHIPS: [string, string][] = [
  ["mother", "Mother"], ["father", "Father"], ["stepmother", "Stepmother"], ["stepfather", "Stepfather"],
  ["grandparent", "Grandparent"], ["guardian", "Legal guardian"], ["other", "Other"],
];
const EMPLOYMENT: [string, string][] = [
  ["employed", "Employed"], ["self_employed", "Self-employed / business owner"], ["homemaker", "Homemaker"],
  ["retired", "Retired"], ["not_employed", "Not currently employed"],
];
const working: ShowIf = { field: "employmentStatus", in: ["employed", "self_employed"] };

const parentFields = (): Field[] => [
  select("title", "Title", [["mr", "Mr."], ["mrs", "Mrs."], ["ms", "Ms."], ["dr", "Dr."], ["other", "Other"]], { half: true }),
  select("relationship", "Relationship to applicant", RELATIONSHIPS, { required: true, half: true }),
  text("firstName", "First name", { required: true, half: true }),
  text("lastName", "Last name", { required: true, half: true }),
  text("preferredName", "Preferred first name (only if different)", { half: true }),
  email("email", "Email", { required: true, half: true }),
  tel("primaryPhone", "Primary phone", { required: true, half: true }),
  tel("secondaryPhone", "Secondary phone", { half: true }),
  text("highSchool", "High school attended"),
  yesno("attendedCollege", "Has this parent/guardian attended college?"),
  text("college", "College attended", { showIf: yes("attendedCollege") }),
  select("employmentStatus", "Employment status", EMPLOYMENT),
  text("occupation", "Title / occupation", { showIf: working, half: true }),
  text("employer", "Name of business", { showIf: working, half: true }),
  tel("businessPhone", "Business phone", { showIf: working, half: true }),
  text("businessAddress", "Business address", { showIf: working, half: true }),
];

const SPORTS: [string, string][] = [
  ["ice_hockey", "Ice hockey"], ["golf", "Golf"], ["tennis", "Tennis"], ["fencing", "Fencing"],
  ["lacrosse", "Lacrosse"], ["other", "Other"],
];

// Placeholder wording — replace with the school's counsel-approved release before launch,
// and bump CONSENT_VERSION so signatures record which text was agreed to.
export const CONSENT_VERSION = "placeholder-1";
const CONSENT_TEXT =
  "I give JMC Sports Academy permission to request, and my child’s current and previous schools to provide, the records needed to evaluate this application, including academic transcripts, standardized test scores, attendance and disciplinary records. I understand that everything shared with the Admission Office is kept confidential, and I confirm that the information in this application is accurate and complete to the best of my knowledge.";

export const STEPS: Step[] = [
  {
    id: "applicant",
    title: L("Applicant"),
    intro: L("Tell us about the student who is applying."),
    fields: [
      text("firstName", "Legal first name", { required: true, half: true }),
      text("lastName", "Legal last name", { required: true, half: true }),
      text("middleName", "Middle name", { half: true }),
      text("preferredName", "Preferred first name (only if different)", { half: true }),
      date("dob", "Date of birth", { required: true, half: true }),
      select("gender", "Gender", [["male", "Male"], ["female", "Female"], ["nonbinary", "Non-binary"], ["prefer_not", "Prefer not to say"]], { required: true, half: true }),
      select(
        "ethnicity",
        "Ethnicity",
        [
          ["asian", "Asian"], ["black", "Black or African American"], ["hispanic", "Hispanic or Latino"],
          ["white", "White"], ["native", "American Indian or Alaska Native"], ["pacific", "Native Hawaiian or Pacific Islander"],
          ["multiple", "Two or more"], ["other", "Other"], ["prefer_not", "Prefer not to say"],
        ],
        { half: true },
      ),
      select("currentGrade", "Grade level this school year", ["5", "6", "7", "8", "9", "10", "11", "12"].map((g) => [g, `Grade ${g}`] as [string, string]), { required: true, half: true }),
      email("studentEmail", "Student email", { half: true }),
      tel("studentPhone", "Student cell phone", { half: true }),
      yesno("appliedBefore", "Has the applicant applied to JMC Sports Academy before?", { required: true }),
      yesno("repeatingGrade", "Is the applicant applying to repeat a grade?", { required: true }),
      yesno("financialAid", "Are you interested in applying for financial assistance?", { required: true }),
      yesno("usCitizen", "Is the applicant a U.S. citizen?", { required: true }),
      text("citizenshipCountry", "Country of citizenship", { required: true, half: true, showIf: no("usCitizen") }),
      select(
        "visaStatus",
        "Current U.S. immigration status",
        [["permanent_resident", "Permanent resident (green card)"], ["visa", "Holds a visa"], ["not_in_us", "Not currently in the U.S."], ["other", "Other"]],
        { required: true, half: true, showIf: no("usCitizen") },
      ),
      yesno("livedInUs", "Has the applicant been enrolled continuously in a U.S. school for the last three years?", { required: true, showIf: no("usCitizen") }),
      select(
        "englishTest",
        "English proficiency test taken",
        [["none", "Not yet taken"], ["toefl", "TOEFL"], ["ielts", "IELTS"], ["duolingo", "Duolingo English Test"], ["itep", "iTEP"], ["other", "Other"]],
        { half: true, showIf: { field: "livedInUs", equals: "no" } },
      ),
      text("englishScore", "Score", { half: true, showIf: { field: "englishTest", in: ["toefl", "ielts", "duolingo", "itep", "other"] } }),
    ],
  },
  {
    id: "education",
    title: L("Education"),
    intro: L("Tell us about the applicant’s current and previous schools."),
    fields: [
      text("schoolName", "Name of current school", { required: true }),
      select("schoolType", "Type of school", [["public", "Public"], ["private", "Private"], ["charter", "Charter"], ["homeschool", "Homeschool"], ["international", "International school"], ["other", "Other"]], { required: true, half: true }),
      number("yearsAttended", "Years attended", { required: true, half: true }),
      tel("schoolPhone", "School phone", { half: true }),
      address("schoolAddress", "School address", { required: true }),
      text("previousSchool", "School attended in the previous grade (if different)"),
      yesno("otherSchoolRecent", "Has the applicant attended another school in the past two years?", { required: true }),
      textarea("otherSchoolDetails", "Which school(s), and when?", { required: true, showIf: yes("otherSchoolRecent") }),
      yesno("repeatedYear", "Has the applicant repeated a year?", { required: true }),
      yesno("skippedYear", "Has the applicant skipped a year?", { required: true }),
      yesno("disciplinary", "Has the applicant ever been subject to disciplinary action by a current or previous school?", { required: true }),
      textarea("disciplinaryDetails", "Please explain", { required: true, showIf: yes("disciplinary") }),
      yesno("graduateHere", "Is it your intention for your child to graduate from JMC Sports Academy?", { required: true }),
    ],
  },
  {
    id: "interests",
    title: L("Athletics & interests"),
    intro: L("Tell us about the applicant’s athletic and academic interests."),
    fields: [
      checkboxes("sports", "In which sport(s) would the applicant like to train at JMC?", SPORTS, { required: true }),
      text("sportsOther", "Other sport", { required: true, showIf: { field: "sports", equals: "other" } }),
      repeat(
        "sportExperience",
        "Sport experience",
        [
          select("sport", "Sport", SPORTS, { required: true, half: true }),
          number("years", "Years of experience", { required: true, half: true }),
          text("team", "Club, travel or school team", { half: true }),
          text("ranking", "Rating or ranking (e.g. UTR, USTA, USA Hockey)", { half: true }),
          text("coachName", "Coach name", { half: true }),
          email("coachEmail", "Coach email", { half: true }),
          textarea("details", "Anything else we should know about the applicant’s experience?", { max: 2000 }),
        ],
        { help: L("Add one entry for each sport the applicant has experience in.") },
      ),
      checkboxes(
        "activities",
        "In which academic teams, clubs or arts has the applicant participated?",
        [
          ["debate", "Debate / Model UN"], ["math", "Math or science competition"], ["robotics", "Robotics / coding"],
          ["orchestra", "Orchestra / strings"], ["band", "Band"], ["choir", "Choir"], ["theater", "Theater"],
          ["visual_arts", "Visual arts"], ["other", "Other"],
        ],
      ),
      text("activitiesOther", "Other activity", { required: true, showIf: { field: "activities", equals: "other" } }),
      repeat(
        "activityDetails",
        "Activity details",
        [
          text("activity", "Activity", { required: true, half: true }),
          text("where", "Where has the applicant studied or participated?", { half: true }),
          number("years", "Years of experience", { half: true }),
          textarea("details", "Anything else you’d like to share?", { max: 2000 }),
        ],
      ),
    ],
  },
  {
    id: "family",
    title: L("Family"),
    intro: L("Tell us about the applicant’s household and family."),
    fields: [
      address("homeAddress", "Primary home address", { required: true }),
      select("livesWith", "Applicant lives with", [["both", "Both parents"], ["mother", "Mother"], ["father", "Father"], ["guardian", "Legal guardian"], ["split", "Splits time between households"], ["other", "Other"]], { required: true, half: true }),
      select("maritalStatus", "Marital status of parents", [["married", "Married"], ["divorced", "Divorced"], ["separated", "Separated"], ["single", "Single"], ["widowed", "Widowed"], ["other", "Other"]], { required: true, half: true }),
      select("financiallyResponsible", "Parent financially responsible for the applicant’s education", [["both", "Both parents"], ["mother", "Mother"], ["father", "Father"], ["guardian", "Legal guardian"], ["other", "Other"]], { required: true }),
      group("parent1", "First parent / guardian", parentFields(), { required: true }),
      yesno("hasParent2", "Is there a second parent or legal guardian in this household?", { required: true }),
      group("parent2", "Second parent / guardian", parentFields(), { showIf: yes("hasParent2") }),
      yesno("hasSecondHousehold", "Does the applicant have a second household? (Required if parents are divorced, unless one parent has proof of sole custody.)", { required: true }),
      address("secondHousehold", "Second household address", { showIf: yes("hasSecondHousehold") }),
      repeat(
        "siblings",
        "Siblings",
        [
          text("name", "Name", { required: true, half: true }),
          select("relationship", "Relationship", [["brother", "Brother"], ["sister", "Sister"], ["half_sibling", "Half-sibling"], ["step_sibling", "Step-sibling"]], { half: true }),
          text("ageOrGrade", "Age or current grade", { half: true }),
          text("school", "School or university attended", { half: true }),
        ],
        { help: L("Add each brother or sister, including any who attend or attended JMC."), max: 10 },
      ),
    ],
  },
  {
    id: "questionnaire",
    title: L("Questionnaire & signature"),
    intro: L("A few questions for parents, then sign to submit the application."),
    fields: [
      select(
        "howHeard",
        "How did you hear about us?",
        [["visit", "School visit"], ["website", "Website or search"], ["family", "Friend or family"], ["current_family", "Current JMC family"], ["coach", "Coach or club"], ["social", "Social media"], ["agent", "Education consultant"], ["other", "Other"]],
        { required: true, half: true },
      ),
      text("howHeardOther", "Please tell us how", { half: true, showIf: { field: "howHeard", equals: "other" } }),
      textarea("describeChild", "Please describe your child as objectively and completely as you can.", { required: true }),
      textarea("interestInSchool", "Explain your interest in sending your child to JMC Sports Academy.", { required: true }),
      textarea("parentRole", "What do you see as your main role in your child’s education?", { required: true }),
      textarea("strengthsWeaknesses", "Describe your child’s academic and personal strengths and weaknesses.", { required: true }),
      textarea("volunteer", "Please describe any volunteer work, service activities or community involvement you have participated in."),
      textarea("additionalInfo", "Is there any additional information you would like to provide to the Admission Committee?"),
      yesno("translation", "If your child enrolls, would you like school documents translated into another language?", { required: true }),
      text("translationLanguage", "Which language?", { required: true, showIf: yes("translation") }),
      note("consentTitle", "Permission and confirmation", { help: L(CONSENT_TEXT) }),
      f("checkbox", "consentAgree", "I have read and agree to the statement above.", { required: true }),
      text("signatureName", "Parent / guardian full name (electronic signature)", {
        required: true,
        help: L("By typing your name you agree that this serves as your electronic signature. We record your account email, the date and time, and your IP address."),
      }),
    ],
  },
];

export const STEP_IDS = STEPS.map((s) => s.id);
export const SCHOOL_YEARS = ["2026-2027", "2027-2028"];
export const GRADES = ["6", "7", "8", "9", "10", "11", "12"];

export const CHECKLIST_KINDS = [
  "application_form", "application_fee", "birth_certificate", "athletic_interview", "admissions_interview",
  "test_scores", "rec_principal", "rec_math", "rec_english", "report_card",
] as const;
