import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

export const downloadGradingExcel = (data) => {
    const allStudentsMap = new Map();
    const titles = {
        assignments: [],
        quizzes: [],
        projects: [],
        exams: [],
    };

    const fillCategoryData = (category, items) => {
        items.forEach((item) => {
            const label = category.charAt(0).toUpperCase() + category.slice(1, -1);
            const colKey = `${label}: ${item.title} (/ ${item.total_marks})`;

            titles[category].push(colKey);

            (item.students || []).forEach((s) => {
                const id = s.registration_id || s.student_name;
                if (!allStudentsMap.has(id)) {
                    allStudentsMap.set(id, {
                        "S. No.": 0,
                        "Student ID": s.registration_id || "",
                        "Student Name": s.student_name || "",
                    });
                }
                const student = allStudentsMap.get(id);
                student[colKey] = s.obtained_marks ?? 0;
            });
        });
    };

    if (Array.isArray(data.assignments))
        fillCategoryData("assignments", data.assignments);
    if (Array.isArray(data.quizzes)) fillCategoryData("quizzes", data.quizzes);
    if (Array.isArray(data.projects)) fillCategoryData("projects", data.projects);
    if (Array.isArray(data.exams)) fillCategoryData("exams", data.exams);

    if (Array.isArray(data.attendance)) {
        data.attendance.forEach((s) => {
            const id = s.registration_id || s.student_name;
            if (!allStudentsMap.has(id)) {
                allStudentsMap.set(id, {
                    "S. No.": 0,
                    "Student ID": s.registration_id || "",
                    "Student Name": s.student_name || "",
                });
            }
            const student = allStudentsMap.get(id);
            student["Present Classes"] = s.present_classes ?? 0;
            student["Total Classes"] = s.total_classes ?? 0;
            student["Attendance %"] = s.percentage?.toFixed(2) ?? "0";
        });
    }

    const summaryMap = new Map();
    (data.student_overall_summary || []).forEach((summary) => {
        summaryMap.set(
            summary.registration_id,
            summary.overall_percentage?.toFixed(2) || "0"
        );
    });


    allStudentsMap.forEach((student) => {
        const calcTotal = (list) =>
            list.reduce((sum, title) => sum + (Number(student[title]) || 0), 0);

        const getTotalPossibleMarks = (items) => {
            return items.reduce((sum, item) => sum + (item.total_marks || 0), 0);
        };

        const totalAssignmentMarks = getTotalPossibleMarks(data.assignments || []);
        const totalQuizMarks = getTotalPossibleMarks(data.quizzes || []);
        const totalProjectMarks = getTotalPossibleMarks(data.projects || []);
        const totalExamMarks = getTotalPossibleMarks(data.exams || []);

        allStudentsMap.forEach((student) => {
            const getSum = (list) =>
                list.reduce((sum, key) => sum + (Number(student[key]) || 0), 0);

            const assignmentTotal = getSum(titles.assignments);
            const quizTotal = getSum(titles.quizzes);
            const projectTotal = getSum(titles.projects);
            const examTotal = getSum(titles.exams);

            student[`Assignment Total (/ ${totalAssignmentMarks})`] = assignmentTotal;
            student[`Quiz Total (/ ${totalQuizMarks})`] = quizTotal;
            student[`Project Total (/ ${totalProjectMarks})`] = projectTotal;
            student[`Exam Total (/ ${totalExamMarks})`] = examTotal;
            const regId = student["Student ID"];
            student["Total Percentage"] = summaryMap.get(regId) || "0";
        });
    });

    const getTotalPossibleMarks = (items) => {
        return (items || []).reduce(
            (sum, item) => sum + (item.total_marks || 0),
            0
        );
    };

    const totalAssignmentMarks = getTotalPossibleMarks(data.assignments);
    const totalQuizMarks = getTotalPossibleMarks(data.quizzes);
    const totalProjectMarks = getTotalPossibleMarks(data.projects);
    const totalExamMarks = getTotalPossibleMarks(data.exams);

    const headers = [
        "S. No.",
        "Student ID",
        "Student Name",
        ...titles.assignments,
        `Assignment Total (/ ${totalAssignmentMarks})`,
        ...titles.quizzes,
        `Quiz Total (/ ${totalQuizMarks})`,
        ...titles.projects,
        `Project Total (/ ${totalProjectMarks})`,
        ...titles.exams,
        `Exam Total (/ ${totalExamMarks})`,
        "Present Classes",
        "Total Classes",
        "Attendance %",
        "Total Percentage",
    ];


    const sheetData = [headers];
    let i = 1;
    const sortedStudents = Array.from(allStudentsMap.values()).sort((a, b) =>
        (a["Student ID"] || "").localeCompare(b["Student ID"] || "")
    );

    for (const student of sortedStudents) {
        student["S. No."] = i++;
        const row = headers.map((key) => student[key] ?? "");
        sheetData.push(row);
    }


    sheetData.push([]);
    sheetData.push([
        "Note:",
        "All gradings have been determined based on the weightages assigned by the trainer.",
    ]);


    if (sheetData.length <= 1) {
        toast.warn("No data available to export.");
        return;
    }


    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Grading Report");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "grading_evaluation.xlsx"
    );
};
