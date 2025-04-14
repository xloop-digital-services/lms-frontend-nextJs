
import * as XLSX from "xlsx";
export const downloadExcel = (scores, title) => {
  const excelData = scores.map(({ student_registration_id, student_name, grades_summary }) => ({
    "Registration ID": student_registration_id,
    "Name": student_name,
    "Assignments": grades_summary.assignments,
    "Quizzes": grades_summary.quizzes,
    "Projects": grades_summary.projects,
    "Exams": grades_summary.exams,
    "Attendance Grace Marks": grades_summary.attendance_grace_marks,
    "Total": grades_summary.total,
    "Overall %": grades_summary.overall_percentage,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Performance");

  XLSX.writeFile(workbook, `student_scores_${title}.xlsx`);
};

