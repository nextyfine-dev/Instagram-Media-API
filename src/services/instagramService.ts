import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { CheerioAPI } from "cheerio";
import config from "../config/index.js";

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
    /(https?:\/\/(?:www\.)?instagram\.com\/(p|tv|reel|reels|reels\/videos)\/([^/?#&]+))/g,
    /(https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9-_\.]+)\/(p|tv|reel)\/([^/?#&]+))/gm,
  ];

  const urlMatch = url.match(rex[0]) || url.match(rex[1]);

  if (!urlMatch) return null;

  const code = urlMatch[0].split("/");

  return `${instaUrl}/${code[code.length - 1]}`;
};

export const getUserNameUrl = (userName: string) => {
  const instaUrl = "https://instagram.com";

  if (userName.length >= 2 && userName.length <= 30)
    return `${instaUrl}/${userName}/embed`;

  const rex =
    /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_\.]{2,30}(?:)?/gi;
  const match = userName.match(rex);

  if (!match) return null;

  return `${match[0]}/embed`;
};

export const getShortCodeMedia = ($: CheerioAPI, isProfile = false) => {
  const last = $("script").last().html();
  if (!last) return null;
  let match: any = last.match(/"contextJSON":"{.*}"/gm);
  match = match && match[0].replace(/\\/gm, "");
  match = match && match.match(/\{(.*?)\}"/gm)[0].slice(0, -1);

  if (!match) return null;

  const data = JSON.parse(match);

  if (!data) return null;

  if (isProfile)
    return {
      author: { ...data.context, graphql_media: undefined },
      media: data.context.graphql_media,
    };

  return data.gql_data.shortcode_media;
};

export const getUserId = ($: CheerioAPI) =>
  $("div.Embed").attr("data-owner-id");

export const getQueryUrl = (userId: string) => {};

export const getApiUrl = (userId: string) => {
  const api = "https://graph.instagram.com";
  const accessToken = `${config.APP_ID}|${config.APP_SECRET}`;
  return `${api}/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${accessToken}`;
};

export const decodeQueryHash = (queryHash: string) => {
  const buffer = Buffer.from(queryHash, "base64");
  const hmac = buffer.slice(0, 32);
  const data = buffer.slice(32);

  const calculatedHmac = crypto.createHmac("sha256", "Instagram Graph Sidecar");
  calculatedHmac.update(data);

  console.log("data", data.toString());

  const isValid = hmac.equals(calculatedHmac.digest());
  if (!isValid) {
    throw new Error("Invalid query hash");
  }
  return data.toString();
};

export const testUrl = (userName: string) =>
  `https://www.instagram.com/stories/${userName}/embed/`;
