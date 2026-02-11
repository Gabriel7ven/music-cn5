import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchTeams, fetchTeamParticipants } from '@/app/lib/data';
import clsx from 'clsx';
import { Team } from '@/app/lib/definitions';
import Image from 'next/image';

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
    <div className="flex flex-wrap justify-center sm:justify-start  gap-5">
      {teams.map((team) => {
        console.log(typeof team)
        return <TeamCard title="teste" key={team.id} id={team.id} name={team.name}/>
      })}
      
      {/* <TeamCard title="teste"  /> */}
    </div>
  )
}

export async function TeamCard({
  title,
  id,
  name,
}: {
  title: string;
  id: string;
  name: string;
}) {

  const participants = await fetchTeamParticipants(id);
  if(!Boolean(participants[0])) return
  return (
    <div className="rounded-xl w-full sm:w-auto bg-gray-100 p-2">
      <div className="rounded-xl h-full flex flex-col bg-white p-7">
        <div className='bg-gray-100 flex justify-between mb-3'>
            <div>
              <p className="text-xs">Participantes:</p>
            </div>
            <div className='rounded-2xl bg-blue-500 font-bold text-white w-5 h-5 flex justify-center items-center'>
              <p>
                {participants.length}
              </p>
            </div>
          </div>
        <div className="flex flex-col gap-2">
          {participants
            .sort((a, b) =>
              Number(b.name === name) -
              Number(a.name === name)
            )
            .map((participant) => (
                <div className="flex gap-3" key={participant.id}>
                  <Image 
                    src={participant.image_url}
                    width={25}
                    height={20}
                    className='rounded-xl shrink-0'
                    alt={participant.name}
                  />
                  <p
                    className={
                      participant.name === name
                      ? "font-bold border-b"
                      : "font-normal"
                    }
                    >
                    {participant.name}
                  </p>
                </div>
            
            ))}
        </div>
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
