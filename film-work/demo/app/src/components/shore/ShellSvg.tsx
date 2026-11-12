const SHELL_D = "M34 6c11.6 0 19.6 8.4 19.6 19.8 0 11.6-8.6 19.6-20.2 19.6-8.2 0-14.2-4.6-16-11.6 4 1.9 9.8.9 11.6-4.2 1.9-5.3-1.3-9.9-6.2-10.8C24.6 11.4 28.6 6 34 6z";

/** Trusted static SVG — only the shell shape and logo image path are interpolated; no provider text enters innerHTML. */
export function ShellSvg({ offer }: { offer: { logoSrc: string | null } | null }) {
  const src = offer?.logoSrc ?? null;
  return <svg className="sh" viewBox="0 0 60 52" aria-hidden="true" focusable="false"><ellipse className="sh-shadow" cx="33" cy="48.5" rx="20" ry="2.4"/><path className="sh-fill" d={SHELL_D}/><path className="sh-hatch" d={SHELL_D}/><path className="sh-seam" d={SHELL_D}/>{src ? <g transform="rotate(-6 36 25)"><rect className="sh-plate-shadow" x="25.2" y="14.8" width="23" height="23" rx="5.5"/><rect className="sh-plate" x="24" y="13.6" width="23" height="23" rx="5.5"/><image href={src} x="26.5" y="16.1" width="18" height="18" preserveAspectRatio="xMidYMid meet"/></g> : <path className="sh-spiral" d="M37 26.2a2.6 2.6 0 1 1-2.6-2.6 5.4 5.4 0 1 1 5.4 5.4 8.6 8.6 0 1 1-8.6-8.6"/>}</svg>;
}
