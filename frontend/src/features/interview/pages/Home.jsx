import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport,reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ error, setError ] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[ 0 ]
        setError("")
        if (!jobDescription.trim()) {
            setError("Please add the target job description.")
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            setError("Upload a resume PDF or add a self description.")
            return
        }
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Unable to generate your interview strategy.")
        }
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <DropzoneUpload resumeInputRef={resumeInputRef} />

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    {error && <p className='form-error' role='alert'>{error}</p>}
                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}


// ── Dropzone sub-component ────────────────────────────────────────────────────
const DropzoneUpload = ({ resumeInputRef }) => {

    const [ dragActive, setDragActive ] = useState(false)
    const [ selectedFile, setSelectedFile ] = useState(null)

    const ACCEPTED_TYPES = [ 'application/pdf' ]
    const MAX_SIZE_MB = 5

    const applyFile = (file) => {
        if (!file) return
        if (!ACCEPTED_TYPES.includes(file.type)) {
            alert('Only PDF files are accepted.')
            return
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`File is too large. Max size is ${MAX_SIZE_MB}MB.`)
            return
        }
        setSelectedFile(file)
        // Sync the file into the hidden input so the parent can still read resumeInputRef.current.files[0]
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        resumeInputRef.current.files = dataTransfer.files
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const file = e.dataTransfer.files[0]
        applyFile(file)
    }

    const handleInputChange = (e) => {
        const file = e.target.files[0]
        applyFile(file)
    }

    const handleRemove = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedFile(null)
        resumeInputRef.current.value = ''
    }

    const openFilePicker = () => {
        resumeInputRef.current.click()
    }

    return (
        <div className='upload-section'>
            <label className='section-label'>
                Upload Resume
                <span className='badge badge--best'>Best Results</span>
            </label>

            {selectedFile ? (
                // ── File selected state ──────────────────────────────────────
                <div className='dropzone dropzone--selected'>
                    <span className='dropzone__icon dropzone__icon--success'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 12 18 15 15"/><line x1="12" y1="18" x2="12" y2="11"/></svg>
                    </span>
                    <p className='dropzone__title dropzone__filename'>{selectedFile.name}</p>
                    <p className='dropzone__subtitle'>{(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready to upload</p>
                    <div className='dropzone__actions'>
                        <button className='dropzone__btn dropzone__btn--change' onClick={openFilePicker} type='button'>
                            Change File
                        </button>
                        <button className='dropzone__btn dropzone__btn--remove' onClick={handleRemove} type='button'>
                            Remove
                        </button>
                    </div>
                    <input
                        ref={resumeInputRef}
                        hidden
                        type='file'
                        id='resume'
                        name='resume'
                        accept='.pdf,application/pdf'
                        onChange={handleInputChange}
                    />
                </div>
            ) : (
                // ── Empty / drag-active state ────────────────────────────────
                <div
                    className={`dropzone ${dragActive ? 'dropzone--drag-active' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={openFilePicker}
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openFilePicker()}
                >
                    <span className='dropzone__icon'>
                        {dragActive ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                        )}
                    </span>
                    <p className='dropzone__title'>
                        {dragActive ? 'Drop your file here' : 'Click to upload or drag & drop'}
                    </p>
                    <p className='dropzone__subtitle'>PDF only (Max 5MB)</p>
                    <input
                        ref={resumeInputRef}
                        hidden
                        type='file'
                        id='resume'
                        name='resume'
                        accept='.pdf,application/pdf'
                        onChange={handleInputChange}
                    />
                </div>
            )}
        </div>
    )
}


export default Home
