import { createFileRoute } from "@tanstack/react-router";
import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { LoyCanvas, type LoyHandle, type SceneStats } from "@/components/loy-canvas";
import { FLOWERS, type FlowerId } from "@/lib/festival/scene";

export const Route = createFileRoute("/")({ component: Home });

const WISH_KEY = "loy-krathong-wishes";

type SavedWish = { text: string; flower: FlowerId; at: number };

function readWishes(): SavedWish[] {
  try {
    const raw = localStorage.getItem(WISH_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedWish[];
    return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
  } catch {
    return [];
  }
}

function Home() {
  const stage = useRef<LoyHandle>(null);
  const [wish, setWish] = useState("");
  const [flower, setFlower] = useState<FlowerId>("marigold");
  const [open, setOpen] = useState(true);
  const [audible, setAudible] = useState(false);
  const [journalOn, setJournalOn] = useState(false);
  const [saved, setSaved] = useState<SavedWish[]>([]);
  const [toast, setToast] = useState("");
  const [announce, setAnnounce] = useState("");
  const [counts, setCounts] = useState({ mine: 0, lantern: 0, boom: 0, afloat: 0 });
  const toastTimer = useRef(0);

  function remember(text: string, next: FlowerId, wrote: boolean) {
    setOpen(false);
    setWish("");
    setAnnounce(`ปล่อยกระทงแล้ว ${text}`);
    window.clearTimeout(toastTimer.current);
    setToast(text);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
    if (!wrote) return;
    setSaved((prev) => {
      const nextSaved = [{ text, flower: next, at: Date.now() }, ...prev].slice(0, 30);
      localStorage.setItem(WISH_KEY, JSON.stringify(nextSaved));
      return nextSaved;
    });
  }

  function begin(withSound: boolean) {
    setAudible(withSound);
    setOpen(false);
    setSaved(readWishes());
    stage.current?.setAudible(withSound);
  }

  function toggleSound() {
    const next = !audible;
    setAudible(next);
    stage.current?.setAudible(next);
  }

  function onStats(stats: SceneStats) {
    setCounts((current) =>
      current.afloat === stats.afloat &&
      current.boom === stats.booms &&
      current.lantern === stats.lanterns &&
      current.mine === stats.released
        ? current
        : {
            afloat: stats.afloat,
            boom: stats.booms,
            lantern: stats.lanterns,
            mine: stats.released,
          },
    );
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-night text-mist">
      <LoyCanvas
        ref={stage}
        flower={flower}
        wish={wish}
        audible={audible}
        onRelease={remember}
        onStats={onStats}
      />

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-6">
        <div className="min-w-0">
          <p className="font-display text-3xl leading-none text-gold">ลอยกระทง</p>
          <p className="mt-1 text-sm text-muted">คืนเพ็ญ · เดือนสิบสอง</p>
          <p className="mt-2 text-sm leading-snug text-mist">
            สายน้ำ {counts.afloat}
            <span className="text-muted"> · </span>
            โคม {counts.lantern}
            <span className="text-muted"> · </span>
            พลุ {counts.boom}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={audible}
          aria-label={audible ? "ปิดเสียง" : "เปิดเสียงสายน้ำ"}
          className="pointer-events-auto grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-veil/80 text-gold transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          <span className="relative h-6 w-6">
            <Volume2
              className={
                "absolute inset-0 h-6 w-6 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] " +
                (audible ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]")
              }
              aria-hidden="true"
            />
            <VolumeX
              className={
                "absolute inset-0 h-6 w-6 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] " +
                (audible ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none")
              }
              aria-hidden="true"
            />
          </span>
        </button>
      </header>

      {toast ? (
        <p className="pointer-events-none absolute top-24 left-1/2 z-20 max-w-[80vw] -translate-x-1/2 truncate rounded-full border border-gold/35 bg-veil/85 px-4 py-2 text-sm text-mist">
          {toast}
        </p>
      ) : null}

      {open ? (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5 pt-16">
          <article className="pointer-events-auto w-full max-w-md rounded-2xl border border-gold/35 bg-veil/80 px-5 py-6 text-center backdrop-blur-md sm:px-6 sm:py-7">
            <p className="rise text-sm text-gold">เทศกาลสายน้ำ</p>
            <h1 className="rise rise-2 mt-2 font-display text-3xl leading-tight text-gold sm:text-5xl">
              <span className="block">สุขสันต์วัน</span>
              <span className="block">ลอยกระทง</span>
            </h1>
            <p className="rise rise-3 mx-auto mt-3 max-w-xs text-base leading-relaxed text-mist">
              เขียนคำอธิษฐาน ปล่อยกระทงลงสายน้ำ ลอยโคมขึ้นฟ้า แล้วแตะท้องฟ้าเพื่อจุดพลุ
            </p>
            <div className="rise rise-3 mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => begin(true)}
                className="h-12 flex-1 rounded-xl bg-gold px-4 text-base font-semibold text-night transition-transform duration-150 ease-out active:scale-[0.96]"
              >
                เริ่มพร้อมเสียง
              </button>
              <button
                type="button"
                onClick={() => begin(false)}
                className="h-12 flex-1 rounded-xl border border-gold/40 px-4 text-base text-mist transition-transform duration-150 ease-out active:scale-[0.96]"
              >
                เข้าเงียบๆ
              </button>
            </div>
          </article>
        </div>
      ) : null}

      <footer className={"absolute inset-x-0 bottom-0 z-20 p-3 sm:p-5 " + (open ? "hidden" : "")}>
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gold/30 bg-veil/80 p-3 backdrop-blur-md sm:p-4">
          <div className="mb-3 flex gap-2">
            {FLOWERS.map((item) => {
              const selected = flower === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFlower(item.id)}
                  className={
                    "flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border text-sm whitespace-nowrap transition-transform duration-150 ease-out active:scale-[0.96] " +
                    (selected ? "border-gold bg-gold/15 text-gold" : "border-muted/30 text-mist")
                  }
                >
                  <span
                    className={
                      "h-3 w-3 shrink-0 rounded-full " +
                      (item.id === "lotus" ? "bg-lotus" : item.id === "jasmine" ? "bg-mist" : "bg-gold")
                    }
                    aria-hidden="true"
                  />
                  {item.label}
                </button>
              );
            })}
          </div>

          <form
            className="grid grid-cols-2 gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              stage.current?.release(wish, flower);
              setOpen(false);
            }}
          >
            <label className="sr-only" htmlFor="wish">
              คำอธิษฐาน
            </label>
            <input
              id="wish"
              value={wish}
              maxLength={36}
              onChange={(event) => setWish(event.target.value)}
              placeholder="เขียนคำอธิษฐาน แล้วปล่อยลงน้ำ"
              className="col-span-2 h-12 rounded-xl border border-gold/25 bg-night/75 px-4 text-base text-mist outline-none placeholder:text-muted focus-visible:border-gold"
            />
            <button
              type="submit"
              className="h-12 rounded-xl bg-gold text-base font-semibold text-night transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              ปล่อยกระทง
            </button>
            <button
              type="button"
              onClick={() => {
                stage.current?.lantern();
                setOpen(false);
              }}
              className="h-12 rounded-xl border border-gold/40 text-base text-gold transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              ลอยโคม
            </button>
          </form>

          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="min-w-0 text-sm leading-snug text-muted">แตะฟ้าจุดพลุ · แตะน้ำปล่อยกระทง</p>
            <button
              type="button"
              onClick={() => {
                setSaved(readWishes());
                setJournalOn((value) => !value);
              }}
              aria-expanded={journalOn}
              className="h-11 shrink-0 rounded-full px-2 text-sm text-gold"
            >
              คำอธิษฐาน{saved.length > 0 ? ` ${saved.length}` : ""}
            </button>
          </div>

          <div
            className={
              "overflow-hidden transition-[max-height] duration-200 ease-out " +
              (journalOn ? "max-h-40" : "max-h-0")
            }
          >
            <ul className="max-h-36 space-y-2 overflow-y-auto pt-3">
              {saved.length === 0 ? (
                <li className="text-sm text-muted">ยังไม่มีคำที่เขียนไว้ — พิมพ์แล้วปล่อยกระทง</li>
              ) : (
                saved.map((item) => (
                  <li
                    key={item.at}
                    className="flex items-center justify-between gap-3 rounded-xl bg-night/55 px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 truncate text-mist">{item.text}</span>
                    <span className="shrink-0 text-muted">
                      {FLOWERS.find((entry) => entry.id === item.flower)?.label}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
