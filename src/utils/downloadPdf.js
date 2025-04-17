import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadPDF = (scores, title) => {
  const doc = new jsPDF("landscape");
  doc.setFontSize(12);
  doc.text(`Student Performance Report - ${title}`, 14, 10);

  // Get totals from the first student's grades_summary
  const firstSummary = scores[0]?.grades_summary || {};

  const columns = [
    "Reg ID",
    "Name",
    `Assignments (${firstSummary.total_assignment_marks || "-"})`,
    `Quizzes (${firstSummary.total_quiz_marks || "-"})`,
    `Projects (${firstSummary.total_project_marks || "-"})`,
    `Exams (${firstSummary.total_exam_marks || "-"})`,
    "Attendance Grace",
    "Total",
    "Overall %",
  ];

  const rows = scores.map(({ student_registration_id, student_name, grades_summary }) => [
    student_registration_id,
    student_name,
    grades_summary.assignments?.toFixed(2),
    grades_summary.quizzes?.toFixed(2),
    grades_summary.projects?.toFixed(2),
    grades_summary.exams?.toFixed(2),
    grades_summary.attendance_grace_marks?.toFixed(2),
    grades_summary.total?.toFixed(2),
    grades_summary.overall_percentage?.toFixed(2),
  ]);

  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 20,
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
  });

  doc.save(`student_scores_${title}.pdf`);
};
