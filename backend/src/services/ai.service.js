const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

//----------------------------------------------------//
// Google Gemini AI Configuration
//----------------------------------------------------//

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
    apiKey: apiKey
});

// Working Gemini model fallback priority list
const CANDIDATE_MODELS = [
    "gemini-flash-latest",
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
];

/**
 * Helper to generate content with fallback across candidate Gemini models
 */
async function generateContentWithFallback({ prompt, schema, temperature = 0.2 }) {
    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
        try {
            console.log(`[AI Service] Calling Gemini API with model: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    temperature: temperature,
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            if (response && response.text) {
                console.log(`[AI Service] Received response from model ${modelName}`);
                return response.text;
            }
        } catch (err) {
            console.warn(`[AI Service] Model ${modelName} failed: ${err.message || err}`);
            lastError = err;
        }
    }

    throw new Error(`All Gemini AI models failed. Last error: ${lastError ? lastError.message : 'Unknown'}`);
}

//----------------------------------------------------//
// Gemini Native Schema definitions
//----------------------------------------------------//

const interviewReportGeminiSchema = {
    type: "OBJECT",
    properties: {
        title: {
            type: "STRING",
            description: "Exact job title extracted from the job description."
        },
        matchScore: {
            type: "INTEGER",
            description: "Overall candidate match score between 0 and 100."
        },
        summary: {
            type: "STRING",
            description: "Professional HR summary of the candidate."
        },
        strengths: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Candidate strengths."
        },
        weaknesses: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Candidate weaknesses."
        },
        recommendation: {
            type: "STRING",
            enum: ["Strong Hire", "Hire", "Consider", "Reject"],
            description: "Hiring recommendation."
        },
        recommendationReason: {
            type: "STRING",
            description: "Reason behind hiring recommendation."
        },
        technicalQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "Technical question" },
                    intention: { type: "STRING", description: "Why ask this question" },
                    answer: { type: "STRING", description: "Ideal answer" }
                },
                required: ["question", "intention", "answer"]
            },
            description: "Technical interview questions."
        },
        behavioralQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "Behavioral question" },
                    intention: { type: "STRING", description: "Why ask this question" },
                    answer: { type: "STRING", description: "Ideal answer" }
                },
                required: ["question", "intention", "answer"]
            },
            description: "Behavioral interview questions."
        },
        skillGaps: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING", description: "Missing skill name" },
                    severity: { type: "STRING", enum: ["low", "medium", "high"], description: "Severity level" },
                    reason: { type: "STRING", description: "Reason why this skill is missing" }
                },
                required: ["skill", "severity", "reason"]
            },
            description: "Identified skill gaps."
        },
        preparationPlan: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER", description: "Day number (1 to 7)" },
                    focus: { type: "STRING", description: "Focus area" },
                    tasks: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        description: "List of actionable tasks"
                    }
                },
                required: ["day", "focus", "tasks"]
            },
            description: "7-day interview preparation plan."
        }
    },
    required: [
        "title",
        "matchScore",
        "summary",
        "strengths",
        "weaknesses",
        "recommendation",
        "recommendationReason",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
};

const resumePdfGeminiSchema = {
    type: "OBJECT",
    properties: {
        html: {
            type: "STRING",
            description: "Professional ATS friendly HTML Resume content."
        }
    },
    required: ["html"]
};

// Zod Schema for validation
const interviewReportValidationSchema = z.object({
    title: z.string().min(1),
    matchScore: z.number().min(0).max(100),
    summary: z.string().min(10),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendation: z.enum(["Strong Hire", "Hire", "Consider", "Reject"]),
    recommendationReason: z.string().min(5),
    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"]),
            reason: z.string()
        })
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    )
});

//----------------------------------------------------//
// Generate Interview Report
//----------------------------------------------------//

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    try {
        const prompt = `
You are a Senior Technical Recruiter with over 15 years of hiring experience at Google, Amazon, and Microsoft.

Analyse the candidate details provided below and generate a comprehensive interview report.

=============================
Resume
=============================
${resume || "Not provided"}

=============================
Self Description
=============================
${selfDescription || "Not provided"}

=============================
Job Description
=============================
${jobDescription}

Instructions:
1. Extract the exact job title from the job description.
2. Calculate a realistic match score from 0-100 based on fit.
3. Write an in-depth professional HR summary.
4. List 3 to 6 key candidate strengths.
5. List 2 to 5 key candidate weaknesses.
6. Give a recommendation: "Strong Hire", "Hire", "Consider", or "Reject".
7. Explain the reason for your recommendation in detail.
8. Generate 5-8 technical interview questions with question, intention, and ideal answer.
9. Generate 3-5 behavioral interview questions with question, intention, and ideal answer.
10. Identify skill gaps with skill name, severity (low, medium, high), and reason.
11. Generate a complete 7-day preparation plan with day number (1 to 7), focus topic, and 3-5 tasks per day.
`;

        const responseText = await generateContentWithFallback({
            prompt,
            schema: interviewReportGeminiSchema,
            temperature: 0.2
        });

        const parsedResponse = JSON.parse(responseText);

        // Validate response structure
        const validatedResponse = interviewReportValidationSchema.parse(parsedResponse);

        return validatedResponse;
    } catch (err) {
        console.error("\n=========== GEMINI AI ERROR ===========\n", err);
        throw err;
    }
}

//----------------------------------------------------//
// Convert HTML -> PDF
//----------------------------------------------------//

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0"
    });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();

    return pdfBuffer;
}

//----------------------------------------------------//
// Generate Resume PDF
//----------------------------------------------------//

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {
    const prompt = `
Generate a modern ATS friendly resume as HTML code.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Requirements:
- Clean ATS friendly HTML with modern inline CSS styling.
- Standard sections: Professional Summary, Experience, Education, Skills.
- Return JSON object with an 'html' string field.
`;

    const responseText = await generateContentWithFallback({
        prompt,
        schema: resumePdfGeminiSchema,
        temperature: 0.3
    });

    const jsonContent = JSON.parse(responseText);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}

//----------------------------------------------------//
// Exports
//----------------------------------------------------//

module.exports = {
    generateInterviewReport,
    generateResumePdf
};