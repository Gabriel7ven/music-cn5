import Image from 'next/image';
import { fetchFilteredParticipants } from '@/app/lib/data';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';

export default async function ParticipantsTable({
  query,
   currentPage,
 }: {
   query: string;
   currentPage: number;
 }) {
   const participants = await fetchFilteredParticipants(query, currentPage);
  return (
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={participant.image_url}
                              className="rounded-full"
                              alt={`${participant.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p>{participant.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {participant.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Birth Date</p>
                        <p className="font-medium">{participant.birth_date}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Team Id</p>
                        <p className="font-medium">{participant.team_id}</p>
                      </div>
                    </div>
                    {/* <div className="pt-4 text-sm">
                      <p>{customer.total_invoices} invoices</p>
                    </div> */}
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Birth Date
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Team Id
                    </th>
                    {/* <th scope="col" className="px-4 py-5 font-medium">
                      Total Paid
                    </th> */}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {participants.map((participant) => (
                    <tr key={participant.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={participant.image_url}
                            className="rounded-full"
                            alt={`${participant.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{participant.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {participant.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {participant.birth_date}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {participant.team_id}
                      </td>
                      <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateInvoice id={participant.id} />
                          <DeleteInvoice id={participant.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}
