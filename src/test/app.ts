import { load } from "cheerio";
import { NodeVM } from "vm2";
import axios from "axios";
// import fs from "node:fs/promises";

const getData = async () => {
  const url = "https://www.instagram.com/p/Cs8O8oSPWR0/";

  const { data } = await axios.get(url);

  const $ = load(data);

  // await fs.writeFile("./app.html", data);

  const script = $('script[type="application/ld+json"]').html() || ""; // get the 4th script tag that contains the video URL

  // const jsonSc = JSON.parse(script);
  // console.log("jsonSc", jsonSc);

  const sandbox: any = { window: {} };

  const vm = new NodeVM({
    sandbox,
  });

  const r = vm.run(script);

  console.log("r", r);

  // const videoUrl =
  //   sandbox.window.__additionalDataLoaded("0").graphql.shortcode_media
  //     .video_url;

  // const filename = videoUrl.substring(videoUrl.lastIndexOf("/") + 1);

  // console.log("videoUrl", videoUrl);
  // console.log("filename", filename);
};

getData();
