import { FLOWERS, WRAPS, type Flower, type FlowerKind, type Selection } from "@/lib/bouquet";

const GREEN_KINDS: FlowerKind[] = ["okaliptus", "cipso", "aspidistra"];

/** Math.sin sonuçları Node ile tarayıcıda son basamakta ayrışabiliyor;
 *  yuvarlamazsak SSR ile istemci çıktısı birebir tutmuyor. */
function round(value: number) {
  return Math.round(value * 1e4) / 1e4;
}

/** Aynı seçim her zaman aynı buketi çizsin diye deterministik dağılım. */
function jitter(seed: number, spread: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return round((x - Math.floor(x) - 0.5) * spread);
}

function polar(angleRad: number, radius: number) {
  return { x: round(Math.cos(angleRad) * radius), y: round(Math.sin(angleRad) * radius) };
}

function Bloom({ flower, seed }: { flower: Flower; seed: number }) {
  const { color, shade, center, kind } = flower;
  const stroke = shade;

  if (kind === "gul") {
    return (
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse
            key={i}
            cx={0}
            cy={-0.52}
            rx={0.56}
            ry={0.62}
            fill={color}
            stroke={stroke}
            strokeWidth={0.03}
            transform={`rotate(${i * 72 + jitter(seed + i, 14)})`}
          />
        ))}
        <circle r={0.56} fill={color} stroke={stroke} strokeWidth={0.03} />
        <path
          d="M-0.34 0.08 A0.35 0.35 0 1 1 0.3 -0.16"
          fill="none"
          stroke={stroke}
          strokeWidth={0.075}
          strokeLinecap="round"
        />
        <path
          d="M-0.18 0.06 A0.19 0.19 0 1 1 0.16 -0.09"
          fill="none"
          stroke={stroke}
          strokeWidth={0.065}
          strokeLinecap="round"
        />
        <circle r={0.07} fill={center} />
      </g>
    );
  }

  if (kind === "papatya") {
    return (
      <g>
        {Array.from({ length: 13 }).map((_, i) => (
          <ellipse
            key={i}
            cx={0}
            cy={-0.62}
            rx={0.16}
            ry={0.5}
            fill={color}
            stroke={shade}
            strokeWidth={0.025}
            transform={`rotate(${(i * 360) / 13 + jitter(seed + i, 8)})`}
          />
        ))}
        <circle r={0.3} fill={center} />
        <circle r={0.3} fill="none" stroke={shade} strokeWidth={0.03} />
      </g>
    );
  }

  if (kind === "gerbera") {
    return (
      <g>
        {Array.from({ length: 20 }).map((_, i) => (
          <ellipse
            key={`o${i}`}
            cx={0}
            cy={-0.66}
            rx={0.1}
            ry={0.56}
            fill={color}
            transform={`rotate(${(i * 360) / 20 + jitter(seed + i, 6)})`}
          />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <ellipse
            key={`i${i}`}
            cx={0}
            cy={-0.38}
            rx={0.08}
            ry={0.32}
            fill={shade}
            transform={`rotate(${(i * 360) / 14 + 12})`}
          />
        ))}
        <circle r={0.24} fill={center} />
        <circle r={0.12} fill={color} opacity={0.5} />
      </g>
    );
  }

  if (kind === "karanfil") {
    return (
      <g>
        {Array.from({ length: 11 }).map((_, i) => {
          const p = polar(
            ((i * 360) / 11 + jitter(seed + i, 12)) * (Math.PI / 180),
            0.55,
          );
          return (
            <circle
              key={`o${i}`}
              cx={p.x}
              cy={p.y}
              r={0.36}
              fill={color}
              stroke={shade}
              strokeWidth={0.025}
            />
          );
        })}
        {Array.from({ length: 7 }).map((_, i) => {
          const p = polar(((i * 360) / 7 + 20) * (Math.PI / 180), 0.26);
          return (
            <circle
              key={`i${i}`}
              cx={p.x}
              cy={p.y}
              r={0.26}
              fill={color}
              stroke={shade}
              strokeWidth={0.025}
            />
          );
        })}
        <circle r={0.14} fill={center} opacity={0.7} />
      </g>
    );
  }

  if (kind === "lilyum") {
    return (
      <g>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d="M0 0 C0.34 -0.42 0.4 -0.95 0 -1.25 C-0.4 -0.95 -0.34 -0.42 0 0 Z"
            fill={color}
            stroke={shade}
            strokeWidth={0.035}
            transform={`rotate(${i * 60 + jitter(seed + i, 8)})`}
          />
        ))}
        {[-28, 0, 28].map((a, i) => (
          <g key={i} transform={`rotate(${a})`}>
            <line x1={0} y1={0} x2={0} y2={-0.5} stroke={center} strokeWidth={0.05} />
            <ellipse cx={0} cy={-0.55} rx={0.07} ry={0.11} fill={center} />
          </g>
        ))}
      </g>
    );
  }

  if (kind === "aycicegi") {
    return (
      <g>
        {Array.from({ length: 18 }).map((_, i) => (
          <path
            key={i}
            d="M0 -0.4 L0.15 -0.95 L0 -1.22 L-0.15 -0.95 Z"
            fill={i % 2 ? shade : color}
            transform={`rotate(${(i * 360) / 18 + jitter(seed + i, 5)})`}
          />
        ))}
        <circle r={0.44} fill={center} />
        <circle r={0.44} fill="none" stroke={shade} strokeWidth={0.05} />
        <circle r={0.24} fill="#3f2712" opacity={0.55} />
      </g>
    );
  }

  if (kind === "lisianthus") {
    return (
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d="M0 0 C0.5 -0.3 0.6 -0.9 0 -1.05 C-0.6 -0.9 -0.5 -0.3 0 0 Z"
            fill={color}
            stroke={shade}
            strokeWidth={0.03}
            transform={`rotate(${i * 72 + jitter(seed + i, 10)})`}
          />
        ))}
        <circle r={0.19} fill={center} />
      </g>
    );
  }

  if (kind === "orkide") {
    return (
      <g>
        {[-120, -60, 120, 60].map((a, i) => (
          <ellipse
            key={i}
            cx={0}
            cy={-0.6}
            rx={0.36}
            ry={0.54}
            fill={color}
            stroke={shade}
            strokeWidth={0.03}
            transform={`rotate(${a})`}
          />
        ))}
        <ellipse cx={0} cy={-0.62} rx={0.3} ry={0.5} fill={color} stroke={shade} strokeWidth={0.03} />
        <path d="M-0.26 0.18 C-0.3 0.6 0.3 0.6 0.26 0.18 C0.14 0.4 -0.14 0.4 -0.26 0.18 Z" fill={center} opacity={0.85} />
        <circle r={0.16} fill={center} />
      </g>
    );
  }

  if (kind === "okaliptus") {
    return (
      <g>
        <path d="M0 0.9 C0.05 0.2 -0.05 -0.4 0 -1.1" fill="none" stroke={shade} strokeWidth={0.07} />
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 0.75 - i * 0.24;
          const side = i % 2 ? 1 : -1;
          const r = 0.3 - i * 0.017;
          return (
            <ellipse
              key={i}
              cx={side * (0.26 + i * 0.005)}
              cy={y}
              rx={r}
              ry={r * 0.86}
              fill={i % 3 === 0 ? shade : color}
              stroke={shade}
              strokeWidth={0.02}
            />
          );
        })}
      </g>
    );
  }

  if (kind === "cipso") {
    return (
      <g>
        {Array.from({ length: 22 }).map((_, i) => {
          const rad = 0.22 + (i / 22) * 0.72;
          const p = polar((i * 137.5 + jitter(seed + i, 40)) * (Math.PI / 180), rad);
          return (
            <circle
              key={i}
              cx={p.x}
              cy={round(p.y * 0.9)}
              r={0.13}
              fill={color}
              stroke={shade}
              strokeWidth={0.02}
            />
          );
        })}
      </g>
    );
  }

  // aspidistra
  return (
    <g transform={`rotate(${jitter(seed, 22)})`}>
      <path
        d="M0 1 C-0.55 0.2 -0.5 -0.7 0 -1.25 C0.5 -0.7 0.55 0.2 0 1 Z"
        fill={color}
        stroke={shade}
        strokeWidth={0.04}
      />
      <path d="M0 0.95 L0 -1.15" fill="none" stroke={center} strokeWidth={0.05} opacity={0.7} />
    </g>
  );
}

