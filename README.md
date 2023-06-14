# Instagram Media API

The Instagram Media API provides easy access to Instagram posts (videos/images). Retrieve post URLs and details. Perfect for an Instagram downloader server. Simplify post scraping and media extraction with this powerful API.

## Features

- Retrieve Instagram post URLs
- Fetch post details
- Download images and videos from Instagram
- Simplified media extraction process
- Easy-to-use API endpoints

## Installation

To get started with the Instagram Media API, follow these steps:

1. Download the repository:
   - HTTPS: [https://github.com/nextyfine-dev/Instagram-Media-API.git](https://github.com/nextyfine-dev/Instagram-Media-API.git)
   - SSH: `git@github.com:nextyfine-dev/Instagram-Media-API.git`
   - GitHub CLI: `gh repo clone nextyfine-dev/Instagram-Media-API`
   - Download the zip.

2. Navigate to the Instagram-Media-API folder:
   ```
   cd Instagram-Media-API
   ```

3. Install the required Node modules:
   ```
   yarn install
   ```
   or
   ```
   npm install
   ```

4. Run the server:
   ```
   yarn run dev
   ```
   or
   ```
   npm run dev
   ```
   The default server runs on `http://127.0.0.1:8080/`.

## Usage

API Endpoint: `http://127.0.0.1:8080/api/v1/posts` (POST request)

- Request JSON Body:
  ```json
  {
    "url": "https://www.instagram.com/p/Cd75BuCv0-X/"
  }
  ```

- Expected Response:
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Instagram post found!",
    "data": {
      "author": {
        "@type": "Person",
        "image": "https://scontent.cdninstagram.com/v/t51.2885-19/284537464_749720126207805_227865564929001282_n.jpg?stp=dst-jpg_s100x100&_nc_cat=106&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=xYV6H9adgHoAX-OsfYY&_nc_ht=scontent.cdninstagram.com&oh=00_AfCHTWq3I_pwNgvDKeudPgf8_sQ55BPj6i67f1nucWcSrA&oe=64B0D991",
        "name": "NEXTYFINE",
        "alternateName": "@nextyfine",
        "url": "https://www.instagram.com/nextyfine"
      },
      "headline": "A.R & V.R \nNextyfine\n.\n.\n. #nextyfine\n.\n.\n.\n#tech #technology #technologies #new #vr #ar #facebook #instadaily #it #informationtechnology #instagood #instalike #avatar #dream #info #future #art #instapic #f4f #anime #wow #l4l #img  #next #followｍe #share #all",
      "hasVideo": false,
      "hasImage": true,
      "videos": [],
      "images": [
        {
          "@type": "https://schema.org/ImageObject",
          "caption": "A.R & V.R \nNextyfine\n.\n.\n. #nextyfine\n.\n.\n.\n#tech

 #technology #technologies #new #vr #ar #facebook #instadaily #it #informationtechnology #instagood #instalike #avatar #dream #info #future #art #instapic #f4f #anime #wow #l4l #img  #next #followｍe #share #all",
          "representativeOfPage": "True",
          "height": "740",
          "width": "720",
          "url": "https://scontent.cdninstagram.com/v/t51.29350-15/283213452_152473727321449_1580425100400943911_n.webp?stp=dst-jpg_s640x640&_nc_cat=105&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=DGWSo2ufdH4AX_z8i_r&_nc_ht=scontent.cdninstagram.com&oh=00_AfBIHpyV2N_dmcjxbHUd_Yz6pkEJKQM4WYe2D2lVhwc8LA&oe=648E6D3D"
        }
      ]
    }
  }
  ```

Example JS Code (with `fetch`):
```javascript
let headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  "Content-Type": "application/json"
};

let bodyContent = JSON.stringify({
  "url": "https://www.instagram.com/p/Cd75BuCv0-X/"
});

let response = await fetch("http://127.0.0.1:8080/api/v1/posts", { 
  method: "POST",
  body: bodyContent,
  headers: headersList
});

let data = await response.text();
console.log(data);
```

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. 
