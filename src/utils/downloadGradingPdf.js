import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadGradingPDF = (data, title) => {
    if (!data || !data.assignments || !data.quizzes || !data.projects || !data.exams) {
        // console.error("Invalid data passed to downloadGradingPDF:", data);
        return;
    }

    const doc = new jsPDF();
    let currentY = 10;

    doc.text(`${title || "Student Performance Report"}`, 14, currentY);
    currentY += 10;

    // Assignments
    doc.text("Assignments", 14, currentY);
    currentY += 5;

    data.assignments.forEach((assignment) => {
        doc.text(`Assignment: ${assignment.title}`, 14, currentY += 12);
        doc.text(`Total Marks: ${assignment.total_marks}`, 14, currentY += 8);

        autoTable(doc, {
            startY: currentY += 5,
            head: [["Student Name", "Obtained Marks", "Percentage", "Remarks"]],
            body: assignment.students.map((student) => [
                student.student_name,
                student.obtained_marks,
                `${student.percentage.toFixed(2)}%`,
                student.remarks?.trim() ? student.remarks : "-"
            ]),
            theme: "grid",
            headStyles: { fillColor: [22, 160, 133], fontStyle: 'bold' },
            didDrawPage: (data) => {
                currentY = data.cursor.y;
            }
        });
    });

    // Quizzes
    currentY += 10;
    doc.text("Quizzes", 14, currentY);
    data.quizzes.forEach((quiz) => {
        doc.text(`Quiz: ${quiz.title}`, 14, currentY += 12); // increased from 10 to 12
        doc.text(`Total Marks: ${quiz.total_marks}`, 14, currentY += 8); // increased from 5 to 8


        autoTable(doc, {
            startY: currentY += 5,
            head: [["Student Name", "Obtained Marks", "Percentage", "Remarks"]],
            body: quiz.students.map((student) => [
                student.student_name,
                student.obtained_marks,
                `${student.percentage.toFixed(2)}%`,
                student.remarks?.trim() ? student.remarks : "-"
            ]),
            theme: "grid",
            headStyles: { fillColor: [22, 160, 133], fontStyle: 'bold' },
            didDrawPage: (data) => {
                currentY = data.cursor.y;
            }
        });
    });

    // Projects
    currentY += 10;
    doc.text("Projects", 14, currentY);
    data.projects.forEach((project) => {
        doc.text(`Project: ${project.title}`, 14, currentY += 12);
        doc.text(`Total Marks: ${project.total_marks}`, 14, currentY += 8);

        autoTable(doc, {
            startY: currentY += 5,
            head: [["Student Name", "Obtained Marks", "Percentage", "Remarks"]],
            body: project.students.map((student) => [
                student.student_name,
                student.obtained_marks,
                `${student.percentage.toFixed(2)}%`,
                student.remarks?.trim() ? student.remarks : "-"
            ]),
            theme: "grid",
            headStyles: { fillColor: [22, 160, 133], fontStyle: 'bold' },
            didDrawPage: (data) => {
                currentY = data.cursor.y;
            }
        });
    });

    // Exams
    currentY += 10;
    doc.text("Exams", 14, currentY);
    data.exams.forEach((exam) => {
        doc.text(`Exam: ${exam.title}`, 14, currentY += 12);
        doc.text(`Total Marks: ${exam.total_marks}`, 14, currentY += 8);

        autoTable(doc, {
            startY: currentY += 5,
            head: [["Student Name", "Obtained Marks", "Percentage", "Remarks"]],
            body: exam.students.map((student) => [
                student.student_name,
                student.obtained_marks,
                `${student.percentage.toFixed(2)}%`,
                student.remarks?.trim() ? student.remarks : "-"
            ]),
            theme: "grid",
            headStyles: { fillColor: [22, 160, 133], fontStyle: 'bold' },
            didDrawPage: (data) => {
                currentY = data.cursor.y;
            }
        });
    });

    doc.save(`${title || "Student-Performance"}.pdf`);
};
