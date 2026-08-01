const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * Helper function to extract text safely from PDF buffer using pdf-parse v2
 */
async function extractPdfText(buffer) {
    if (!buffer || buffer.length === 0) return "";
    try {
        if (pdfParse.PDFParse) {
            const parser = new pdfParse.PDFParse(Uint8Array.from(buffer));
            const result = await parser.getText();
            return typeof result === "string" ? result : (result.text || "");
        } else if (typeof pdfParse === "function") {
            const data = await pdfParse(buffer);
            return data.text || "";
        }
    } catch (err) {
        console.error("PDF Parsing sub-error:", err);
    }
    return "";
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF file is required (form-data key: 'resume')."
            });
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required in request body (form-data key: 'jobDescription')."
            });
        }

        const resumeText = await extractPdfText(req.file.buffer);

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("Error in generateInterViewReportController:", error);
        res.status(500).json({
            message: error.message || "An error occurred while generating the interview report."
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while fetching the interview report."
        });
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while fetching interview reports."
        });
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while generating resume PDF."
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};