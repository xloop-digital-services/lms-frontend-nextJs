 
import * as XLSX from 'xlsx'; 
export const generateExcel = () => {
    const sections = [
      { title: "Assignment", data: assignment?.data, columns: ["assignment_name", "total_marks", "marks_obtain", "remarks", "status"] },
      { title: "Quiz", data: quiz?.data, columns: ["quiz_name", "total_marks", "marks_obtain", "remarks", "status"] },
      { title: "Project", data: project?.data, columns: ["project_name", "total_marks", "marks_obtain", "remarks", "status"] },
      { title: "Exam", data: exam?.data, columns: ["exam_name", "total_marks", "marks_obtain", "remarks", "status"] },
      {
        title: "Attendance",
        data: attendanceStudent,
        columns: ["student", "student_name", "date", "status", "marked_by", "day"],
        transform: {
          status: (value) => {
            return value === 1 ? "Absent" : value === 0 ? "Present" : "Leave";
          }
        }
      },
    ];
    const allRows = [];
    sections.forEach((section) => {
      if (section.data && section.data.length > 0) {
        allRows.push([section.title]);

        allRows.push(section.columns.map(col =>
          col
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
        ));

        section.data.forEach((item) => {
          const row = section.columns.map(col => {
            if (section.transform && section.transform[col]) {
              return section.transform[col](item[col]);
            }
            return item[col] || '';
          });
          allRows.push(row);
        });
        allRows.push([]);
      }
    });

    allRows.push(["Performance Summary"]);
    allRows.push([
      "Component",
      "Score",
      "Total",
      "Weightage (%)",
      "Weighted Score"
    ]);

    const summaryData = [
      {
        label: "Assignment",
        score: progress?.assignments?.grades,
        total: progress?.assignments?.total_grades,
        weightage: progress?.assignments?.weightage,
        weightedScore: progress?.assignments?.percentage
      },
      {
        label: "Quiz",
        score: progress?.quizzes?.grades,
        total: progress?.quizzes?.total_grades,
        weightage: progress?.quizzes?.weightage,
        weightedScore: progress?.quizzes?.percentage
      },
      {
        label: "Project",
        score: progress?.projects?.grades,
        total: progress?.projects?.total_grades,
        weightage: progress?.projects?.weightage,
        weightedScore: progress?.projects?.percentage
      },
      {
        label: "Exam",
        score: progress?.exams?.grades,
        total: progress?.exams?.total_grades,
        weightage: progress?.exams?.weightage,
        weightedScore: progress?.exams?.percentage
      },
      {
        label: "Attendance",
        score: progress?.attendance?.attendance_grace_marks,
        total: progress?.attendance?.total_attendance,
        weightage: progress?.attendance?.weightage,
        weightedScore: progress?.attendance?.attendance_grace_marks
      }
    ];

    summaryData.forEach(row => {
      allRows.push([
        row.label,
        row.score !== undefined ? Number(row.score).toFixed(2) : '',
        row.total !== undefined ? Number(row.total).toFixed(2) : '',
        row.weightage !== undefined ? Number(row.weightage).toFixed(2) : '',
        row.weightedScore !== undefined ? Number(row.weightedScore).toFixed(2) : ''
      ]);
    });


    const ws = XLSX.utils.aoa_to_sheet(allRows);
    const colWidths = [
      { wch: 30 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 20 },
      { wch: 15 }
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${regId}`);
    XLSX.writeFile(wb, `Performance Report of ${regId}.xlsx`);
  };