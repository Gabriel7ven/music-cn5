import { TeamCardWrapper } from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";

export default function Page() {
    return (
        <>
            <div>
                {/* <Suspense fallback={<h1>Teams</h1>}>
                    <UploadFile />
                </Suspense> */}
                <h1 className={`${lusitana.className} text-2xl mb-10`}>Equipes</h1>
                <TeamCardWrapper />
            </div>
        </>
    )
}