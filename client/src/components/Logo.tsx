// Placeholder JMC crest drawn in currentColor so it sits on any background.
// Replace with the official logo once it exists.
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 4h40v22c0 14-9 23-20 27C13 49 4 40 4 26z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fontFamily="Times New Roman, Times, serif"
        fontSize="15"
        letterSpacing="0.5"
        fill="currentColor"
      >
        JMC
      </text>
      <path d="M13 37h22" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
