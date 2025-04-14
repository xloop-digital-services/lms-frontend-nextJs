import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const downloadGradingExcel = (data) => {
    const generateSheetData = (category, itemsList) => {
        const sheet = [];

        itemsList.forEach(items => {
            sheet.push([`${category}: ${items.title} (Total Marks: ${items.total_marks})`, "", "", ""]);
            sheet.push(["Student Name", "Obtained Marks", "Percentage %", "Remarks"]);

            if (Array.isArray(items.students) && items.students.length === 0) {
                sheet.push(["No students found", "", "", ""]);
            } else {
                (items.students || []).forEach(student => {
                    sheet.push([student.student_name, student.obtained_marks, student.percentage, student?.remarks]);
                });
            }
            sheet.push(["", "", "", ""]);
        });

        return sheet;
    };

    const wb = XLSX.utils.book_new();

    if (data.assignments && data.assignments.length > 0) {
        const assignmentSheet = XLSX.utils.aoa_to_sheet(generateSheetData("Assignment", data.assignments));
        XLSX.utils.book_append_sheet(wb, assignmentSheet, "Assignments");
    }

    if (data.quizzes && data.quizzes.length > 0) {
        const quizSheet = XLSX.utils.aoa_to_sheet(generateSheetData("Quiz", data.quizzes));
        XLSX.utils.book_append_sheet(wb, quizSheet, "Quizzes");
    }

    if (data.projects && data.projects.length > 0) {
        const projectSheet = XLSX.utils.aoa_to_sheet(generateSheetData("Project", data.projects));
        XLSX.utils.book_append_sheet(wb, projectSheet, "Projects");
    }

    if (data.exams && data.exams.length > 0) {
        const examSheet = XLSX.utils.aoa_to_sheet(generateSheetData("Exam", data.exams));
        XLSX.utils.book_append_sheet(wb, examSheet, "Exams");
    }

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "grading_evaluation.xlsx");
};
