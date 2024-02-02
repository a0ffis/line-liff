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
          type: "text",
          text: message,
        },
      ],
    },
  });
  console.log(res.data);
  return res.data;
}
