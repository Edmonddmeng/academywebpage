// Placeholder crest drawn in currentColor so it stays transparent over any background.
// Replace with the official school logo once it exists.
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 4h40v22c0 14-9 23-20 27C13 49 4 40 4 26z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M12 31l12-10 12 10" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path
        d="M12 40l12-10 12 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <circle cx="24" cy="13" r="2.75" fill="currentColor" />
    </svg>
  )
}
