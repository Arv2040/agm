export function CaterpillarLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 20L12 4L22 20H2Z"
            fill="#FFCD11"
            stroke="#000000"
            strokeWidth="1"
          />
          <text
            x="12"
            y="16"
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
            fill="#000000"
          >
            CAT
          </text>
        </svg>
      </div>
      <span className="text-xl font-bold text-cat-text-primary">CATERPILLAR</span>
    </div>
  );
}