import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadPdf, generateQuiz } from '../api/quizApi';
import UploadPdfForm from '../components/UploadPdfForm';
import QuizConfigForm from '../components/QuizConfigForm';
import { FiUpload, FiArrowRight, FiCheck, FiLoader } from 'react-icons/fi';

export default function PreQuiz() {
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const res = await uploadPdf(file);
      if (res.pdfId) {
        setPdfData(res);
        setTimeout(() => {
          setCurrentStep(2);
        }, 1000);
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload PDF. Please try again.');
    }
    setLoading(false);
  };

  const handleGenerateQuiz = async (topic, numQuestions) => {
    if (!pdfData) return alert('Upload PDF first!');
    setLoading(true);
    try {
      const res = await generateQuiz(pdfData.pdfId, topic, numQuestions);
      if (res.quizId && res.questions) {
        localStorage.setItem(`quiz_${res.quizId}`, JSON.stringify(res.questions));
        navigate(`/quiz/${res.quizId}`);
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      alert('Failed to generate quiz. Please try again.');
    }
    setLoading(false);
  };

  const goToStep = (step) => {
    if (step === 2 && !pdfData) {
      alert('Please upload a PDF first');
      return;
    }
    setCurrentStep(step);
  };

  const resetUpload = () => {
    setPdfData(null);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-app)] pt-24 pb-12 px-6 font-sans relative overflow-x-hidden select-none text-left transition-colors duration-300">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3 pb-4">
          <span className="text-[10px] font-mono font-black tracking-widest text-[#F8C537] uppercase bg-stone-900 border-2 border-stone-800 px-3.5 py-1.5 rounded-lg inline-block">
            [ Active Recall Generator ]
          </span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black text-[var(--text-app)] tracking-tight leading-none uppercase">
            Create AI <span className="text-[#c084fc]">Study Quiz</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-bold max-w-xl mx-auto leading-relaxed mt-2">
            Upload your lecture notes, textbook chapters, or reference PDFs and watch AI output challenging recall quizzes.
          </p>
        </div>

        {/* Neo-brutalist Progress Steps */}
        <div className="flex items-center justify-center py-4 select-none">
          <div className="flex items-center space-x-6">
            
            {/* Step 1 */}
            <div className="flex items-center">
              <button
                onClick={() => goToStep(1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2 border-stone-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] active:translate-x-[1px] active:translate-y-[1px] text-xs font-black ${
                  currentStep === 1
                    ? 'bg-[#F8C537] text-stone-950'
                    : pdfData
                    ? 'bg-[#22c55e] text-stone-950'
                    : 'bg-stone-900 text-stone-400'
                }`}
              >
                {pdfData ? <FiCheck className="w-5 h-5 stroke-[3]" /> : '1'}
              </button>
              <span className={`ml-3 text-xs uppercase tracking-widest font-black font-mono ${
                currentStep === 1
                  ? 'text-[var(--text-app)]'
                  : pdfData
                  ? 'text-[#22c55e]'
                  : 'text-stone-500'
              }`}>
                Upload PDF
              </span>
            </div>

            {/* Arrow */}
            <FiArrowRight className={`w-5 h-5 ${pdfData ? 'text-[#22c55e]' : 'text-stone-600'}`} />

            {/* Step 2 */}
            <div className="flex items-center">
              <button
                onClick={() => goToStep(2)}
                disabled={!pdfData}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2 border-stone-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] active:translate-x-[1px] active:translate-y-[1px] text-xs font-black ${
                  currentStep === 2
                    ? 'bg-[#F8C537] text-stone-950'
                    : pdfData
                    ? 'bg-stone-900 text-stone-400'
                    : 'bg-stone-950 text-stone-600 cursor-not-allowed border-stone-850'
                }`}
              >
                2
              </button>
              <span className={`ml-3 text-xs uppercase tracking-widest font-black font-mono ${
                currentStep === 2
                  ? 'text-[var(--text-app)]'
                  : 'text-stone-500'
              }`}>
                Configure Quiz
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          
          {/* Step 1: Upload PDF */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#FAF9F6] text-stone-950 rounded-3xl border-3 border-stone-900 p-8 shadow-[6px_6px_0px_0px_#60a5fa]">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white border-2 border-stone-900 rounded-2xl flex items-center justify-center mr-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    <FiUpload className="w-6 h-6 text-stone-950" />
                  </div>
                  <div>
                    <h3 className="text-lg font-sans font-black text-stone-950 uppercase tracking-tight leading-none">Select Document</h3>
                    <p className="text-xs text-stone-600 font-bold font-sans mt-1">Pick a PDF to feed the recall generator</p>
                  </div>
                </div>
                
                <UploadPdfForm onUpload={handleUpload} loading={loading} />
                
                {/* PDF Upload Success */}
                {pdfData && !loading && (
                  <div className="mt-6 p-4 bg-[#d3ffd0] border-2 border-stone-900 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center">
                        <FiCheck className="w-5 h-5 text-green-800 mr-3 flex-shrink-0 stroke-[3]" />
                        <div>
                          <p className="text-xs font-black text-stone-950 uppercase tracking-wide">
                            PDF Uploaded Successfully!
                          </p>
                          <p className="text-[10px] text-stone-800 font-bold">
                            Outline parsed and cached. Ready to run generative prompts.
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 w-full sm:w-auto font-mono text-[10px] font-black uppercase tracking-wider">
                        <button
                          onClick={resetUpload}
                          className="flex-1 sm:flex-none bg-white border-2 border-stone-900 text-stone-950 px-3 py-1.5 rounded-xl hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
                        >
                          Change File
                        </button>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="flex-1 sm:flex-none bg-stone-900 text-white border-2 border-stone-950 px-4 py-1.5 rounded-xl hover:translate-y-[-1px] active:translate-y-[1px] transition-all flex items-center justify-center"
                        >
                          Next
                          <FiArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="mt-6 p-6 bg-white border-2 border-dashed border-stone-400 rounded-2xl">
                    <div className="flex items-center justify-center space-x-4">
                      <FiLoader className="animate-spin text-stone-950 w-6 h-6" />
                      <div>
                        <p className="text-xs font-black text-stone-950 uppercase tracking-wide">
                          Processing your PDF...
                        </p>
                        <p className="text-[10px] text-stone-500 font-bold mt-0.5">
                          Parsing file stream and indexing text embeddings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#FFE066]">
                <h4 className="font-mono font-black text-stone-950 text-base mb-3 uppercase tracking-wider">Study Tips</h4>
                <ul className="space-y-2 text-xs text-stone-800 font-bold font-sans">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-stone-900 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>Use scanned books or academic papers with clear text formatting for accurate parsing.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-stone-900 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>Keep files under 10MB to maintain speed when querying embeddings.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-stone-900 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                    <span>Syllabi, slide summaries, and study guides output outstanding questions.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Configure Quiz */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <div className="bg-[#FAF9F6] text-stone-950 rounded-3xl border-3 border-stone-900 p-8 shadow-[6px_6px_0px_0px_#c084fc]">
                <QuizConfigForm onGenerate={handleGenerateQuiz} loading={loading} />
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
