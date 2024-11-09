"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSidebar } from "@/providers/useSidebar";
import { getCalendarData } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";

export default function StudentCalendar() {
  const { userData } = useAuth();
  const { isSidebarOpen } = useSidebar();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const userId = userData?.User?.id;
  const group = userData?.Group;
  const router = useRouter();

  async function fetchCalendarSessions() {
    const response = await getCalendarData(userId);
    try {
      if (response.status === 200) {
        const events = Array.isArray(response?.data?.data)
          ? response.data?.data?.flatMap((item) => {
              const sessionEvents = item.sessions
                .filter((session) => session.start_time && session.end_time)
                .map((session) => ({
                  title: `${session.course_name} - Class`,
                  start: `${item.date}T${session.start_time}`,
                  end: `${item.date}T${session.end_time}`,
                  className: "bg-blue-100 p-1 ",
                  type: "Class",
                }));

              const assessmentEvents = item.sessions
                .filter((session) =>
                  ["Assignment", "Quizze", "Project", "Exam"].includes(
                    session.type
                  )
                )
                .map((assessment) => ({
                  title: `${assessment.course_name} - ${
                    assessment.assessment_name || "No name provided"
                  }`,
                  start: `${item.date}T${assessment.due_time || "00:00"}`,
                  className: "bg-blue-300 bg-opacity-30 ",
                  type: assessment.type,
                  courseId: assessment.course_id, 
                }));

              return [...sessionEvents, ...assessmentEvents];
            })
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

  const handleEventClick = (arg) => {
    const { type, courseId } = arg.event.extendedProps;
    if (type === "Quizze") {
      router.push(`/quiz/course/${courseId}`);
    }
    if (type === "Project") {
      router.push(`/quiz/project/${courseId}`);
    }
    if (type === "Exam") {
      router.push(`/exam/course/${courseId}`);
    } else if (type === "Assignment") {
      router.push(`/assignment/course/${courseId}`);
    }
  };

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-20 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{ width: isSidebarOpen ? "81%" : "100%" }}
    >
      <div className="bg-surface-100 p-4 rounded-xl text-wrap max-md:overflow-auto">
        <div className="max-md:min-w-[600px]">
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
            events={calendarEvents.map((event) => ({
              title: event.title,
              start: event.start,
              end: event.end,
              description: event.description,
              className: event.className,
              type: event.type, 
              courseId: event.courseId, 
            }))}
            eventClick={handleEventClick}
            eventContent={(arg) => {
              const startTime = format(new Date(arg.event.start), "p");
              const endTime = arg.event.end
                ? format(new Date(arg.event.end), "p")
                : null;

              return (
                <div
                  style={{ height: "60px", whiteSpace: "normal" }}
                  className={`focus:outline-none cursor-pointer ${arg.event.classNames.join(
                    " "
                  )}`}
                >
                  <b>{endTime ? `${startTime} - ${endTime}` : startTime}</b>
                  <p className="" title={arg.event.title}>
                    {arg.event.title}
                  </p>
                  <p>{arg.event.extendedProps.description}</p>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}