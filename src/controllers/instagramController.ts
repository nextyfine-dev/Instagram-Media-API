import { load } from "cheerio";
import { NextFunction, Request, Response } from "express";
import http from "../services/http.js";
import {
  getApiUrl,
  getInstaUrl,
  getShortCodeMedia,
  getUserId,
  getUserNameUrl,
} from "../services/instagramService.js";
import { sendSuccessRes } from "../services/serverService.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { Author, Image, Result, Video } from "../interfaces/index.js";

export const getInstagramPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url as string;

    const instaUrl = getInstaUrl(url);

    if (!instaUrl)
      return next(new AppError("Enter a valid Instagram post url!", 400));

    const data = await http(instaUrl);

    const $ = load(data);

    const script = $('script[type="application/ld+json"]').html();

    let result: Result;
    let hasVideo = false;
    let hasImage = false;

    if (script) {
      const jsonData = JSON.parse(script);

      hasVideo = jsonData.video && jsonData.video.length > 0;
      hasImage = jsonData.image && jsonData.image.length > 0;

      result = {
        author: {
          ...jsonData.author,
          identifier: undefined,
        },
        headline: jsonData.headline,
        hasVideo,
        hasImage,
        videos: jsonData.video,
        images: jsonData.image,
      };
    } else {
      const videos: Video[] = [];
      const images: Image[] = [];
      let author: Author;

      const embedUrl = getInstaUrl(instaUrl, true);

      if (!embedUrl)
        return next(new AppError("Enter a valid Instagram post url!", 400));

      const data = await http(embedUrl);

      const $ = load(data);
      const media = getShortCodeMedia($);

      if (media) {
        if (media.edge_sidecar_to_children) {
          if (media.edge_sidecar_to_children.edges.length > 0) {
            for (const i of media.edge_sidecar_to_children.edges) {
              if (i.node.is_video) {
                videos.push({
                  contentUrl: i.node.video_url,
                  thumbnailUrl: i.node.display_url,
                  height: i.node.dimensions.height,
                  width: i.node.dimensions.width,
                });
              } else {
                images.push({
                  url: i.node.display_url,
                  height: i.node.dimensions.height,
                  width: i.node.dimensions.width,
                });
              }
            }
          }
        } else {
          if (media.is_video) {
            videos.push({
              contentUrl: media.video_url,
              thumbnailUrl: media.display_url,
              height: media.dimensions.height,
              width: media.dimensions.width,
            });
          } else {
            images.push({
              url: media.display_url,
              height: media.dimensions.height,
              width: media.dimensions.width,
            });
          }
        }

        author = {
          image: media.owner.profile_pic_url,
          alternateName: `@${media.owner.username}`,
        };
      } else if (
        $(".EmbeddedMediaImage").attr("src") &&
        data.indexOf("shortcode_media") < 1
      ) {
        const url = $(".EmbeddedMediaImage").attr("src") || "";
        images.push({ url });
        author = {
          image: $(".HoverCardProfile").find("img").attr("src") || "",
          alternateName: `@${$(".HoverCardUserName > .Username").text()}`,
        };
      } else return next(new AppError("Instagram posts not found!", 404));

      hasVideo = videos.length > 0;
      hasImage = images.length > 0;

      result = {
        author,
        hasVideo,
        hasImage,
        videos,
        images,
      };
    }

    sendSuccessRes(res, "Instagram post found!", result);
  }
);

export const getInstaDataByUSerName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userName = req.body.userName as string;

    // const baseUrl = "https://www.instagram.com";
    // const PROFILE_HASH = "69cba40317214236af40e7efa697781d";

    const userUrl = getUserNameUrl(userName);
    // const userUrl = testUrl(userName);

    if (!userUrl) return next(new AppError("Enter a valid username!", 400));

    const html = await http(userUrl);
    // await writeFile("userStory.html", html);

    const $ = load(html);

    const userId = getUserId($);
    // console.log("userId", userId);

    if (!userId) return next(new AppError("User not found!", 400));

    // const url = `https://www.instagram.com/graphql/query/?query_hash=472f257a40c653c64c666ce877d59d2b&variables={"id":"${userId}","first":1}`;
    // const url = `https://www.instagram.com/graphql/query/?query_hash=2c5d4d8b70cad329c4a6ebe3abb6eedd&variables={"id":"${userId}",}`;

    const url = getApiUrl(userId);

    console.log("url", url);

    const data = await http(url);

    console.log("data", data);

    // const { author, media } = getShortCodeMedia($, true);

    // console.log("media", media[0]);

    // await writeFile("username.json", media);
    // const highlightsButton = $('a[href*="/highlights/"]');
    // const highlightsUrl = `https://www.instagram.com${highlightsButton.attr(
    //   "href"
    // )}`;

    // // console.log("highlightsUrl", highlightsUrl);
    // const d = await http(
    //   "https://www.instagram.com/api/v1/users/web_profile_info/?username=nita_shilimkar"
    // );

    // console.log("userUrl", userUrl);

    // dns.lookup("instagram.com", (err) => {
    //   if (err) console.log(err);

    //   got(userUrl).then(async (r) => {
    //     // const userId = r.body.split(',"id":"')[1].split('",')[0];
    //     // console.log('r', userId)
    //     await writeFile("username.html", r.body);
    //   });
    // });

    sendSuccessRes(res, "success");
  }
);

// export const getInstaHighLights = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const url = req.body.url as string;
//     const data = await http(url);
//     await writeFile("highlight.html", data);

//     sendSuccessRes(res, "done", data);
//   }
// );
