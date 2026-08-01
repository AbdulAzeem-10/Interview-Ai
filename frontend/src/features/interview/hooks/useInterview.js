import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let result = null
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            result = response.interviewReport
            setReport(result)
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }

        return result
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let result = null
        try {
            const response = await getInterviewReportById(interviewId)
            result = response.interviewReport
            setReport(result)
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }
        return result
    }

    const getReports = async () => {
        setLoading(true)
        let result = null
        try {
            const response = await getAllInterviewReports()
            result = response.interviewReports
            setReports(result)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return result
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const blobData = await generateResumePdf({ interviewReportId })
            // blobData is already a Blob-> no need to re-wrap
            const url = window.URL.createObjectURL(blobData)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Only auto-fetch on Home page. 
        // The Interview page manages its own fetch via its own useEffect.
        if (!interviewId) {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}
