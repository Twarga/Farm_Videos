"use client";

import type { Ref } from "react";

export function MobileMenu({ open, onToggle, buttonRef }: { open: boolean; onToggle: () => void; buttonRef: Ref<HTMLButtonElement> }) { return <button className="pill pill--icon menu-btn" id="menuBtn" ref={buttonRef} type="button" aria-label="Menu" aria-expanded={open} aria-controls="nav" onClick={onToggle}><svg className="ico" aria-hidden="true"><use href="#i-menu" /></svg></button>; }
