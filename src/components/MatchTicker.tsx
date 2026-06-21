// A continuously scrolling promo "ribbon" (game-day match ticker).
// Pure CSS marquee — see `.marquee` / `@keyframes olivella-marquee` in
// globals.css — so it stays a server component with no client JS.
import { SoccerBall } from "./icons";

const TICKER_ITEMS = [
  "Game-day delivery",
  "Charcuterie for the big matches",
  "Kickoff June 11",
  "Watch-party charcuterie boards",
  "Set up before kickoff",
  "Reserve your spread",
];

// One full set of items. The track renders this twice (the second copy hidden
// from screen readers) and scrolls by -50% so the loop is seamless.
function TickerGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={duplicate || undefined}
    >
      {TICKER_ITEMS.map((item, i) => (
        <li key={i} className="flex items-center">
          <span className="px-6 py-3 text-sm font-extrabold uppercase tracking-[0.2em] sm:text-base">
            {item}
          </span>
          <SoccerBall aria-hidden className="h-4 w-4 text-olive-deep/70" />
        </li>
      ))}
    </ul>
  );
}

export default function MatchTicker({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="marquee bg-gradient-to-r from-marigold via-marigold-bright to-marigold text-olive-deep ring-1 ring-marigold-bright/40">
      <div
        className={`marquee-track${reverse ? " marquee-track--reverse" : ""}`}
      >
        <TickerGroup />
        <TickerGroup duplicate />
      </div>
    </div>
  );
}