type Slot = { x: number; y: number; r: number };

/** Kubbe şeklinde halkalar — merkeze yakın olanlar öne çizilir. */
function buildSlots(count: number): Slot[] {
  const rings = [
    { radius: 0, capacity: 1 },
    { radius: 36, capacity: 6 },
    { radius: 68, capacity: 11 },
    { radius: 97, capacity: 16 },
    { radius: 124, capacity: 20 },
  ];
  const slots: Slot[] = [];
  let placed = 0;
  for (let ri = 0; ri < rings.length && placed < count; ri++) {
    const { radius, capacity } = rings[ri];
    const take = Math.min(capacity, count - placed);
    for (let i = 0; i < take; i++) {
      const p = polar((i / take) * Math.PI * 2 + ri * 0.7, radius);
      slots.push({
        x: p.x + jitter(placed + i + ri * 31, 7),
        y: round(p.y * 0.82) + jitter(placed + i + ri * 57, 7),
        r: radius,
      });
    }
    placed += take;
  }
  return slots;
}

export function BouquetPreview({
  selection,
  wrapId,
  className,
}: {
  selection: Selection;
  wrapId: string;
  className?: string;
}) {
  const wrap = WRAPS.find((w) => w.id === wrapId) ?? WRAPS[1];

  const stems: Flower[] = [];
  for (const flower of FLOWERS) {
    const qty = selection[flower.id] ?? 0;
    for (let i = 0; i < qty; i++) stems.push(flower);
  }

  const greens = stems.filter((f) => GREEN_KINDS.includes(f.kind));
  const blooms = stems.filter((f) => !GREEN_KINDS.includes(f.kind));

  const slots = buildSlots(stems.length);

  // Yeşillikler dış halkaya, birbirine yapışmasın diye eşit aralıklarla dağıtılır.
  const outerRadius = slots.length > 0 ? slots[slots.length - 1].r : 0;
  const outerStart = slots.findIndex((s) => s.r === outerRadius);
  const outerLength = slots.length - outerStart;
  const greenSlots = new Set<number>();
  for (let i = 0; i < greens.length && greenSlots.size < outerLength; i++) {
    let index = outerStart + Math.round((i * outerLength) / greens.length);
    while (greenSlots.has(index)) index = outerStart + ((index + 1) % outerLength);
    greenSlots.add(index);
  }

  const placed: { flower: Flower; slot: Slot; seed: number }[] = [];
  const greenQueue = [...greens];
  const bloomQueue = [...blooms];
  slots.forEach((slot, i) => {
    const wantsGreen = greenSlots.has(i) && greenQueue.length > 0;
    const flower = wantsGreen
      ? greenQueue.shift()
      : (bloomQueue.shift() ?? greenQueue.shift());
    if (!flower) return;
    const spread = GREEN_KINDS.includes(flower.kind) ? 1.14 : 1;
    placed.push({
      flower,
      slot: { x: round(slot.x * spread), y: round(slot.y * spread), r: slot.r },
      seed: i + 1,
    });
  });
  // Dıştakiler önce çizilir; içtekiler üstlerine binince kubbe hissi oluşur.
  placed.sort((a, b) => b.slot.r - a.slot.r);

  const cx = 180;
  const cy = wrap.style === "kagit" ? 162 : 146;
  const gatherY = wrap.style === "kagit" ? 286 : 248;
  const empty = stems.length === 0;

  return (
    <svg
      viewBox="0 0 360 420"
      className={className}
      role="img"
      aria-label="Hazırladığınız buketin önizlemesi"
    >
      <defs>
        <radialGradient id="bq-glow" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f6f1e9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bq-wrap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={wrap.color} />
          <stop offset="100%" stopColor={wrap.shade} />
        </linearGradient>
        <linearGradient id="bq-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={wrap.shade} stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor={wrap.shade} stopOpacity="0.75" />
        </linearGradient>
      </defs>

      <ellipse cx={cx} cy={cy} rx={168} ry={148} fill="url(#bq-glow)" opacity={0.7} />

      {empty ? (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          fontSize="15"
          fill="#9a9a9a"
          fontFamily="inherit"
        >
          Çiçek seçin, buketiniz burada oluşsun
        </text>
      ) : null}

      {/* Arka ambalaj — yumuşak yelpaze */}
      {wrap.style === "kagit" && !empty ? (
        <>
          <path
            d={`M${cx} ${gatherY + 10} L36 ${cy + 4} Q${cx} ${cy - 128} 324 ${cy + 4} Z`}
            fill={wrap.shade}
            opacity={0.45}
          />
          <path
            d={`M${cx} ${gatherY + 10} L76 ${cy + 10} Q${cx} ${cy - 100} 284 ${cy + 10} Z`}
            fill={wrap.color}
            opacity={0.8}
          />
        </>
      ) : null}

      {/* Saplar */}
      {!empty
        ? placed.map(({ slot }, i) => (
            <path
              key={`s${i}`}
              d={`M${cx + slot.x} ${cy + slot.y} Q${cx + slot.x * 0.4} ${(cy + gatherY) / 2} ${cx + jitter(i, 12)} ${gatherY + 30}`}
              fill="none"
              stroke="#5d8354"
              strokeWidth={2.2}
              strokeLinecap="round"
              opacity={0.9}
            />
          ))
        : null}

      {/* Ön ambalaj konisi — sapların önünde */}
      {!empty && wrap.style === "kagit" ? (
        <>
          <path
            d={`M${cx} ${gatherY + 88} L${cx - 116} ${gatherY - 38} Q${cx} ${gatherY - 4} ${cx + 116} ${gatherY - 38} Z`}
            fill="url(#bq-wrap)"
          />
          <path
            d={`M${cx} ${gatherY + 88} L${cx - 116} ${gatherY - 38} Q${cx} ${gatherY - 4} ${cx} ${gatherY + 88} Z`}
            fill="#000"
            opacity={0.07}
          />
          <path
            d={`M${cx - 58} ${gatherY + 25} L${cx} ${gatherY + 88} L${cx + 58} ${gatherY + 25}`}
            fill="none"
            stroke="#fff"
            strokeOpacity={0.16}
            strokeWidth={1.5}
          />
          {/* Altın kurdele */}
          <path
            d={`M${cx - 40} ${gatherY + 42} q-26 -18 -38 2 q24 14 38 6 Z`}
            fill="#b08d57"
          />
          <path
            d={`M${cx + 40} ${gatherY + 42} q26 -18 38 2 q-24 14 -38 6 Z`}
            fill="#b08d57"
          />
          <rect
            x={cx - 42}
            y={gatherY + 38}
            width={84}
            height={13}
            rx={6}
            fill="#c9a473"
          />
          <rect
            x={cx - 42}
            y={gatherY + 38}
            width={84}
            height={5}
            rx={3}
            fill="#fff"
            opacity={0.3}
          />
        </>
      ) : null}

      {!empty && wrap.style === "vazo" ? (
        <>
          <path
            d={`M${cx - 34} ${gatherY - 20} L${cx - 30} ${gatherY + 30} Q${cx - 54} ${gatherY + 70} ${cx - 46} ${gatherY + 122} Q${cx} ${gatherY + 142} ${cx + 46} ${gatherY + 122} Q${cx + 54} ${gatherY + 70} ${cx + 30} ${gatherY + 30} L${cx + 34} ${gatherY - 20} Z`}
            fill="url(#bq-glass)"
            stroke={wrap.shade}
            strokeWidth={2}
          />
          <path
            d={`M${cx - 40} ${gatherY + 74} Q${cx} ${gatherY + 92} ${cx + 40} ${gatherY + 74} L${cx + 44} ${gatherY + 120} Q${cx} ${gatherY + 140} ${cx - 44} ${gatherY + 120} Z`}
            fill="#bfd9e4"
            opacity={0.7}
          />
          <path
            d={`M${cx - 22} ${gatherY + 34} q-10 40 -6 80`}
            fill="none"
            stroke="#ffffff"
            strokeWidth={4}
            opacity={0.55}
            strokeLinecap="round"
          />
        </>
      ) : null}

      {!empty && wrap.style === "kutu" ? (
        <>
          <rect
            x={cx - 92}
            y={gatherY - 6}
            width={184}
            height={126}
            rx={12}
            fill="url(#bq-wrap)"
          />
          <rect
            x={cx - 92}
            y={gatherY - 6}
            width={184}
            height={26}
            rx={12}
            fill="#fff"
            opacity={0.14}
          />
          <rect x={cx - 12} y={gatherY - 6} width={24} height={126} fill="#fff" opacity={0.16} />
          <rect x={cx - 92} y={gatherY + 44} width={184} height={22} fill="#fff" opacity={0.16} />
        </>
      ) : null}

      {/* Çiçek başları — dıştakiler biraz küçük, derinlik hissi verir */}
      {placed.map(({ flower, slot, seed }, i) => {
        const depth = outerRadius > 0 ? slot.r / outerRadius : 0;
        const scale = round(
          (GREEN_KINDS.includes(flower.kind) ? 30 : 28) - depth * 4,
        );
        return (
          <g
            key={`b${i}`}
            transform={`translate(${cx + slot.x} ${cy + slot.y}) scale(${scale})`}
          >
            <Bloom flower={flower} seed={seed} />
          </g>
        );
      })}
    </svg>
  );
}

/** Seçim panelindeki küçük çiçek ikonu. */
export function FlowerIcon({ flower, className }: { flower: Flower; className?: string }) {
  return (
    <svg viewBox="-1.6 -1.6 3.2 3.2" className={className} aria-hidden>
      <Bloom flower={flower} seed={7} />
    </svg>
  );
}
