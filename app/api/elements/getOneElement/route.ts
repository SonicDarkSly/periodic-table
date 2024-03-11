// export async function GET(Request) {}
// export async function HEAD(Request) {}
// export async function POST(Request) {}
// export async function PUT(Request) {}
// export async function DELETE(Request) {}

import { NextRequest, NextResponse } from "next/server";
import data from "../../../parameters/elements-list.json";

export async function GET(req: NextRequest) {
  const atomicNumberParam = req.nextUrl.searchParams.get("number");

  if (atomicNumberParam) {
    const atomicNumber = parseInt(atomicNumberParam, 10);

    const element = data.list.find(
      (elmt) => elmt.atomicNumber === atomicNumber,
    );

    if (!element) {
      return NextResponse.json(
        { message: "Element non répertorié" },
        { status: 404 },
      );
    }

    return NextResponse.json(element, { status: 200 });
  } else {
    return NextResponse.json({ message: "Erreur 500" }, { status: 500 });
  }
}

export async function HEAD(req: NextRequest) {
  return NextResponse.json({ message: "OK" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "OK" }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ message: "OK" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: "OK" }, { status: 200 });
}
