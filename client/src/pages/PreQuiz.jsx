import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadPdf, generateQuiz } from '../api/quizApi';
import UploadPdfForm from '../components/UploadPdfForm';
import QuizConfigForm from '../components/QuizConfigForm';
import { FiUpload, FiFileText, FiArrowRight, FiCheck, FiArrowLeft } from 'react-icons/fi';

// Simple Loader Component
const LoaderOne = () => (
  <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
);

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
        // Auto-advance to next step after successful upload
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
        // Save quiz in localStorage (so QuizPage can load)
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
            <FiFileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Quiz
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your PDF document and generate personalized quizzes powered by AI
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-8">
            {/* Step 1 */}
            <div className="flex items-center">
              <button
                onClick={() => goToStep(1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-black text-white'
                    : pdfData
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {pdfData ? <FiCheck className="w-5 h-5" /> : '1'}
              </button>
              <span className={`ml-3 text-sm font-medium ${
                currentStep === 1
                  ? 'text-gray-900'
                  : pdfData
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}>
                Upload PDF
              </span>
            </div>

            {/* Arrow */}
            <FiArrowRight className={`w-5 h-5 ${pdfData ? 'text-green-500' : 'text-gray-300'}`} />

            {/* Step 2 */}
            <div className="flex items-center">
              <button
                onClick={() => goToStep(2)}
                disabled={!pdfData}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  currentStep === 2
                    ? 'bg-black text-white'
                    : pdfData
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                2
              </button>
              <span className={`ml-3 text-sm font-medium ${
                currentStep === 2
                  ? 'text-gray-900'
                  : pdfData
                  ? 'text-gray-600'
                  : 'text-gray-500'
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <FiUpload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Upload Document</h3>
                    <p className="text-gray-600">Select your PDF file to get started</p>
                  </div>
                </div>
                
                <UploadPdfForm onUpload={handleUpload} loading={loading} />
                
                {/* PDF Upload Success */}
                {pdfData && !loading && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiCheck className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            PDF uploaded successfully!
                          </p>
                          <p className="text-sm text-green-600">
                            Ready to generate quiz questions
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={resetUpload}
                          className="text-sm bg-white border border-green-300 text-green-700 px-3 py-1 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          Upload Different File
                        </button>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-sm bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          Next Step
                          <FiArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-center space-x-4">
                      <LoaderOne />
                      <div className="text-center">
                        <p className="text-sm font-medium text-blue-900">
                          Processing your PDF...
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          This may take a few moments
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Tips */}
              <div className="bg-gray-100 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Upload Tips</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Use PDFs with clear, readable text for best results</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Recommended file size: under 10MB</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Academic papers, textbooks, and study materials work great</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Configure Quiz */}
          {currentStep === 2 && pdfData && (
            <div className="space-y-6 animate-fade-in">
              {/* Back Button */}
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <FiArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Upload
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <FiFileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Configure Quiz</h3>
                    <p className="text-gray-600">Customize your quiz settings</p>
                  </div>
                </div>
                
                {/* Simple PDF Status */}
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <FiCheck className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">PDF ready</span>
                  </div>
                </div>
                
                <QuizConfigForm onGenerate={handleGenerateQuiz} loading={loading} />
              </div>

              {/* Quiz Features */}
              <div className="bg-gradient-to-br from-black to-gray-800 rounded-xl p-6 text-white">
                <h4 className="font-semibold mb-4 flex items-center">
                  <FiCheck className="w-5 h-5 mr-2" />
                  What's Included
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-3"></div>
                    <span>AI-generated questions from your content</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-3"></div>
                    <span>Multiple choice format with explanations</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-3"></div>
                    <span>Instant scoring and detailed feedback</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-3"></div>
                    <span>Progress tracking and analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Single Global Loading Overlay - Only for Quiz Generation */}
        {loading && currentStep === 2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
              <LoaderOne className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generating Quiz...
              </h3>
              <p className="text-gray-600 text-sm">
                AI is analyzing your PDF and creating personalized questions
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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
