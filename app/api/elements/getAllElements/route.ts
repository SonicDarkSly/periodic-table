// export async function GET(Request) {}
// export async function HEAD(Request) {}
// export async function POST(Request) {}
// export async function PUT(Request) {}
// export async function DELETE(Request) {}
import { NextRequest, NextResponse } from "next/server";

import data from "../../../parameters/elements-list.json";

export async function GET(req: NextRequest) {
  return NextResponse.json(data, {
    status: 200,
  });
}
