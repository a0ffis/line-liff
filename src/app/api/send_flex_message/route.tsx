import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import sendMessage from "../_lib/sendMessage";
import sendMessageFlex from "../_lib/sendMessageFlex";
type ResponseData = {
  message: any;
};
function convertMessageToFlex(data: any) {
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "image",
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover",
      url: data.url,
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: data.breeds[0].name,
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
              text: `$${data.breeds[0].price}`,
              wrap: true,
              weight: "bold",
              size: "xl",
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
            uri: "https://localhost:443",
          },
        },
      ],
    },
  };
  return flexMessage;
}

export async function POST(req: NextRequest, _res: NextResponse<ResponseData>) {
  try {
    const { userId, message, contents } = await req.json();
    const converted = [] as any[];

    contents.map((item: any) => {
      converted.push(convertMessageToFlex(item));
    });

    const messages = {
      type: "flex",
      altText: message,
      contents: {
        type: "carousel",
        contents: converted,
      },
    };
    const result = await sendMessageFlex(messages, userId);
    console.log("result", messages);

    return NextResponse.json({
      success: true,
      message: "Sended!",
      data: result,
    });
  } catch (error: any) {
    console.error(error.response.data);
    return NextResponse.json(
      { success: false, message: error.response.data.message ?? "Send failed" },
      { status: 400 },
    );
  }
}
