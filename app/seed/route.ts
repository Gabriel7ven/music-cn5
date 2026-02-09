import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users, participants, appointments, teams } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;
//
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (email) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedParticipants() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS participants (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      birth_date VARCHAR(20) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      team_id UUID NOT NULL
    );
  `;

  const insertedParticipants = await Promise.all(
    participants.map(
      (participant) => sql`
        INSERT INTO participants (name, email, birth_date, image_url, team_id)
        VALUES (${participant.name}, ${participant.email}, ${participant.birth_date}, ${participant.image_url}, ${participant.team_id});
      `,
    ),
  );
  return insertedParticipants;
}

async function seedAppointments() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      team_id UUID NOT NULL,
      date VARCHAR(20) NOT NULL,
      details TEXT NOT NULL,
      status VARCHAR(20) NOT NULL
    );
  `;

  const insertedAppointments = await Promise.all(
    appointments.map(
      (appointment) => sql`
        INSERT INTO appointments (team_id, date, details, status)
        VALUES (${appointment.team_id}, ${appointment.date}, ${appointment.details}, ${appointment.status})
        ON CONFLICT DO NOTHING;
      `,
    ),
  );

  return insertedAppointments;
}

async function seedTeams() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS teams (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    );
  `;
  const insertedTeams = await Promise.all(
    teams.map(
      (team) => sql`
        INSERT INTO teams (id, name)
        VALUES (${team.id}, ${team.name})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedTeams;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedParticipants(),
      seedAppointments(),
      seedTeams(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
