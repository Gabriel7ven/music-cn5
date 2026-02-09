import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function listParticipants() {
	const data = await sql`
    SELECT *
    FROM participants;
  `;

	return data;
}

export async function GET() {
  try {
  	return Response.json(await listParticipants());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
