"use client"

import React from "react";
import { Temporal } from "temporal-polyfill";
import { useState, useEffect } from "react";
// import { teste } from "@/app/lib/utils";

// teste("Eita que bacana!")
export default function Calendar() {
const [month, setMonth] = useState(Temporal.Now.plainDateISO().month); // pega o número do mês atual (2, para Fevereiro)
const [year, setYear] = useState(Temporal.Now.plainDateISO().year);    // pega o número do ano atual (2026, para o ano atual)
const [monthCalendar, setMonthCalendar] = useState<{ date: Temporal.PlainDate; isInMonth: boolean }[]>([]);


const next = () => {
const { month: nextMonth, year: nextYear } = Temporal.PlainYearMonth.from({
month,
year,
}).add({ months: 1 });
setMonth(nextMonth);
setYear(nextYear);
};

const previous = () => {
  const { month: prevMonth, year: prevYear } = Temporal.PlainYearMonth.from({
    month,
    year,
  }).subtract({ months: 1 });
  setMonth(prevMonth);
  setYear(prevYear);
};


  useEffect(() => {
    // const fiveWeeks = 5 * 7;
    // const sixWeeks = 6 * 7;
    const startOfMonth = Temporal.PlainDate.from({ year, month, day: 1 }); // year=2026,  month=2, day=1
    
    const monthLength = startOfMonth.daysInMonth;     // 28
    // const dayOfWeekMonthStartedOn = startOfMonth.dayOfWeek - 1; 
    // Tirando o domingo do sétimo dia e lançando para o lugar correto, o primeiro dia da semana
    // Dias antes de começar o mês propriamente dito
    const dayOfWeekMonthStartedOn = (startOfMonth.dayOfWeek % 7)  // o dia da semana em ISO 8601, quando dividido (%) por 7 equivale à quantidade de dias antes de começar o mês propriamente dito. 
    // Calculando a quantidade de semanas dinamicamente
    const weeks = Math.ceil((dayOfWeekMonthStartedOn + monthLength) / 7)
    // Calculate the overall length including days from the previous and next months to be shown
    const length =
      // dayOfWeekMonthStartedOn + monthLength > fiveWeeks ? sixWeeks : fiveWeeks;
       weeks * 7;

    // Create blank array
    const calendar = new Array(length)
      .fill({})
      // Populate each day in the array
      .map((_, index) => {
        const date = startOfMonth.add({
          days: index - dayOfWeekMonthStartedOn,
        });
        return {
          isInMonth: !(
            index < dayOfWeekMonthStartedOn ||
            index - dayOfWeekMonthStartedOn >= monthLength
          ),
          date,
        };
      });

    setMonthCalendar(calendar);
  }, [year, month]);

  return (
  <div className="flex-grow flex flex-col max-h-screen">
    <div className="flex justify-start mb-4">
      <button className="btn btn-blue w-[120px] me-2" onClick={previous}>
        &lt; Previous
      </button>
      <button className="btn btn-blue w-[120px]" onClick={next}>
        Next &gt;
      </button>
    </div>
    {/* Add this div: */}
    <h2 className="text-lg font-semibold mt-5 mb-5">
      {Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString("pt", {
        month: "long",
        year: "numeric",
      }).toUpperCase()}
    </h2>

    <div className="grid grid-cols-7">
      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
        (name, index) => (<div key={index}>{name}</div>)
      )}
    </div>
    <div className="grid grid-cols-7 w-full  md:flex-grow  gap-1 overflow-hidden rounded-xl text-sm ">
      {monthCalendar.map((day, index) => (
        <div
          key={index}
          className={`cursor-pointer p-2 ${
            day.isInMonth
            ? "bg-blue-50 hover:bg-slate-200"
            : "bg-gray-50 hover:bg-slate-200 font-light text-slate-400"
          }`}
        >
          {day.date.day}
        </div>
      ))}
    </div>
  </div>
  
);
}

// export default Calendar;