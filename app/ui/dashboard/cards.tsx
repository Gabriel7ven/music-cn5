import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchTeams, fetchTeamParticipants } from '@/app/lib/data';
import clsx from 'clsx';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfTeams,
    numberOfParticipants,
  } = await fetchCardData();

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card title="Equipes" value={numberOfTeams} />
      <Card title="Participantes" value={numberOfParticipants} />
    </>
  );
}


export async function TeamCardWrapper() {
  const teams = await fetchTeams();
  return (
    <div className="flex gap-10">
      {teams.map((team) => {
        return <TeamCard title="teste" key={team.id} team_id={team.id}/>
      })}
      
      {/* <TeamCard title="teste"  /> */}
    </div>
  )
}

export async function TeamCard({
  title,
  team_id,
}: {
  title: string;
  team_id: string;
}) {

  const participants = await fetchTeamParticipants(team_id);
  if(!Boolean(participants[0])) return
  return (
    <div className="rounded-xl bg-gray-100 p-2">
      <div className="rounded-xl bg-white p-4">
        {participants.map((participant) => (
          <p key={participant.id} className={clsx(
            "bg-white",
            {"bg-blue-500" : participant.id === team_id}
          )}>{participant.name}</p>
        ))}
      </div>
    </div>
  )
}
export function Card({
  title,
  value,
  // type,
}: {
  title: string;
  value: number | string;
  // type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  // const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {/* {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null} */}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
