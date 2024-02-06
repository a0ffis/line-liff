import axios from "axios";

export default async function sendMessage(message: string, userId: string) {
  const res = await axios({
    method: "post",
    url: "https://api.line.me/v2/bot/message/push",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
    },
    data: {
      to: userId,
      messages: [
        {
          type: "flex",
          altText: "This is a Flex Message",
          contents: {
            type: "bubble",
            hero: {
              type: "image",
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover",
              url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_5_carousel.png",
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "Arm Chair, White",
                  wrap: true,
                  weight: "bold",
                  size: "xl",
                },
                {
                  type: "box",
                  layout: "baseline",
                  contents: [
                    {
                      type: "text",
                      text: "$49",
                      wrap: true,
                      weight: "bold",
                      size: "xl",
                      flex: 0,
                    },
                    {
                      type: "text",
                      text: ".99",
                      wrap: true,
                      weight: "bold",
                      size: "sm",
                      flex: 0,
                    },
                  ],
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "uri",
                    label: "Add to Cart",
                    uri: "https://linecorp.com",
                  },
                },
                {
                  type: "button",
                  action: {
                    type: "uri",
                    label: "Add to wishlist",
                    uri: "https://linecorp.com",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  });
  console.log(res.data);
  return res.data;
}
