"use client";

import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useMemo } from "react";
import { Temporal } from "temporal-polyfill";

type Appointment = {
  name: string;
  details: string;
  date: string; // vindo da API como string
};

export default function Calendar() {
  const today = Temporal.Now.plainDateISO();
  const [month, setMonth] = useState(today.month);
  const [year, setYear] = useState(today.year);
  const [monthAppointments, setMonthAppointments] = useState<Appointment[]>([]);
  // Drawer / form state
  const [drawerDate, setDrawerDate] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formDetails, setFormDetails] = useState("");
  const [formTime, setFormTime] = useState("");
  const [saving, setSaving] = useState(false);

  const [popoverOverflowRight, setPopoverOverflowRight] = useState(false);
    const [popoverOverflowLeft, setPopoverOverflowLeft] = useState(false);
  // 🔹 Navegação
  const next = () => {
    const { month: nextMonth, year: nextYear } =
      Temporal.PlainYearMonth.from({ year, month }).add({ months: 1 });

    setMonth(nextMonth);
    setYear(nextYear);
  };

  const previous = () => {
    const { month: prevMonth, year: prevYear } =
      Temporal.PlainYearMonth.from({ year, month }).subtract({ months: 1 });

    setMonth(prevMonth);
    setYear(prevYear);
  };

  // 🔹 Buscar compromissos (somente quando month/year mudar)
  useEffect(() => {
    async function loadAppointments() {
      const res = await fetch(
        `/api/appointments?year=${year}&month=${month}`
      );
      const data = await res.json();
      setMonthAppointments(data);
    }

    loadAppointments();
  }, [year, month]);

  // 🔹 Mapear compromissos por dia para renderizar etiquetas com nomes
  const appointmentMap = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of monthAppointments) {
      const key = a.date.split("T")[0];
      const list = map.get(key) ?? [];
      list.push(a);
      map.set(key, list);
    }
    return map;
  }, [monthAppointments]);

  // (tooltip removido — clique fora não necessário)

  // 🔹 Gerar calendário dinamicamente com useMemo
  const monthCalendar = useMemo(() => {
    const startOfMonth = Temporal.PlainDate.from({
      year,
      month,
      day: 1,
    });

    const monthLength = startOfMonth.daysInMonth;
    const dayOfWeekMonthStartedOn = startOfMonth.dayOfWeek % 7;

    // N° de semanas
    const weeks = Math.ceil(
      (dayOfWeekMonthStartedOn + monthLength) / 7
    );

    // Total de dias (incluindo os que pertencem aos meses anterior e posterior)
    const length = weeks * 7;

    return new Array(length).fill(null).map((_, index) => {
      const date = startOfMonth.add({
        days: index - dayOfWeekMonthStartedOn,
      });

      return {
        date,
        isInMonth: !(
          index < dayOfWeekMonthStartedOn ||
          index - dayOfWeekMonthStartedOn >= monthLength
        ),
      };
    });
  }, [year, month]);


  return (
    <div className="flex-grow flex flex-col max-h-screen">
      {/* Navegação */}
      <div className="w-[375px] flex gap-10 justify-between mb-2">
        <button
          className="flex btn btn-blue sm:w-[120px]"
          onClick={previous}
        >
          &lt; <span className="hidden sm:block">Previous</span>
        </button>

        <div className="flex items-baseline gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">
            {Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString("pt", {
              month: "long",
            })}
          </h2>
          <span className="inline-block text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {year}
          </span>
        </div>

        <button
          className="flex btn btn-blue sm:w-[120px]"
          onClick={next}
        >
          <span className="hidden sm:block">Next</span> &gt;
        </button>
      </div>

      {/* Título */}
      <div className="flex items-center justify-between mt-6 mb-6">
        {/* <div className="flex items-baseline gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">
            {Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString("pt", {
              month: "long",
            })}
          </h2>
          <span className="inline-block text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {year}
          </span>
        </div> */}
        <div className="text-sm text-slate-500">Agenda mensal</div>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 text-center font-medium">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
          (name, index) => (
            <div key={index}>{name}</div>
          )
        )}
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-2 mt-2 text-sm">
        {monthCalendar.map((day, index) => {
          const dateKey = day.date.toString();
          const cellAppointments = appointmentMap.get(dateKey) ?? [];
          // return da callback map()
          return (
            <div
              key={index}
              onClick={(e) => {
                {() => day.isInMonth && setDrawerDate(dateKey)}
              }}
               
                // divF.classList.add("w-30", "h-30", "rounded-full", "bg-green-600", "absolute", `top-3`, `bottom-3`, `left-3`)
    
              //{() => day.isInMonth && setDrawerDate(dateKey)}
              className={`p-[2px] relative   rounded-sm sm:rounded-lg cursor-pointer min-h-[88px] flex flex-col justify-between border
                ${day.isInMonth ? 'bg-white hover:shadow-md' : 'bg-gray-50 text-gray-400'}
              `}
            >
              <div className="flex justify-center items-start">
                <div className="text-sm font-medium text-slate-700" id={dateKey}>{day.date.day}</div>
              </div>

                {/* <div className='hidden w-10 h-5 border bg-blue-100 rounded-5 bg-green-600 absolute top-2' id={`${dateKey}${day.date.day}`}>
                  <button>Alterar</button> 
                  <button>Deletar</button> 
                </div> */}
              
        


              {/* Mobile: bolinha com tooltip; md+: badges */}
              {cellAppointments.length > 0 && (
                <>
                  {/* Mobile: bolinha indicadora (tooltip removido) */}
                  {/* <div className="md:hidden mt-2">
                    <div className="w-4 h-4 rounded-full bg-blue-600 block" aria-hidden="true" />
                  </div> */}

                  {/* Badges for md+ */}
                  <div className=" md:flex mt-2 flex-col gap-1">
                    {cellAppointments.slice(0, 3).map((appt, i) => (
                      <div
                        key={i}
                        className="text-[9px] pl-[2px] rounded-[2px] w-full inline-flex items-center gap-2 font-medium bg-blue-400 text-white sm:px-2 sm:py-1 sm:rounded-full sm:text-xs sm:max-w-full truncate"
                        title={appt.name}
                        onClick={(e) => {
                          e.stopPropagation()
                          
                       // 
                      const divPopover = document.getElementById(`${dateKey}${day.date.day}`)
                      const divPaiClasses = divPopover?.classList;
                      divPaiClasses?.toggle("hidden");
                      const paragraph = divPopover?.firstElementChild
                      
                      const html = document.getElementsByTagName("html")[0];
                      const htmlRigth = html.getBoundingClientRect().right;
                      const htmlLeft = html.getBoundingClientRect().left;
                      const popoverRigth = divPopover?.getBoundingClientRect().right;
                      const popoverLeft = divPopover?.getBoundingClientRect().left;
                      // let popoverOverflow = false;
                      if(popoverRigth) {
                        if (popoverRigth > htmlRigth) {
                          setPopoverOverflowRight(true);
                        } else {
                          setPopoverOverflowRight(false);
                        }
                      }
                      
                   
                      
                      if (paragraph) {
                        paragraph.innerHTML = (e.target as HTMLElement).innerHTML;
                      } 
                        }}  
                      >
                        {appt.name}
                      </div>
                    ))}
                    {cellAppointments.length > 3 && (
                      <div className="text-xs text-slate-500">+{cellAppointments.length - 3} outros</div>
                    )}
                    
                    <div className={`${popoverOverflowRight ? '-translate-x-[130px]' :  '-translate-x-[36px]'} flex flex-col items-center gap-5  rounded-md shadow-xl bg-white z-10 hidden p-3 w-[200px] h-auto border absolute bottom-10`} id={`${dateKey}${day.date.day}`}>
                      <p className='text-lg' id="singer-name"></p>
                      <div className="w-full flex justify-center">
                        <div className='flex gap-5 justify-'>
                          <button className="p-2 bg-yellow-400 text-black rounded-md">Alterar</button> 
                          <button className="p-2 bg-red-500 text-white rounded-md">Deletar</button> 
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
        
      </div>
      

        
       


      {/* Drawer lateral para criar compromisso */}
      {drawerDate && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerDate(null)} />
          <div className="relative ml-auto w-full max-w-[420px] h-full bg-white shadow-2xl p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Novo compromisso</h3>
              <button className="text-slate-500" onClick={() => setDrawerDate(null)}>Fechar</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!formName) return;
                setSaving(true);
                try {
                  const isoDate = drawerDate + (formTime ? `T${formTime}` : "T00:00:00");
                  const payload = { name: formName, details: formDetails, date: isoDate };
                  const res = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) throw new Error('Failed to create');
                  const created = await res.json();
                  setMonthAppointments((prev) => [...prev, created]);
                  // reset
                  setFormName('');
                  setFormDetails('');
                  setFormTime('');
                  setDrawerDate(null);
                } catch (err) {
                  console.error(err);
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div className="mb-3">
                <label className="block text-sm text-slate-700 mb-1">Data</label>
                <div className="text-sm text-slate-600">{drawerDate}</div>
              </div>

              <div className="mb-3">
                <label className="block text-sm text-slate-700 mb-1">Nome</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full border px-2 py-1 rounded-md" />
              </div>

              <div className="mb-3">
                <label className="block text-sm text-slate-700 mb-1">Detalhes</label>
                <textarea value={formDetails} onChange={(e) => setFormDetails(e.target.value)} className="w-full border px-2 py-1 rounded-md" rows={3} />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-slate-700 mb-1">Hora (opcional)</label>
                <input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="w-full border px-2 py-1 rounded-md" />
              </div>

              <div className="flex items-center gap-2">
                <button type="submit" className="btn btn-blue" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" className="text-sm text-slate-500" onClick={() => setDrawerDate(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
