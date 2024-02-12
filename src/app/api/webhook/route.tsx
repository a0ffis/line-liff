import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import sendMessage from "../_lib/sendMessage";

type ResponseData = {
  message: any;
};

export async function POST(req: NextRequest, _res: NextResponse<ResponseData>) {
  try {
    const { destination, events } = await req.json();
    console.log(destination);
    var message = events[0].message.text;
    const userId = events[0].source.userId;
    console.log("message", message, userId, events);

    if (message == "นว") {
      message = "สวัสดีคนสวย";
    }

    if (message == "hi") {
      message = "https://liff.line.me/2003144401-PLEBegWd";
    }

    const result = await sendMessage(message, userId);
    console.log(result.data);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
  // return NextResponse.json({ message: process.env.CHANNEL_ACCESS_TOKEN });
}
