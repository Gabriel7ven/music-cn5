import { NextResponse } from "next/server";
import { fetchMonthAppointmens } from "@/app/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  const appointments = await fetchMonthAppointmens(year, month);

  return NextResponse.json(appointments);
}