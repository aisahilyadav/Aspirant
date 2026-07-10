import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadPdf, generateQuiz } from '../api/quizApi';
import UploadPdfForm from '../components/UploadPdfForm';
import QuizConfigForm from '../components/QuizConfigForm';
import { FiUpload, FiFileText, FiArrowRight, FiCheck, FiArrowLeft, FiLoader } from 'react-icons/fi';

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
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pt-24 pb-12 px-6 font-sans relative overflow-x-hidden select-none text-left">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      {/* Handdrawn filter SVG */}
      <svg className="absolute w-0 h-0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="handdrawn" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3 pb-4">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[-1deg]">
            [ active recall generator ]
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-950 tracking-tight leading-none">
            Create AI Study Quiz
          </h1>
          <p className="text-xs sm:text-sm text-stone-605 max-w-xl mx-auto">
            Upload your lecture notes, textbook chapters, or reference PDFs and watch AI output challenging recall quizzes.
          </p>
        </div>

        {/* Neo-brutalist Progress Steps */}
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-6">
            
            {/* Step 1 */}
            <div className="flex items-center">
              <button
                onClick={() => goToStep(1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs font-bold ${
                  currentStep === 1
                    ? 'bg-[#F8C537] text-stone-950'
                    : pdfData
                    ? 'bg-[#2ECC71] text-stone-950'
                    : 'bg-white text-stone-600'
                }`}
              >
                {pdfData ? <FiCheck className="w-5 h-5" /> : '1'}
              </button>
              <span className={`ml-3 text-xs uppercase tracking-widest font-extrabold font-mono ${
                currentStep === 1
                  ? 'text-stone-950'
                  : pdfData
                  ? 'text-[#1e6128]'
                  : 'text-stone-600'
              }`}>
                Upload PDF
              </span>
            </div>

            {/* Arrow */}
            <FiArrowRight className={`w-5 h-5 ${pdfData ? 'text-[#1e6128]' : 'text-stone-400'}`} />

            {/* Step 2 */}
            <div className="flex items-center">
              <button
                onClick={() => goToStep(2)}
                disabled={!pdfData}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs font-bold ${
                  currentStep === 2
                    ? 'bg-[#F8C537] text-stone-950'
                    : pdfData
                    ? 'bg-white text-stone-600'
                    : 'bg-stone-200 text-stone-500 cursor-not-allowed border-stone-300'
                }`}
              >
                2
              </button>
              <span className={`ml-3 text-xs uppercase tracking-widest font-extrabold font-mono ${
                currentStep === 2
                  ? 'text-stone-950'
                  : 'text-stone-600'
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
              <div 
                className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-center mr-4">
                    <FiUpload className="w-6 h-6 text-stone-850" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif-cormorant font-bold text-stone-950">Select Document</h3>
                    <p className="text-xs text-stone-750 font-bold font-serif-cormorant">Pick a PDF to feed the recall generator</p>
                  </div>
                </div>
                
                <UploadPdfForm onUpload={handleUpload} loading={loading} />
                
                {/* PDF Upload Success */}
                {pdfData && !loading && (
                  <div className="mt-6 p-4 bg-[#EAF5E5] border-2 border-stone-900 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center">
                        <FiCheck className="w-5 h-5 text-green-700 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                            PDF Uploaded Successfully!
                          </p>
                          <p className="text-[10px] text-stone-850 font-bold">
                            Outline parsed and cached. Ready to run generative prompts.
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 w-full sm:w-auto">
                        <button
                          onClick={resetUpload}
                          className="flex-1 sm:flex-none text-xs bg-white border-2 border-stone-900 text-stone-900 px-3 py-1.5 rounded-xl hover:translate-y-[-1px] active:translate-y-[1px] transition-all font-bold uppercase tracking-wider"
                        >
                          Change File
                        </button>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="flex-1 sm:flex-none text-xs bg-stone-900 text-white border-2 border-stone-900 px-4 py-1.5 rounded-xl hover:translate-y-[-1px] active:translate-y-[1px] transition-all font-bold uppercase tracking-wider flex items-center justify-center"
                        >
                          Next
                          <FiArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="mt-6 p-6 bg-stone-50 border-2 border-dashed border-stone-400 rounded-2xl">
                    <div className="flex items-center justify-center space-x-4">
                      <FiLoader className="animate-spin text-stone-850 w-6 h-6" />
                      <div>
                        <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                          Processing your PDF...
                        </p>
                        <p className="text-[10px] text-stone-550 mt-0.5">
                          Parsing file stream and indexing text embeddings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Tips: Yellow Sticky Notepad */}
              <div 
                className="bg-[#FEF5D1] border-2 border-stone-900 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(28,25,23,1)]"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <h4 className="font-serif-cormorant font-bold text-stone-950 text-lg mb-3">Study Tips</h4>
                <ul className="space-y-2 text-xs text-stone-850 font-medium font-serif-cormorant">
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
          {currentStep === 2 && pdfData && (
            <div className="space-y-6 animate-fade-in">
              {/* Back Button */}
              <div className="flex items-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center text-xs font-extrabold uppercase tracking-widest text-stone-605 hover:text-stone-900 transition-colors group"
                >
                  <FiArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                  Back to Upload
                </button>
              </div>

              <div 
                className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <div className="flex items-center mb-6 border-b border-stone-150 pb-4">
                  <div className="w-12 h-12 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-center mr-4">
                    <FiFileText className="w-6 h-6 text-stone-850" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif-cormorant font-bold text-stone-950">Quiz Config</h3>
                    <p className="text-xs text-stone-500">Pick parameters to compile questions</p>
                  </div>
                </div>
                
                {/* PDF Status */}
                <div className="mb-6 p-3 bg-[#EAF5E5] border border-stone-250 rounded-xl flex items-center text-xs text-green-800 font-bold uppercase tracking-wide">
                  <FiCheck className="w-4 h-4 text-green-700 mr-2" />
                  <span>PDF indexed and ready</span>
                </div>
                
                <QuizConfigForm onGenerate={handleGenerateQuiz} loading={loading} />
              </div>

              {/* What's Included Card: Dark notebook folder */}
              <div 
                className="bg-stone-900 text-stone-100 border-2 border-stone-950 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <h4 className="font-bold text-xs uppercase tracking-widest mb-4 flex items-center">
                  <FiCheck className="w-4.5 h-4.5 mr-2 text-[#2ECC71]" />
                  Generative Features
                </h4>
                <ul className="space-y-3 text-xs text-stone-300 font-medium">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-[#F8C537] rounded-full mr-3"></span>
                    <span>Outputs 3 to 20 custom questions from your specific pages.</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-[#F8C537] rounded-full mr-3"></span>
                    <span>Appends instant scorecards and detailed AI explanations for options.</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-[#F8C537] rounded-full mr-3"></span>
                    <span>Caches questions locally so you can retry and index milestones.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Global Loading Overlay */}
        {loading && currentStep === 2 && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div 
              className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center border-2 border-stone-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <div className="flex justify-center mb-4">
                <FiLoader className="w-10 h-10 animate-spin text-stone-900" />
              </div>
              <h3 className="text-xl font-serif-cormorant font-bold text-stone-950 mb-2">
                Compiling Quiz...
              </h3>
              <p className="text-xs text-stone-605 leading-relaxed">
                Gemini is parsing your PDF text stream and writing multiple-choice questions.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
