const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

const MAX_RESUME_TEXT_LENGTH = 60000;

/**
 * Helper function to extract text safely from PDF buffer using pdf-parse
 */
async function extractPdfText(buffer) {
    if (!buffer || buffer.length === 0) {
        throw new Error("The uploaded PDF is empty.");
    }

    if (buffer.subarray(0, 4).toString() !== "%PDF") {
        throw new Error("The uploaded file is not a valid PDF.");
    }

    // pdf-parse v2 expects a load-parameters object, not the raw Uint8Array.
    const parser = new pdfParse.PDFParse({ data: Buffer.from(buffer) });
    try {
        const result = await parser.getText();
        return (result.text || "").replace(/\s+/g, " ").trim();
    } finally {
        await parser.destroy();
    }
}


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                message: "Job description is required in request body (form-data key: 'jobDescription')."
            });
        }

        if (!req.file && !(selfDescription && selfDescription.trim())) {
            return res.status(400).json({
                message: "Upload a resume PDF or provide a self description."
            });
        }

        const extractedResumeText = req.file ? await extractPdfText(req.file.buffer) : "";
        const resumeText = extractedResumeText.slice(0, MAX_RESUME_TEXT_LENGTH);

        if (req.file && !resumeText) {
            return res.status(422).json({
                message: "No readable text was found in this PDF. Please upload a text-based PDF or add a self description."
            });
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim()
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim(),
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("Error in generateInterViewReportController:", error);
        const status = /valid PDF|uploaded PDF|readable text/.test(error.message) ? 422 : 500;
        res.status(status).json({
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

        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id });

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
