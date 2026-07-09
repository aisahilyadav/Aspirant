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
  const filteredNotes = notes.filter(n => {
    const titleMatch = n.title.toLowerCase().includes(search.toLowerCase());
    const strippedContent = n.content ? n.content.replace(/<[^>]*>/g, '').toLowerCase() : '';
    const contentMatch = strippedContent.includes(search.toLowerCase());
    return titleMatch || contentMatch;
  });

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
    <div className="flex h-screen pt-16 bg-[#030303] text-white overflow-hidden font-sans">
      
      {/* 1. Left Panel: Note List */}
      <div className="w-80 border-r border-white/10 flex flex-col flex-shrink-0 bg-[#030303]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">My Notes</h2>
          <button 
            onClick={handleCreateNote}
            className="p-2 bg-white hover:bg-gray-150 text-black rounded-lg transition-colors flex items-center justify-center shadow-md shadow-white/5"
            title="Create Note"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-white/20 text-white transition-colors"
            />
          </div>
        </div>

        {/* List of notes */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              No notes found
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNote?._id === note._id;
              const strippedContent = note.content ? note.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() : '';
              const previewText = strippedContent 
                ? strippedContent.substring(0, 60) + (strippedContent.length > 60 ? '...' : '') 
                : 'Empty note';
              const dateString = new Date(note.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={note._id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all duration-200 group flex justify-between items-start ${
                    isSelected 
                      ? 'bg-white text-black font-extrabold shadow-md shadow-white/5' 
                      : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className={`font-bold text-xs truncate ${isSelected ? 'text-black font-extrabold' : 'text-white'}`}>
                      {note.title || 'Untitled Note'}
                    </h3>
                    <p className={`text-[11px] mt-1 truncate ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                      {previewText}
                    </p>
                    <span className={`text-[9px] font-mono mt-2 block ${isSelected ? 'text-gray-650' : 'text-gray-550'}`}>
                      {dateString}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteNote(note._id, e)}
                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 ${
                      isSelected 
                        ? 'hover:bg-gray-200 text-gray-700' 
                        : 'hover:bg-white/5 text-gray-400 hover:text-red-400'
                    }`}
                    title="Delete Note"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Middle Panel: Editor */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#030303]">
        {selectedNote ? (
          <>
            {/* Editor Top Bar (Auto-save status) */}
            <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.005]">
              <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-wider">
                {saveStatus === 'saving' && (
                  <>
                    <FiLoader className="animate-spin text-purple-400 w-3.5 h-3.5" />
                    <span className="text-gray-500">SAVING...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <FiCheck className="text-green-400 w-3.5 h-3.5" />
                    <span className="text-gray-500">CHANGES SAVED</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <span className="text-red-500">SAVING FAILED</span>
                  </>
                )}
              </div>
              
              {/* Toggle Study Panel Button */}
              <button
                onClick={() => setAiPanelOpen(!aiPanelOpen)}
                className="flex items-center text-[10px] font-extrabold uppercase tracking-widest text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                {aiPanelOpen ? (
                  <>
                    <span>Hide Assistant</span>
                    <FiChevronRight className="w-3 h-3 ml-1" />
                  </>
                ) : (
                  <>
                    <FiBookOpen className="w-3 h-3 mr-1" />
                    <span>Open Study Panel</span>
                    <FiChevronLeft className="w-3 h-3 ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Formatting Toolbar */}
            <div className="px-6 py-2 border-b border-white/10 flex flex-wrap items-center gap-1 bg-[#030303]">
              {/* Headings */}
              <button
                onClick={() => applyFormat('formatBlock', '<h1>')}
                className="p-1.5 hover:bg-white/5 rounded text-xs font-bold text-gray-300 hover:text-white"
                title="Heading 1"
              >
                H1
              </button>
              <button
                onClick={() => applyFormat('formatBlock', '<h2>')}
                className="p-1.5 hover:bg-white/5 rounded text-xs font-bold text-gray-300 hover:text-white"
                title="Heading 2"
              >
                H2
              </button>
              <button
                onClick={() => applyFormat('formatBlock', '<p>')}
                className="p-1.5 hover:bg-white/5 rounded text-xs font-semibold text-gray-500 hover:text-white"
                title="Normal Text"
              >
                Normal
              </button>

              <div className="w-[1px] h-4 bg-white/10 mx-1" />

              {/* Text formatting */}
              <button
                onClick={() => applyFormat('bold')}
                className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                title="Bold"
              >
                <FiBold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => applyFormat('italic')}
                className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                title="Italic"
              >
                <FiItalic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => applyFormat('underline')}
                className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                title="Underline"
              >
                <FiUnderline className="w-3.5 h-3.5" />
              </button>

              <div className="w-[1px] h-4 bg-white/10 mx-1" />

              {/* Lists and Indents */}
              <button
                onClick={() => applyFormat('insertUnorderedList')}
                className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                title="Bulleted List"
              >
                <FiList className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => applyFormat('indent')}
                className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                title="Indent"
              >
                <FiChevronsRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => applyFormat('outdent')}
                className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                title="Outdent"
              >
                <FiChevronsLeft className="w-3.5 h-3.5" />
              </button>

              <div className="w-[1px] h-4 bg-white/10 mx-1" />

              {/* Highlight */}
              <button
                onClick={() => applyFormat('backColor', '#a855f7')}
                className="p-1 px-2 hover:bg-purple-950/30 rounded text-purple-300 font-bold text-xs"
                title="Highlight Purple"
              >
                Highlight
              </button>

              <div className="w-[1px] h-4 bg-white/10 mx-1" />

              {/* Text Colors */}
              <div className="flex items-center gap-1 border border-white/10 rounded p-1">
                <button
                  onClick={() => applyFormat('foreColor', '#ffffff')}
                  className="w-3 h-3 rounded-full bg-white border border-white/20"
                  title="White"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#f87171')}
                  className="w-3 h-3 rounded-full bg-red-400"
                  title="Light Red"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#60a5fa')}
                  className="w-3 h-3 rounded-full bg-blue-400"
                  title="Light Blue"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#4ade80')}
                  className="w-3 h-3 rounded-full bg-green-400"
                  title="Light Green"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#c084fc')}
                  className="w-3 h-3 rounded-full bg-purple-400"
                  title="Light Purple"
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
                className="w-full text-3xl font-extrabold border-none outline-none focus:ring-0 bg-transparent text-white placeholder-gray-700"
              />
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                className="w-full flex-1 border-none outline-none focus:ring-0 text-gray-300 leading-relaxed text-base rich-editor min-h-[300px]"
                data-placeholder="Write your study notes here..."
              />
            </div>
            
            <style>{`
              .rich-editor h1 {
                font-size: 1.875rem;
                font-weight: 800;
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
                color: #ffffff;
              }
              .rich-editor h2 {
                font-size: 1.5rem;
                font-weight: 700;
                margin-top: 1.25rem;
                margin-bottom: 0.5rem;
                color: #ffffff;
              }
              .rich-editor p {
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                line-height: 1.625;
                color: #d1d5db;
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
            className="border-l border-white/10 flex flex-col flex-shrink-0 bg-[#030303] h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-[#030303]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center">
                <FiBookOpen className="mr-2 w-4 h-4" />
                PDF Study Assistant
              </h3>
            </div>

            {/* If no PDF attached */}
            {!selectedNote.pdfId ? (
              <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-400 border border-blue-500/15 rounded-2xl flex items-center justify-center mb-4">
                  <FiUpload className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-white text-sm mb-1 uppercase tracking-wider">Attach Study PDF</h4>
                <p className="text-xs text-gray-500 mb-6 max-w-xs leading-normal">
                  Upload a PDF textbook, lecture, or syllabus to summarize it and chat with it.
                </p>

                <label className="cursor-pointer inline-flex items-center bg-white hover:bg-gray-150 text-black font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md transition-all">
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
                <div className="p-3 bg-green-500/10 border-b border-green-500/15 flex items-center justify-between text-green-300">
                  <div className="flex items-center min-w-0 pr-2">
                    <FiFileText className="text-green-400 w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs font-semibold truncate">
                      {selectedNote.pdfId.filename}
                    </span>
                  </div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-green-300 bg-white/5 hover:bg-white/10 border border-green-500/20 rounded-md px-2 py-1 cursor-pointer transition-colors">
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
                <div className="flex border-b border-white/10 bg-[#030303] text-[10px] font-extrabold uppercase tracking-wider">
                  <button
                    onClick={() => setAiTab('summary')}
                    className={`flex-1 py-3.5 text-center border-b-2 transition-all ${
                      aiTab === 'summary' 
                        ? 'border-white text-white' 
                        : 'border-transparent text-gray-500 hover:text-white'
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setAiTab('chat')}
                    className={`flex-1 py-3.5 text-center border-b-2 transition-all ${
                      aiTab === 'chat' 
                        ? 'border-white text-white' 
                        : 'border-transparent text-gray-500 hover:text-white'
                    }`}
                  >
                    Chat Assistant
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#030303]">
                  
                  {/* Summary Tab */}
                  {aiTab === 'summary' && (
                    <div className="flex-1 overflow-y-auto p-4 bg-[#030303]">
                      {selectedNote.summary ? (
                        <div className="space-y-4">
                          <div 
                            className="prose prose-invert prose-sm text-xs text-gray-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote.summary) }}
                          />
                          <button
                            onClick={handleSummarizePdf}
                            disabled={summarizing}
                            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-colors flex items-center justify-center mt-6"
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
                          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 border border-purple-500/15 rounded-full flex items-center justify-center mb-3">
                            <FiBookOpen className="w-5 h-5" />
                          </div>
                          <h5 className="font-extrabold text-white text-sm mb-1 uppercase tracking-wider">Generate PDF Summary</h5>
                          <p className="text-xs text-gray-500 mb-6 max-w-xs">
                            Generate a study outline covering key concepts, takeaways, and outlines.
                          </p>
                          <button
                            onClick={handleSummarizePdf}
                            disabled={summarizing}
                            className="bg-white hover:bg-gray-150 text-black font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center"
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
                    <div className="flex-1 flex flex-col overflow-hidden bg-[#030303]">
                      
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {activeChat.length === 0 ? (
                          <div className="text-center py-12 text-gray-500 text-xs font-medium leading-relaxed">
                            Ask me anything about the content of <br />
                            <span className="font-semibold text-gray-400">{selectedNote.pdfId.filename}</span>.
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
                                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                                    isUser
                                      ? 'bg-white text-black font-semibold rounded-tr-none'
                                      : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'
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
                            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3 text-xs flex items-center space-x-2 text-gray-400 shadow-md">
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
                        className="p-3 bg-[#030303] border-t border-white/10 flex items-center space-x-2"
                      >
                        <input
                          type="text"
                          placeholder="Ask a question about the PDF..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          disabled={chatLoading}
                          className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={chatLoading || !chatInput.trim()}
                          className="p-2.5 bg-white hover:bg-gray-150 text-black rounded-xl disabled:opacity-40 disabled:hover:bg-white transition-colors flex items-center justify-center flex-shrink-0 shadow-md"
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
