import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Student Performance Report ${regId}`, 14, 15);

    const sections = [
        { title: "Assignment", data: assignment?.data },
        { title: "Quiz", data: quiz?.data },
        { title: "Project", data: project?.data },
        { title: "Exam", data: exam?.data },
        {
            title: "Attendance",
            data: attendanceStudent?.map((att) => ({
                date: att.date,
                day: att.day,
                status: att.status === 1 ? "Absent" : att.status === 0 ? "Present" : "Leave",
                marked_by: att.marked_by

            }))
        }

    ];

    let startY = 25;

    sections.forEach((section) => {
        const rows = section.data?.map((item) => {
            const keys = Object.keys(item);
            return keys.map((k) => item[k]);
        });

        const columns =
            section.data && section.data.length > 0
                ? Object.keys(section.data[0]).map((key) => ({
                    header: key.replace(/_/g, ' ').toUpperCase(),
                    dataKey: key,
                }))
                : [];

        if (columns.length > 0) {
            doc.text(section.title, 14, startY);
            autoTable(doc, {
                startY: startY + 5,
                head: [columns.map((col) => col.header)],
                body: rows,
                theme: "grid",
                styles: { fontSize: 8 },
                didDrawPage: (data) => {
                    startY = data.cursor.y + 10;
                },
            });
        }
    });

    doc.text("Performance Summary", 14, startY);

    autoTable(doc, {
        startY: startY + 5,
        head: [[
            "Component",
            "Score",
            "Total",
            "Weightage (%)",
            "Weighted Score"
        ]],
        body: [
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
        ].map(row => [
            row.label,
            row.score !== undefined ? Number(row.score).toFixed(2) : '',
            row.total !== undefined ? Number(row.total).toFixed(2) : '',
            row.weightage !== undefined ? Number(row.weightage).toFixed(2) : '',
            row.weightedScore !== undefined ? Number(row.weightedScore).toFixed(2) : ''
        ]),
        theme: "grid",
        styles: { fontSize: 8 },
    });

    doc.save(`Student performance report of ${regId}.pdf`);
};
