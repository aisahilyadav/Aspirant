import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiBookOpen, 
  FiFileText, 
  FiTrash2, 
  FiUpload, 
  FiMessageSquare, 
  FiLoader, 
  FiCheck, 
  FiSave, 
  FiChevronLeft, 
  FiChevronRight,
  FiSend,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiChevronsLeft,
  FiChevronsRight
} from 'react-icons/fi';
import { 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  uploadNotePdf, 
  summarizeNotePdf, 
  chatNotePdf 
} from '../api/noteApi';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Editor state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  
  const editorRef = useRef(null);

  // AI Study panel state
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [aiTab, setAiTab] = useState('summary'); // 'summary' or 'chat'
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState({}); // noteId -> array of messages
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Load notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.notes);
      if (res.notes.length > 0 && !selectedNote) {
        handleSelectNote(res.notes[0]);
      }
    } catch (err) {
      console.error('Fetch notes error:', err);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setSaveStatus('saved');
    if (editorRef.current) {
      editorRef.current.innerHTML = note.content || '';
    }
  };

  // Sync editor content when selected note changes
  useEffect(() => {
    if (editorRef.current && selectedNote) {
      if (editorRef.current.innerHTML !== selectedNote.content) {
        editorRef.current.innerHTML = selectedNote.content || '';
      }
    }
  }, [selectedNote?._id]);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Debounced auto-save note text content
  useEffect(() => {
    if (!selectedNote) return;
    
    // Don't auto-save if local states match current note data
    if (title === selectedNote.title && content === selectedNote.content) {
      setSaveStatus('saved');
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const res = await updateNote(selectedNote._id, { title, content });
        // Update local list
        setNotes(prev => prev.map(n => n._id === res.note._id ? res.note : n));
        // Keep selectedNote record in sync
        setSelectedNote(res.note);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save error:', err);
        setSaveStatus('error');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content]);

  // Create note
  const handleCreateNote = async () => {
    try {
      const res = await createNote({ title: 'Untitled Note', content: '' });
      setNotes(prev => [res.note, ...prev]);
      handleSelectNote(res.note);
    } catch (err) {
      console.error('Create note error:', err);
      alert('Failed to create note.');
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await deleteNote(noteId);
      setNotes(prev => prev.filter(n => n._id !== noteId));
      if (selectedNote?._id === noteId) {
        setSelectedNote(null);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      console.error('Delete note error:', err);
      alert('Failed to delete note.');
    }
  };

  // Upload PDF
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedNote) return;

    setUploadingPdf(true);
    try {
      const res = await uploadNotePdf(selectedNote._id, file);
      // Update note in list
      setNotes(prev => prev.map(n => n._id === res.note._id ? res.note : n));
      setSelectedNote(res.note);
      alert('PDF uploaded and processed successfully!');
    } catch (err) {
      console.error('PDF upload error:', err);
      alert(err.message || 'Failed to upload PDF.');
    } finally {
      setUploadingPdf(false);
    }
  };

  // Summarize PDF
  const handleSummarizePdf = async () => {
    if (!selectedNote?.pdfId) return;

    setSummarizing(true);
    try {
      const res = await summarizeNotePdf(selectedNote._id);
      setNotes(prev => prev.map(n => n._id === res.note._id ? res.note : n));
      setSelectedNote(res.note);
    } catch (err) {
      console.error('Summarize error:', err);
      alert('Failed to generate summary.');
    } finally {
      setSummarizing(false);
    }
  };

  // Chat
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedNote?.pdfId || chatLoading) return;

    const userMsg = { role: 'user', content: chatInput };
    const currentNoteId = selectedNote._id;
    
    // Append user message locally
    setChatHistory(prev => ({
      ...prev,
      [currentNoteId]: [...(prev[currentNoteId] || []), userMsg]
    }));
    
    const queryText = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await chatNotePdf(selectedNote._id, queryText);
      const aiMsg = { role: 'assistant', content: res.answer };
      
      setChatHistory(prev => ({
        ...prev,
        [currentNoteId]: [...(prev[currentNoteId] || []), aiMsg]
      }));
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = { role: 'assistant', content: 'Sorry, I failed to get a response. Please try again.' };
      setChatHistory(prev => ({
        ...prev,
        [currentNoteId]: [...(prev[currentNoteId] || []), errorMsg]
      }));
    } finally {
      setChatLoading(false);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, selectedNote]);

  // Filter notes by search
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  // Markdown rendering helper
  const renderMarkdown = (text) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-md font-bold mt-4 mb-1 text-gray-900">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-5 mb-2 text-gray-900">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-6 mb-3 text-gray-900">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-gray-700 my-1">$1</li>');
    
    html = html.split('\n').map(line => {
      if (line.trim().startsWith('<h') || line.trim().startsWith('<li') || line.trim() === '') {
        return line;
      }
      return `<p class="text-gray-700 my-2 leading-relaxed text-sm">${line}</p>`;
    }).join('\n');

    return html;
  };

  const activeChat = chatHistory[selectedNote?._id] || [];

  return (
    <div className="flex h-screen pt-16 bg-white text-gray-800 overflow-hidden font-sans">
      
      {/* 1. Left Panel: Note List */}
      <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0 bg-gray-50/50">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">My Notes</h2>
          <button 
            onClick={handleCreateNote}
            className="p-2 bg-black hover:bg-gray-850 text-white rounded-lg transition-colors flex items-center justify-center shadow-sm"
            title="Create Note"
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-250 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>
        </div>

        {/* List of notes */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-450 text-sm">
              No notes found
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNote?._id === note._id;
              const previewText = note.content 
                ? note.content.substring(0, 60) + (note.content.length > 60 ? '...' : '') 
                : 'Empty note';
              const dateString = new Date(note.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={note._id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group flex justify-between items-start ${
                    isSelected 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {note.title || 'Untitled Note'}
                    </h3>
                    <p className={`text-xs mt-1 truncate ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                      {previewText}
                    </p>
                    <span className={`text-[10px] mt-2 block ${isSelected ? 'text-gray-400' : 'text-gray-450'}`}>
                      {dateString}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteNote(note._id, e)}
                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 ${
                      isSelected 
                        ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
                        : 'hover:bg-gray-200 text-gray-450 hover:text-red-650'
                    }`}
                    title="Delete Note"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Middle Panel: Editor */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selectedNote ? (
          <>
            {/* Editor Top Bar (Auto-save status) */}
            <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center space-x-2 text-xs">
                {saveStatus === 'saving' && (
                  <>
                    <FiLoader className="animate-spin text-blue-500 w-3.5 h-3.5" />
                    <span className="text-gray-500">Auto-saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <FiCheck className="text-green-500 w-3.5 h-3.5" />
                    <span className="text-gray-500">All changes saved</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <span className="text-red-500 font-medium">Saving failed. Retrying...</span>
                  </>
                )}
              </div>
              
              {/* Toggle Study Panel Button */}
              <button
                onClick={() => setAiPanelOpen(!aiPanelOpen)}
                className="flex items-center text-xs text-gray-500 hover:text-black font-semibold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {aiPanelOpen ? (
                  <>
                    <span>Hide Assistant</span>
                    <FiChevronRight className="w-3.5 h-3.5 ml-1" />
                  </>
                ) : (
                  <>
                    <FiBookOpen className="w-3.5 h-3.5 mr-1" />
                    <span>Open Study Panel</span>
                    <FiChevronLeft className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Formatting Toolbar */}
            <div className="px-6 py-2 border-b border-gray-200 flex flex-wrap items-center gap-1 bg-white">
              {/* Headings */}
              <button
                onClick={() => applyFormat('formatBlock', '<h1>')}
                className="p-1.5 hover:bg-gray-100 rounded text-xs font-bold text-gray-700"
                title="Heading 1"
              >
                H1
              </button>
              <button
                onClick={() => applyFormat('formatBlock', '<h2>')}
                className="p-1.5 hover:bg-gray-100 rounded text-xs font-bold text-gray-700"
                title="Heading 2"
              >
                H2
              </button>
              <button
                onClick={() => applyFormat('formatBlock', '<p>')}
                className="p-1.5 hover:bg-gray-100 rounded text-xs font-semibold text-gray-500"
                title="Normal Text"
              >
                Normal
              </button>

              <div className="w-[1px] h-4 bg-gray-300 mx-1" />

              {/* Text formatting */}
              <button
                onClick={() => applyFormat('bold')}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-700"
                title="Bold"
              >
                <FiBold className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormat('italic')}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-700"
                title="Italic"
              >
                <FiItalic className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormat('underline')}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-700"
                title="Underline"
              >
                <FiUnderline className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-gray-300 mx-1" />

              {/* Lists and Indents */}
              <button
                onClick={() => applyFormat('insertUnorderedList')}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-700"
                title="Bulleted List"
              >
                <FiList className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormat('indent')}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-700"
                title="Indent"
              >
                <FiChevronsRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormat('outdent')}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-700"
                title="Outdent"
              >
                <FiChevronsLeft className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-gray-300 mx-1" />

              {/* Highlight */}
              <button
                onClick={() => applyFormat('backColor', '#fef08a')}
                className="p-1 px-2 hover:bg-yellow-100 rounded text-yellow-800 font-bold text-xs"
                title="Highlight Yellow"
              >
                Highlight
              </button>

              <div className="w-[1px] h-4 bg-gray-300 mx-1" />

              {/* Text Colors */}
              <div className="flex items-center gap-1 border border-gray-200 rounded p-1">
                <button
                  onClick={() => applyFormat('foreColor', '#000000')}
                  className="w-3.5 h-3.5 rounded-full bg-black border border-gray-300"
                  title="Black"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#dc2626')}
                  className="w-3.5 h-3.5 rounded-full bg-red-600"
                  title="Red"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#2563eb')}
                  className="w-3.5 h-3.5 rounded-full bg-blue-650"
                  title="Blue"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#16a34a')}
                  className="w-3.5 h-3.5 rounded-full bg-green-600"
                  title="Green"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#9333ea')}
                  className="w-3.5 h-3.5 rounded-full bg-purple-600"
                  title="Purple"
                />
              </div>
            </div>

            {/* Editing Canvas */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto space-y-4">
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-extrabold border-none outline-none focus:ring-0 text-gray-900 placeholder-gray-300"
              />
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                className="w-full flex-1 border-none outline-none focus:ring-0 text-gray-700 leading-relaxed text-base rich-editor min-h-[300px]"
                data-placeholder="Write your study notes here..."
              />
            </div>
            
            <style>{`
              .rich-editor h1 {
                font-size: 1.875rem;
                font-weight: 800;
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
                color: #111827;
              }
              .rich-editor h2 {
                font-size: 1.5rem;
                font-weight: 700;
                margin-top: 1.25rem;
                margin-bottom: 0.5rem;
                color: #111827;
              }
              .rich-editor p {
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                line-height: 1.625;
                color: #374151;
              }
              .rich-editor ul {
                list-style-type: disc;
                margin-left: 1.25rem;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              .rich-editor ol {
                list-style-type: decimal;
                margin-left: 1.25rem;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              .rich-editor blockquote {
                border-left-width: 4px;
                border-color: #e5e7eb;
                padding-left: 1rem;
                font-style: italic;
                color: #4b5563;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              .rich-editor:empty:before {
                content: attr(data-placeholder);
                color: #d1d5db;
                cursor: text;
              }
            `}</style>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <FiFileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Note Selected</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Choose a note from the sidebar or click the plus button to create a new blank note.
            </p>
          </div>
        )}
      </div>

      {/* 3. Right Panel: AI PDF Study Assistant */}
      <AnimatePresence initial={false}>
        {selectedNote && aiPanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="border-l border-gray-200 flex flex-col flex-shrink-0 bg-gray-50 h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <FiBookOpen className="mr-2 w-4 h-4" />
                PDF & AI Assistant
              </h3>
            </div>

            {/* If no PDF attached */}
            {!selectedNote.pdfId ? (
              <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <FiUpload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Attach Study PDF</h4>
                <p className="text-xs text-gray-500 mb-6 max-w-xs leading-normal">
                  Upload a PDF textbook, lecture, or syllabus to summarize it and chat with it.
                </p>

                <label className="cursor-pointer inline-flex items-center bg-black hover:bg-gray-850 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all">
                  {uploadingPdf ? (
                    <>
                      <FiLoader className="animate-spin mr-2 w-3.5 h-3.5" />
                      <span>Processing PDF...</span>
                    </>
                  ) : (
                    <>
                      <FiUpload className="mr-2 w-3.5 h-3.5" />
                      <span>Choose PDF File</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    disabled={uploadingPdf}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              // If PDF is attached
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* PDF info bar */}
                <div className="p-3 bg-green-50 border-b border-green-100 flex items-center justify-between">
                  <div className="flex items-center min-w-0 pr-2">
                    <FiFileText className="text-green-600 w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs font-semibold text-green-800 truncate">
                      {selectedNote.pdfId.filename}
                    </span>
                  </div>
                  <label className="text-[10px] text-green-700 bg-white hover:bg-green-100 font-bold border border-green-200 rounded-md px-2 py-1 cursor-pointer transition-colors">
                    Replace
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-white text-xs font-semibold">
                  <button
                    onClick={() => setAiTab('summary')}
                    className={`flex-1 py-3 text-center border-b-2 transition-all ${
                      aiTab === 'summary' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setAiTab('chat')}
                    className={`flex-1 py-3 text-center border-b-2 transition-all ${
                      aiTab === 'chat' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    Chat Assistant
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  
                  {/* Summary Tab */}
                  {aiTab === 'summary' && (
                    <div className="flex-1 overflow-y-auto p-4 bg-white">
                      {selectedNote.summary ? (
                        <div className="space-y-4">
                          <div 
                            className="prose prose-sm text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote.summary) }}
                          />
                          <button
                            onClick={handleSummarizePdf}
                            disabled={summarizing}
                            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center mt-6"
                          >
                            {summarizing ? (
                              <>
                                <FiLoader className="animate-spin mr-2 w-3.5 h-3.5" />
                                <span>Regenerating Summary...</span>
                              </>
                            ) : (
                              <span>Regenerate Summary</span>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="py-12 text-center flex flex-col items-center justify-center">
                          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
                            <FiBookOpen className="w-5 h-5" />
                          </div>
                          <h5 className="font-bold text-gray-900 text-sm mb-1">Generate PDF Summary</h5>
                          <p className="text-xs text-gray-500 mb-6 max-w-xs">
                            Generate a study outline covering key concepts, takeaways, and outlines.
                          </p>
                          <button
                            onClick={handleSummarizePdf}
                            disabled={summarizing}
                            className="bg-black hover:bg-gray-850 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm transition-all flex items-center"
                          >
                            {summarizing ? (
                              <>
                                <FiLoader className="animate-spin mr-2 w-3.5 h-3.5" />
                                <span>Generating...</span>
                              </>
                            ) : (
                              <span>Generate Summary</span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chat Tab */}
                  {aiTab === 'chat' && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                      
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {activeChat.length === 0 ? (
                          <div className="text-center py-12 text-gray-450 text-xs">
                            Ask me anything about the content of <span className="font-semibold">{selectedNote.pdfId.filename}</span>.
                          </div>
                        ) : (
                          activeChat.map((msg, index) => {
                            const isUser = msg.role === 'user';
                            return (
                              <div
                                key={index}
                                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                                    isUser
                                      ? 'bg-black text-white rounded-tr-none'
                                      : 'bg-white text-gray-800 border border-gray-150 rounded-tl-none'
                                  }`}
                                >
                                  {msg.content}
                                </div>
                              </div>
                            );
                          })
                        )}
                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-gray-150 rounded-2xl rounded-tl-none p-3 text-xs flex items-center space-x-2 text-gray-500 shadow-sm">
                              <FiLoader className="animate-spin w-3.5 h-3.5" />
                              <span>Thinking...</span>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat Input */}
                      <form 
                        onSubmit={handleSendChat}
                        className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2"
                      >
                        <input
                          type="text"
                          placeholder="Ask a question about the PDF..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          disabled={chatLoading}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={chatLoading || !chatInput.trim()}
                          className="p-2.5 bg-black hover:bg-gray-850 text-white rounded-xl disabled:opacity-40 disabled:hover:bg-black transition-colors flex items-center justify-center flex-shrink-0 shadow-sm"
                        >
                          <FiSend className="w-3.5 h-3.5" />
                        </button>
                      </form>

                    </div>
                  )}

                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
