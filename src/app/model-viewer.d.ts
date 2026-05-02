// global.d.ts
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src: string;
        "ios-src"?: string;
        alt?: string;
        ar?: boolean | string;
        "ar-modes"?: string;
        "camera-controls"?: boolean | string;
        "auto-rotate"?: boolean | string;
        "rotation-per-second"?: string;
        "interaction-prompt"?: string;
      };
    }
  }
}