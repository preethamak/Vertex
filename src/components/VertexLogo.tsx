export function VertexLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vertex"
    >
      {/* Left wing */}
      <path d="M4 22 L34 22 L44 34 L30 34 Z" fill="currentColor" opacity="0.95" />
      <path d="M14 14 L38 14 L44 22 L24 22 Z" fill="currentColor" opacity="0.75" />
      {/* Right wing */}
      <path d="M116 22 L86 22 L76 34 L90 34 Z" fill="currentColor" opacity="0.95" />
      <path d="M106 14 L82 14 L76 22 L96 22 Z" fill="currentColor" opacity="0.75" />
      {/* V body */}
      <path
        d="M40 20 L60 54 L80 20 L70 20 L60 38 L50 20 Z"
        fill="currentColor"
      />
    </svg>
  );
}
