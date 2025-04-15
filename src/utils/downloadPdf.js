import jsPDF from "jspdf";
import "jspdf-autotable";
export const downloadPDF = (scores, title) => {
  const doc = new jsPDF("landscape");
  doc.setFontSize(12);
  doc.text(`Student Performance Report - ${title}`, 14, 10);

  const columns = [
    "Reg ID",
    "Name",
    "Assignments",
    "Quizzes",
    "Projects",
    "Exams",
    "Attendance Grace",
    "Total",
    "Overall %",
  ];

  const rows = scores.map(({ student_registration_id, student_name, grades_summary }) => [
    student_registration_id,
    student_name,
    grades_summary.assignments,
    grades_summary.quizzes,
    grades_summary.projects,
    grades_summary.exams,
    grades_summary.attendance_grace_marks.toFixed(2),
    grades_summary.total.toFixed(2),
    grades_summary.overall_percentage.toFixed(2),
  ]);

  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 20,
  });

  doc.save(`student_scores_${title}.pdf`);
};

