import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const ip =
      forwardedFor.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "unknown";

    const report = {
      ...data,
      userId: ip,
      userAgent,
      receivedAt: new Date().toISOString(),
    };

    console.log("Valentine answer report:", report);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in /api/report:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

