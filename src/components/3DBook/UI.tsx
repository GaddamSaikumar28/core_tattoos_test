"use client";
import { atom, useAtom } from "jotai";
import { useEffect, useRef, memo } from "react";

export const pageAtom = atom<number>(0);
export const DUMMY_ROUGHNESS = "/textures/roughness.jpg";

export interface TattooProduct {
  id: string;
  title: string;
  handle: string;
  price: number;
  compareAtPrice?: number;
  frontImage: string;
  backImage: string;
  themes: string[];
  placements: string[];
  colorType: string;
  badge?: string;
}

export function buildPagesFromProducts(products: TattooProduct[]) {
  const COVER_FRONT = "/assets/images/coverfrontpage.webp";
  const PAGE_BLANK  = "https://picsum.photos/seed/page-blank/800/1200";
  const COVER_BACK  = "/assets/images/coverbackpage.webp";

  const pages: { front: string; back: string; meta?: TattooProduct }[] = [
    {
      front: COVER_FRONT,
      back:  products[0]?.frontImage ?? PAGE_BLANK,
      meta:  products[0],
    },
  ];

  for (let i = 0; i < products.length - 1; i++) {
    pages.push({
      front: products[i].backImage ?? PAGE_BLANK,
      back:  products[i + 1].frontImage ?? PAGE_BLANK,
      meta:  products[i + 1],
    });
  }

  pages.push({
    front: products[products.length - 1]?.backImage ?? PAGE_BLANK,
    back:  COVER_BACK,
  });

  return pages;
}

export const pages: { front: string; back: string }[] = [
  { front: "/assets/images/coverfrontpage.jpg", back: "https://picsum.photos/seed/jt-p0/800/1200" },
];
for (let i = 1; i < 15; i += 2) {
  pages.push({
    front: `https://picsum.photos/seed/jt-p${i}/800/1200`,
    back:  `https://picsum.photos/seed/jt-p${i + 1}/800/1200`,
  });
}
pages.push({
  front: "https://picsum.photos/seed/jt-p15/800/1200",
  back:  "/assets/images/coverbackpage.jpg",
});

const UI_STYLE_ID = "book-ui-keyframes";

function useUIStyles() {
  useEffect(() => {
    if (document.getElementById(UI_STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = UI_STYLE_ID;
    s.textContent = `
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { scrollbar-width: none; }
    `;
    document.head.appendChild(s);
    return () => { document.getElementById(UI_STYLE_ID)?.remove(); };
  }, []);
}

interface UIProps {
  totalPages?: number;
  productMeta?: (TattooProduct | undefined)[];
}

export const UI = ({ totalPages, productMeta }: UIProps) => {
  const [page, setPage] = useAtom(pageAtom);
  const count           = totalPages ?? pages.length;
  const scrollRef       = useRef<HTMLDivElement>(null);

  useUIStyles();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const active = container.querySelector("[data-active='true']") as HTMLElement;
    if (active) {
      container.scrollTo({
        left: active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [page]);

  // FIX: Shifted index evaluation back by 1 to fix the UI data overlay sync issue
  const currentMeta = page > 0 && page < count ? productMeta?.[page - 1] : undefined;

  return (
    <>
      {/* ── Top label ── */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-start justify-between px-6 pt-6">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2" />
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
          <span className="text-white/60 text-xs font-mono">
            {page === 0 ? "COVER" : page === count ? "BACK" : `${page} / ${count - 1}`}
          </span>
        </div>
      </div>

      {/* ── Product meta overlay ── */}
      {/* {currentMeta && (
        <div
          className="pointer-events-none absolute bottom-28 left-6 z-20 max-w-[220px]"
          style={{ animation: "fadeSlideUp 0.4s ease both" }}
        >
          <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
            {currentMeta.badge && (
              <span className="text-[10px] font-bold tracking-widest text-[#FF7A00] uppercase">
                {currentMeta.badge}
              </span>
            )}
            <p className="text-white font-semibold text-sm leading-tight">{currentMeta.title}</p>
            <div className="flex items-center gap-2">
              <span className="text-[#FF7A00] font-bold text-base">${currentMeta.price}</span>
              {currentMeta.compareAtPrice && (
                <span className="text-white/40 text-xs line-through">${currentMeta.compareAtPrice}</span>
              )}
            </div>
            {currentMeta.themes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {currentMeta.themes.slice(0, 3).map((t) => (
                  <span key={t} className="text-[9px] px-2 py-0.5 rounded-full border border-white/20 text-white/50">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )} */}

      {/* ── Bottom navigation ── */}
      <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-20">
        <div className="h-16 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="bg-black/80 backdrop-blur-xl border-t border-white/10 px-4 py-3">
          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar"
          >
            <NavButton label="Cover" active={page === 0} onClick={() => setPage(0)} accent />

            {Array.from({ length: count - 1 }, (_, i) => i + 1).map((i) => (
              <NavButton
                key={i}
                label={`${i}`}
                active={page === i}
                onClick={() => setPage(i)}
              />
            ))}

            <NavButton label="Back" active={page === count} onClick={() => setPage(count)} accent />
          </div>

          <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FFB347] rounded-full transition-all duration-500"
              style={{ width: `${(page / count) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const NavButton = memo(function NavButton({
  label,
  active,
  onClick,
  accent = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      data-active={active}
      onClick={onClick}
      className={`
        shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide
        border transition-all duration-200
        ${active
          ? "bg-[#FF7A00] border-[#FF7A00] text-black shadow-[0_0_12px_rgba(255,122,0,0.5)]"
          : accent
          ? "bg-white/5 border-white/20 text-white/70 hover:border-[#FF7A00]/50 hover:text-white"
          : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white"
        }
      `}
    >
      {label}
    </button>
  );
});