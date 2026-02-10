"use client"

import React from "react";
import { Temporal } from "temporal-polyfill";
import { useState } from "react";

export default function Calendar() {
const [month, setMonth] = useState(Temporal.Now.plainDateISO().month);
const [year, setYear] = useState(Temporal.Now.plainDateISO().year);

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
    <h2 className="text-lg font-semibold">
      {Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString("en", {
        month: "long",
        year: "numeric",
      })}
    </h2>
  </div>
);
}

// export default Calendar;