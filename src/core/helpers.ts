export const getFaviconUrl = (url: string) => {
  try {
    const clean = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
    if (!clean) return null;
    return `https://www.google.com/s2/favicons?domain=${clean}&sz=128`;
  } catch {
    return null;
  }
};
