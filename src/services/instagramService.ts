export const getInstaUrl = (url: string, isEmbed = false) => {
  const instaUrl = "https://www.instagram.com/p";

  if (url.length === 11) {
    return `${instaUrl}/${url}`;
  }

  if (isEmbed) {
    const code = url.split("/");
    return `${instaUrl}/${code[code.length - 1]}/embed/captioned/`;
  }

  const rex = [
    /(https?:\/\/(?:www\.)?instagram\.com\/(p|tv|reel|reels\/videos)\/([^/?#&]+))/g,
    /(https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9-_\.]+)\/(p|tv|reel)\/([^/?#&]+))/gm,
  ];

  const urlMatch = url.match(rex[0]) || url.match(rex[1]);

  if (!urlMatch) return null;

  const code = urlMatch[0].split("/");

  return `${instaUrl}/${code[code.length - 1]}`;
};
