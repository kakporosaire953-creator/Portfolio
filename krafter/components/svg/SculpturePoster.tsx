/**
 * Static posters for the two sculptures.
 *
 * They are not a substitute for the 3D work: they paint instantly while the
 * WebGL chunk loads, and they stay if WebGL is unavailable, refused, or loses
 * its context. Drawn with the brand palette only, so the fallback is a quiet
 * still frame rather than a broken box.
 */

export function SculpturePoster({ model }: { model: "ghost" | "liquid-core" }) {
  if (model === "ghost") {
    return (
      <svg viewBox="0 0 320 380" role="presentation" focusable="false" aria-hidden="true">
        <defs>
          <linearGradient id="ghost-skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3f7fa3" />
            <stop offset="38%" stopColor="#2a5878" />
            <stop offset="72%" stopColor="#7d4a33" />
            <stop offset="100%" stopColor="#c8642b" />
          </linearGradient>
          <radialGradient id="ghost-glow" cx="50%" cy="46%" r="52%">
            <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#1e6fd9" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1e6fd9" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="160" cy="178" rx="150" ry="160" fill="url(#ghost-glow)" />

        <path
          fill="url(#ghost-skin)"
          fillRule="evenodd"
          d="M160 34
             C 224 34 262 88 262 152
             C 262 190 252 226 244 262
             C 238 290 246 318 230 326
             C 214 334 202 308 194 296
             C 184 318 172 340 160 340
             C 148 340 136 318 126 296
             C 118 308 106 334 90 326
             C 74 318 82 290 76 262
             C 68 226 58 190 58 152
             C 58 88 96 34 160 34 Z
             M 122 122
             C 112 122 106 138 107 158
             C 108 180 116 196 126 196
             C 136 196 142 180 141 158
             C 140 138 132 122 122 122 Z
             M 198 122
             C 188 122 180 138 179 158
             C 178 180 184 196 194 196
             C 204 196 212 180 213 158
             C 214 138 208 122 198 122 Z"
        />

        <ellipse cx="122" cy="158" rx="17" ry="37" fill="#081a2b" fillOpacity="0.86" />
        <ellipse cx="198" cy="158" rx="17" ry="37" fill="#081a2b" fillOpacity="0.86" />

        <path
          d="M96 150
             C 96 96 124 58 160 52
             C 196 58 224 96 224 150"
          fill="none"
          stroke="#faf8f3"
          strokeOpacity="0.32"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M114 262 C 124 292 136 308 148 316
             M 206 262 C 196 292 184 308 172 316"
          fill="none"
          stroke="#ffb27a"
          strokeOpacity="0.3"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 360 360" role="presentation" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id="core-navy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#123b5d" />
          <stop offset="55%" stopColor="#0c2338" />
          <stop offset="100%" stopColor="#2f7fb4" />
        </linearGradient>
        <linearGradient id="core-ember" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#ff8a2b" />
          <stop offset="60%" stopColor="#c8642b" />
          <stop offset="100%" stopColor="#ff6a00" />
        </linearGradient>
        <linearGradient id="core-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#faf8f3" />
          <stop offset="100%" stopColor="#8aa6bd" />
        </linearGradient>
      </defs>

      <g fill="none" strokeLinecap="round">
        <path
          d="M110 96 C 176 52 244 78 244 132 C 244 186 168 190 124 158 C 80 126 92 86 136 78 C 200 66 254 118 244 176 C 234 234 150 258 108 224 C 66 190 88 140 150 128"
          stroke="url(#core-navy)"
          strokeWidth="28"
        />
        <path
          d="M96 214 C 140 258 214 268 252 226 C 290 184 260 118 210 108 C 160 98 108 124 96 172 C 84 220 112 266 164 276"
          stroke="url(#core-ember)"
          strokeWidth="19"
        />
        <path
          d="M188 84 C 236 88 272 128 268 172 C 264 216 218 248 174 240 C 130 232 108 190 118 152"
          stroke="url(#core-paper)"
          strokeWidth="13"
        />
        <path
          d="M140 232 C 168 254 208 250 226 224 C 244 198 224 164 196 158"
          stroke="#54cfe0"
          strokeOpacity="0.55"
          strokeWidth="6"
        />
      </g>
    </svg>
  );
}
