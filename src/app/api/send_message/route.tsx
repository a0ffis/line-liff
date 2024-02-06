import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import sendMessage from "../_lib/sendMessage";
import sendMessageFlex from "../_lib/sendMessageFlex";
type ResponseData = {
  message: any;
};

export async function POST(req: NextRequest, _res: NextResponse<ResponseData>) {
  try {
    const { userId, message } = await req.json();
    const result = await sendMessageFlex(message, userId);
    console.log("result", result);
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
  // return NextResponse.json({ message: process.env.CHANNEL_ACCESS_TOKEN });
}
