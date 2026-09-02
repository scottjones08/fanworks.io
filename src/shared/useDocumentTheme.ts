import { useLayoutEffect } from "react";

/** Paints the document background so overscroll matches the concept, and sets the browser theme color. */
export function useDocumentTheme(background: string, themeColor = background) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const previous = html.style.background;
    html.style.background = background;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const previousColor = meta.content;
    meta.content = themeColor;
    return () => {
      html.style.background = previous;
      if (meta) meta.content = previousColor;
    };
  }, [background, themeColor]);
}
