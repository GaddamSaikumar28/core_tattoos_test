
import { FormattedProduct, Variant } from "@/src/lib/shopify";
 
// Props accepted by the main TattooProductDetail component.
export interface TattooProductDetailProps {
  product: FormattedProduct;
}
 
// Discriminated union that tracks which media panel is active.
//   "3d"       → model-viewer is rendered
//   "skintone" → a skin-tone swatch image is shown
//   "gallery"  → a standard gallery image is shown (tracked by index)
export type ViewState =
  | { type: "3d"; source: any }
  | { type: "skintone"; source: any }
  | { type: "gallery"; source: any; index: number };