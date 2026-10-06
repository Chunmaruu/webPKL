/**
 * Snippet yang memaksa halaman kembali ke paling atas saat di-refresh.
 * Browser modern secara default mengingat posisi scroll (scrollRestoration = "auto"),
 * jadi kita set ke "manual" lalu scroll ke (0, 0).
 */
export const SCROLL_RESET_SCRIPT = `<script>(function(){try{if('scrollRestoration' in history){history.scrollRestoration='manual';}if(location.hash){history.replaceState(null,'',location.pathname+location.search);}window.scrollTo(0,0);window.addEventListener('load',function(){window.scrollTo(0,0);});window.addEventListener('pageshow',function(){window.scrollTo(0,0);});}catch(e){}})();</script>`;

/**
 * Menyisipkan SCROLL_RESET_SCRIPT ke dalam <head> dokumen HTML
 * (atau di awal dokumen jika tidak ada <head>).
 */
export function injectScrollReset(html: string): string {
  if (html.includes("history.scrollRestoration='manual'")) return html;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (m) => `${m}\n  ${SCROLL_RESET_SCRIPT}`);
  }
  return SCROLL_RESET_SCRIPT + html;
}
