import axios from "axios";

export default async function sendMessage(messages: any, userId: string) {
  const res = await axios({
    method: "post",
    url: "https://api.line.me/v2/bot/message/push",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
    },
    data: {
      to: userId,
      messages: [messages],
    },
  });
  console.log(res.data);
  return res.data;
}
