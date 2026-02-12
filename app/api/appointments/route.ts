import { NextResponse } from "next/server";
import { fetchMonthAppointmens, createAppointment } from "@/app/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  const appointments = await fetchMonthAppointmens(year, month);

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, details, date } = body as { name?: string; details?: string; date?: string };

    if (!name || !date) {
      return NextResponse.json({ error: 'Missing name or date' }, { status: 400 });
    }

    const created = await createAppointment({ name, details: details ?? '', date });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}