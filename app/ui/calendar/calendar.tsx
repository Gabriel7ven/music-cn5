"use client";

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
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

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

  // Fecha tooltip ao clicar fora
  useEffect(() => {
    const handler = () => setOpenTooltip(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // 🔹 Gerar calendário dinamicamente com useMemo
  const monthCalendar = useMemo(() => {
    const startOfMonth = Temporal.PlainDate.from({
      year,
      month,
      day: 1,
    });

    const monthLength = startOfMonth.daysInMonth;
    const dayOfWeekMonthStartedOn = startOfMonth.dayOfWeek % 7;

    const weeks = Math.ceil(
      (dayOfWeekMonthStartedOn + monthLength) / 7
    );

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
      <div className="flex justify-start mb-4">
        <button
          className="btn btn-blue w-[120px] me-2"
          onClick={previous}
        >
          &lt; Previous
        </button>

        <button
          className="btn btn-blue w-[120px]"
          onClick={next}
        >
          Next &gt;
        </button>
      </div>

      {/* Título */}
      <div className="flex items-center justify-between mt-6 mb-6">
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

          return (
            <div
              key={index}
              className={`relative p-3 rounded-lg cursor-pointer min-h-[88px] flex flex-col justify-between border
                ${day.isInMonth ? 'bg-white hover:shadow-md' : 'bg-gray-50 text-gray-400'}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="text-sm font-medium text-slate-700">{day.date.day}</div>
              </div>

              {/* Mobile: bolinha com tooltip; md+: badges */}
              {cellAppointments.length > 0 && (
                <>
                  {/* Mobile dot */}
                  <div className="md:hidden mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenTooltip(openTooltip === dateKey ? null : dateKey);
                      }}
                      className="w-4 h-4 rounded-full bg-blue-600 block"
                      aria-expanded={openTooltip === dateKey}
                      aria-label={`Mostrar compromissos de ${day.date.toString()}`}
                    />

                    {openTooltip === dateKey && (
                      <div
                        className="absolute z-50 left-1/2 top-16 -translate-x-1/2 w-44 bg-white border shadow-md rounded-md p-2 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="font-medium text-slate-700 mb-1">Compromissos</div>
                        <div className="flex flex-col gap-1">
                          {cellAppointments.map((a, i) => (
                            <div key={i} className="truncate">{a.name}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Badges for md+ */}
                  <div className="hidden md:flex mt-2 flex-col gap-1">
                    {cellAppointments.slice(0, 3).map((appt, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-2 text-xs font-medium bg-blue-600 text-white px-2 py-1 rounded-full max-w-full truncate"
                        title={appt.name}
                      >
                        {appt.name}
                      </div>
                    ))}
                    {cellAppointments.length > 3 && (
                      <div className="text-xs text-slate-500">+{cellAppointments.length - 3} outros</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}