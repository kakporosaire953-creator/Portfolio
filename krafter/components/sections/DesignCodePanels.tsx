type PanelProps = { id: string };

const frame = (
  <rect x="24" y="24" width="432" height="332" fill="none" stroke="var(--line)" strokeWidth="1" />
);

/** Five original, architectural stage illustrations — one per Design × Code step. */
export function DesignCodePanel({ id }: PanelProps) {
  switch (id) {
    case "wireframe":
      return (
        <svg viewBox="0 0 480 380" role="img" aria-label="Wireframe">
          {frame}
          <g stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5">
            <path d="M24 110h432M24 250h432M140 24v332M340 24v332" />
          </g>
          <g fill="none" stroke="var(--line-strong)" strokeWidth="1.2">
            <rect x="48" y="48" width="70" height="8" />
            <rect x="48" y="76" width="180" height="22" />
            <rect x="48" y="108" width="130" height="22" />
            <rect x="48" y="146" width="92" height="10" />
            <rect x="48" y="168" width="120" height="10" />
            <rect x="48" y="206" width="96" height="30" />
            <rect x="160" y="206" width="76" height="30" />
          </g>
          <g fill="none" stroke="var(--line)" strokeWidth="1">
            <rect x="360" y="48" width="72" height="72" />
            <rect x="360" y="132" width="72" height="12" />
            <rect x="360" y="152" width="52" height="12" />
            <rect x="360" y="190" width="72" height="72" strokeDasharray="3 4" />
          </g>
          <rect x="48" y="276" width="384" height="56" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 6" />
          <text x="48" y="300" fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-mute)" letterSpacing="2">
            STRUCTURE / READING ORDER
          </text>
        </svg>
      );
    case "design":
      return (
        <svg viewBox="0 0 480 380" role="img" aria-label="Interface design">
          {frame}
          <rect x="24" y="24" width="196" height="332" fill="var(--paper-soft)" />
          <text x="48" y="128" fontFamily="var(--font-serif)" fontSize="76" fontStyle="italic" fill="var(--ink)">
            Aa
          </text>
          <rect x="48" y="158" width="120" height="6" fill="var(--orange)" />
          <rect x="48" y="184" width="150" height="4" fill="var(--line-strong)" />
          <rect x="48" y="196" width="126" height="4" fill="var(--line-strong)" />
          <rect x="48" y="208" width="140" height="4" fill="var(--line-strong)" />
          <rect x="48" y="248" width="106" height="26" fill="var(--orange)" />
          <rect x="164" y="248" width="40" height="26" fill="none" stroke="var(--line-strong)" />
          <g stroke="var(--line)" strokeWidth="1">
            <path d="M244 48h188M244 108h188M244 168h188M244 228h188M244 288h188" />
            <path d="M244 48v300M338 48v300M432 48v300" />
          </g>
          <rect x="252" y="56" width="78" height="44" fill="var(--navy)" opacity="0.9" />
          <rect x="346" y="56" width="78" height="44" fill="none" stroke="var(--line-strong)" />
          <rect x="252" y="116" width="78" height="44" fill="none" stroke="var(--line-strong)" />
          <rect x="346" y="116" width="78" height="44" fill="var(--brand-gold)" opacity="0.8" />
          <text x="48" y="332" fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-mute)" letterSpacing="2">
            TYPE / COLOUR / RHYTHM
          </text>
        </svg>
      );
    case "component":
      return (
        <svg viewBox="0 0 480 380" role="img" aria-label="Component system">
          {frame}
          <g fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5">
            <rect x="112" y="86" width="256" height="208" />
          </g>
          <rect x="132" y="106" width="216" height="168" fill="var(--paper)" stroke="var(--line-strong)" />
          <rect x="152" y="126" width="60" height="60" fill="var(--orange)" />
          <rect x="224" y="126" width="104" height="10" fill="var(--ink)" opacity="0.8" />
          <rect x="224" y="148" width="76" height="8" fill="var(--line-strong)" />
          <rect x="152" y="204" width="176" height="8" fill="var(--line-strong)" />
          <rect x="152" y="220" width="140" height="8" fill="var(--line-strong)" />
          <rect x="152" y="244" width="66" height="18" fill="var(--ink)" />
          <g stroke="var(--orange)" strokeWidth="1.2" fill="none">
            <path d="M112 86h-22v22M368 86h22v22M112 294h-22v-22M368 294h22v-22" />
          </g>
          <g fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-mute)" letterSpacing="1.5">
            <text x="112" y="72">props</text>
            <text x="336" y="318">variants</text>
            <text x="24" y="336">SHARED / TYPED / DOCUMENTED</text>
          </g>
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 480 380" role="img" aria-label="Code">
          {frame}
          <rect x="24" y="24" width="432" height="30" fill="var(--paper-soft)" />
          <g fill="var(--line-strong)">
            <circle cx="42" cy="39" r="3" />
            <circle cx="54" cy="39" r="3" />
            <circle cx="66" cy="39" r="3" />
          </g>
          <text x="84" y="43" fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-mute)" letterSpacing="1.5">
            hero.tsx
          </text>
          <g fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-soft)">
            <text x="44" y="86">const</text>
            <text x="86" y="86" fill="var(--orange)">Hero</text>
            <text x="118" y="86">= () =&gt;</text>
            <text x="44" y="106">&lt;section</text>
            <text x="114" y="106" fill="var(--navy-tech)">className</text>
            <text x="184" y="106">=</text>
            <text x="194" y="106" fill="var(--orange)">&quot;hero&quot;</text>
            <text x="242" y="106">&gt;</text>
            <text x="64" y="126">&lt;Reveal</text>
            <text x="124" y="126" fill="var(--navy-tech)">lines</text>
            <text x="158" y="126">=&gt;</text>
            <text x="64" y="146">&lt;Figure</text>
            <text x="124" y="146" fill="var(--navy-tech)">clip</text>
            <text x="154" y="146">=&quot;mask&quot;</text>
            <text x="204" y="146">/&gt;</text>
            <text x="64" y="166">&lt;/Reveal&gt;</text>
            <text x="44" y="186">&lt;/section&gt;</text>
            <text x="44" y="216" fill="var(--ink-mute)">// gsap.context → cleanup on unmount</text>
          </g>
          <g stroke="var(--orange)" strokeWidth="1.2">
            <path d="M24 230h432" />
          </g>
          <text x="44" y="256" fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-mute)" letterSpacing="1.5">
            TYPE-SAFE / ACCESSIBLE / PERFORMANT
          </text>
          <g fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-mute)">
            <text x="44" y="286">build: 12.4s</text>
            <text x="44" y="302">a11y: keyboard + contrast</text>
          </g>
        </svg>
      );
    case "product":
    default:
      return (
        <svg viewBox="0 0 480 380" role="img" aria-label="Product">
          {frame}
          <rect x="24" y="24" width="432" height="26" fill="var(--navy)" />
          <rect x="40" y="34" width="30" height="6" fill="var(--orange)" />
          <g fill="var(--paper)" opacity="0.7">
            <rect x="300" y="34" width="26" height="5" />
            <rect x="336" y="34" width="34" height="5" />
            <rect x="380" y="34" width="22" height="5" />
          </g>
          <text x="48" y="118" fontFamily="var(--font-serif)" fontSize="42" fontStyle="italic" fill="var(--ink)">
            Impact.
          </text>
          <rect x="48" y="136" width="130" height="5" fill="var(--orange)" />
          <g fill="var(--line-strong)">
            <rect x="48" y="158" width="182" height="5" />
            <rect x="48" y="170" width="150" height="5" />
            <rect x="48" y="182" width="168" height="5" />
          </g>
          <rect x="48" y="206" width="96" height="26" fill="var(--orange)" />
          <g fill="none" stroke="var(--line-strong)">
            <circle cx="360" cy="176" r="66" />
            <circle cx="360" cy="176" r="46" stroke="var(--orange)" />
            <path d="M294 176h132M360 110v132" strokeDasharray="3 6" />
          </g>
          <rect x="24" y="286" width="432" height="70" fill="var(--paper-soft)" />
          <g fill="var(--line-strong)">
            <rect x="48" y="308" width="84" height="6" />
            <rect x="48" y="322" width="60" height="6" />
            <rect x="180" y="308" width="70" height="6" />
            <rect x="292" y="308" width="60" height="6" />
            <rect x="392" y="308" width="40" height="6" />
          </g>
        </svg>
      );
  }
}
