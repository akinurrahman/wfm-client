import { WALKTHROUGH_VIDEO_ID } from '../definitions/landing.constants';

/** nocookie host, and no autoplay: a video that starts talking on load is the
 *  fastest way off the page. */
export function WalkthroughVideo() {
  return (
    <figure className="m-panel m-panel-shine overflow-hidden shadow-lift">
      {/* Ratio on a phone, a viewport slice from desk up, so the whole page
          still lands inside one screen on a short laptop. */}
      <div className="aspect-video w-full bg-surface-3 desk:aspect-auto desk:h-[clamp(11rem,30svh,22rem)] 2xl:h-[clamp(14rem,32svh,26rem)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${WALKTHROUGH_VIDEO_ID}?rel=0`}
          title="Product walkthrough"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full border-0"
        />
      </div>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 border-t border-hairline px-5 py-3.5">
        <span className="font-mono text-[10px] tracking-[0.2em] text-text-mid uppercase">
          Walkthrough
        </span>
        <span className="text-[12px] text-text-low">
          A short tour of scheduling, attendance and approvals.
        </span>
      </figcaption>
    </figure>
  );
}
