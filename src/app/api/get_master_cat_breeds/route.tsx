import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
type ResponseData = {
  message: any;
};

export async function GET(req: NextRequest, _res: NextResponse<ResponseData>) {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": process.env.CAT_API_KEY,
      },
      params: {
        page: 0,
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    // console.error(error);
    return NextResponse.json(
      { success: false, message: error.response.data.message ?? "Send failed" },
      { status: 400 },
    );
  }
  // return NextResponse.json({ message: process.env.CHANNEL_ACCESS_TOKEN });
}
