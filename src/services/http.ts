import axios from "axios";

const http = async (url: string, method = "GET") => {
  const useragent = [
    "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0",
    "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
  ];

  const random = Math.floor(Math.random() * useragent.length);
  const { data } = await axios(url, {
    method,
    headers: {
      useragent: useragent[random],
      timeout: 1e3,
      maxRedirects: 10,
      // origin: "https://www.instagram.com",
    },
  });
  return data;
};

export default http;
