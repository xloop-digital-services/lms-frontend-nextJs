"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSidebar } from "@/providers/useSidebar";
import { getCalendarData } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";

export default function Page() {
  const { userData } = useAuth();
  const { isSidebarOpen } = useSidebar();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const userId = userData?.User?.id;
  const group = userData?.Group;

  async function fetchCalendarSessions() {
    const response = await getCalendarData(userId);
    try {
      if (response.status === 200) {
        const events = Array.isArray(response?.data?.data)
          ? response.data?.data?.flatMap((item) =>
              Array.isArray(item.sessions)
                ? item?.sessions?.map((session) => ({
                    title: session.course_name,
                    start: `${item.date}T${session.start_time}`,
                    end: `${item.date}T${session.end_time}`,
                    description: `Location: ${session.location}`,
                  }))
                : []
            )
          : [];
        setCalendarEvents(events);
      } else {
        console.error("Failed to fetch calendar data", response.status);
      }
    } catch (error) {
      console.error("Error fetching calendar data", error);
    }
  }

  useEffect(() => {
    if (userId && (group === "instructor" || group === "student")) {
      fetchCalendarSessions();
    }
  }, [userId, group]);

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-20 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{ width: isSidebarOpen ? "81%" : "100%" }}
    >
      <div className="bg-surface-100 p-4 rounded-xl text-wrap">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          contentHeight={1000}
          fixedWeekCount={false}
          events={calendarEvents.map((event) => {
            return {
              title: `${event.title}`,
              start: event.start,
              end: event.end,
              description: event.description,
            };
          })}
          eventContent={(arg) => {
            const startTime = format(new Date(arg.event.start), "p");
            const endTime = format(new Date(arg.event.end), "p");

            return (
              <div
                style={{ whiteSpace: "normal" }}
                className="focus:outline-none cursor-pointer"
              >
                <b>{`${startTime} - ${endTime}`}</b>{" "}
                <p className="" title={arg.event.title}>
                  {arg.event.title}
                </p>{" "}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
