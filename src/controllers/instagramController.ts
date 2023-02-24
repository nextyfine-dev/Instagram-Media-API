import { load } from "cheerio";
import { NextFunction, Request, Response } from "express";
import http from "../services/http.js";
import { getInstaUrl } from "../services/instagramService.js";
import { sendSuccessRes } from "../services/serverService.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const getInstagramPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url as string;

    const instaUrl = getInstaUrl(url);

    if (!instaUrl)
      return next(new AppError("Enter a valid Instagram post url!", 400));

    const data = await http(instaUrl);

    const $ = load(data);

    const script = $('script[type="application/ld+json"]').html();

    let result;
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
      const videos = [];
      const images = [];
      let author;

      const embedUrl = getInstaUrl(instaUrl, true);

      if (!embedUrl)
        return next(new AppError("Enter a valid Instagram post url!", 400));

      const data = await http(embedUrl);

      const $ = load(data);
      const last = $("script").last().html();
      if (last) {
        const textToMatch = "contextJSON";
        const contextJSON = new RegExp(`(${textToMatch}).*?(\\{.*?\\})`, "s");
        const match = last.match(contextJSON);

        if (!match)
          return next(new AppError("Instagram posts not found!", 404));

        let rawData: any = match.input;

        const regex = /"gql_data\\":{.*}/gm;

        rawData = rawData && rawData.match(regex);

        rawData = rawData && rawData[0].replace(/\\/gm, "");

        rawData = rawData && rawData.match(/\{(.*?)\}"/gm)[0].slice(0, -2);

        const data = JSON.parse(rawData);

        if (!data || !data.shortcode_media)
          return next(new AppError("Instagram posts not found!", 404));

        console.log("data", data);
        if (data.shortcode_media.edge_sidecar_to_children) {
          if (data.shortcode_media.edge_sidecar_to_children.edges.length > 0) {
            for (const i of data.shortcode_media.edge_sidecar_to_children
              .edges) {
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
          if (data.shortcode_media.is_video) {
            videos.push({
              contentUrl: data.shortcode_media.video_url,
              thumbnailUrl: data.shortcode_media.display_url,
              height: data.shortcode_media.dimensions.height,
              width: data.shortcode_media.dimensions.width,
            });
          } else {
            images.push({
              url: data.shortcode_media.display_url,
              height: data.shortcode_media.dimensions.height,
              width: data.shortcode_media.dimensions.width,
            });
          }
        }

        author = {
          image: data.shortcode_media.owner.profile_pic_url,
          alternateName: `@${data.shortcode_media.owner.username}`,
        };
      } else if (
        $(".EmbeddedMediaImage").attr("src") &&
        data.indexOf("shortcode_media") < 1
      ) {
        images.push({ utl: $(".EmbeddedMediaImage").attr("src") });
        author = {
          image: $(".HoverCardProfile").find("img").attr("src"),
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
