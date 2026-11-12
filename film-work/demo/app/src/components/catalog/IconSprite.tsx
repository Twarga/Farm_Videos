import type { SVGProps } from "react";
import { CATALOG_ICON_ASSET } from "@/lib/catalog-icon-asset";

type Props = SVGProps<SVGSVGElement> & {
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  size?: number | string;
  mirrored?: boolean;
};
function icon(name: string) {
  return function SpriteIcon({ weight = "regular", size = "1em", mirrored = false, color = "currentColor", ...props }: Props) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} viewBox="0 0 256 256" {...props}>
      <use href={`${CATALOG_ICON_ASSET}#${name}-${weight}`} transform={mirrored ? "translate(256 0) scale(-1 1)" : undefined} />
    </svg>;
  };
}
export const Funnel = icon("Funnel");
export const HandCoins = icon("HandCoins");
export const Rows = icon("Rows");
export const SquaresFour = icon("SquaresFour");
export const X = icon("X");
export const List = icon("List");
export const Moon = icon("Moon");
export const Scales = icon("Scales");
export const Sun = icon("Sun");
export const ArrowUpRight = icon("ArrowUpRight");
export const Star = icon("Star");
