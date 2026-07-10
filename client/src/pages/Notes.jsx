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
  FiChevronsRight,
  FiRotateCcw,
  FiRotateCw
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
        setNotes(prev => prev.map(n => n._id === res.note._id ? res.note : n));
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
    
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-md font-bold mt-4 mb-1 text-stone-900">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-5 mb-2 text-stone-900">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-6 mb-3 text-stone-900">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-stone-950">$1</strong>');
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-stone-850 my-1 font-serif-cormorant font-bold">$1</li>');
    
    html = html.split('\n').map(line => {
      if (line.trim().startsWith('<h') || line.trim().startsWith('<li') || line.trim() === '') {
        return line;
      }
      return `<p class="text-stone-800 my-2 leading-relaxed text-sm font-serif-cormorant font-bold">${line}</p>`;
    }).join('\n');

    return html;
  };

  const activeChat = chatHistory[selectedNote?._id] || [];

  return (
    <div className="flex h-screen pt-0 bg-[#FAF9F6] text-stone-900 overflow-hidden font-sans relative select-none">
      
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

      {/* 1. Left Panel: Note List */}
      <div 
        className="w-80 border-r border-stone-250/70 flex flex-col flex-shrink-0 bg-[#FDFBF6] z-10"
        style={{ filter: 'url(#handdrawn)' }}
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="space-y-0.5 text-left">
            <span className="font-handwritten text-xs text-stone-500 block rotate-[-1deg]">[ Index ]</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-950">Study Journal</h2>
          </div>
          <button 
            onClick={handleCreateNote}
            className="p-2.5 bg-[#F8C537] hover:bg-stone-900 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:text-white rounded-xl transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center"
            title="Create Note"
          >
            <FiPlus className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-stone-150">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3 text-stone-450 w-4 h-4" />
            <input
              type="text"
              placeholder="Search journals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 placeholder-stone-400 font-serif-cormorant font-bold transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* List of notes */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-stone-450 text-xs font-handwritten font-bold">
              * No journals found
            </div>
          ) : (
            filteredNotes.map((note, index) => {
              const isSelected = selectedNote?._id === note._id;
              const strippedContent = note.content ? note.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() : '';
              const previewText = strippedContent 
                ? strippedContent.substring(0, 60) + (strippedContent.length > 60 ? '...' : '') 
                : 'Empty journal';
              const dateString = new Date(note.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              });

              // Cycle distinct color tags on folders
              const colors = ['border-l-[#F26430]', 'border-l-[#2ECC71]', 'border-l-[#2C5EFA]', 'border-l-[#F8C537]'];
              const folderColor = colors[index % colors.length];

              return (
                <div
                  key={note._id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 group flex justify-between items-start border-l-4 ${folderColor} ${
                    isSelected 
                      ? 'bg-white border-2 border-stone-900 border-l-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-stone-950 font-extrabold' 
                      : 'hover:bg-stone-50 border border-stone-200 text-stone-605'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2 text-left">
                    <h3 className={`font-serif-cormorant font-bold text-sm truncate ${isSelected ? 'text-stone-950' : 'text-stone-850'}`}>
                      {note.title || 'Untitled Note'}
                    </h3>
                    <p className={`text-[10px] mt-1 truncate ${isSelected ? 'text-stone-750 font-medium' : 'text-stone-450 font-medium'}`}>
                      {previewText}
                    </p>
                    <span className={`text-[8px] font-mono mt-2 block ${isSelected ? 'text-stone-700' : 'text-stone-400'}`}>
                      {dateString}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteNote(note._id, e)}
                    className="p-1 rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 hover:bg-stone-100 hover:text-red-650"
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
      <div className="flex-1 flex flex-col min-w-0 z-0 text-left">
        {selectedNote ? (
          <>
            {/* Editor Top Bar */}
            <div 
              className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white/40 shadow-sm"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <div className="flex items-center space-x-2 text-[9px] font-mono font-bold tracking-widest uppercase">
                {saveStatus === 'saving' && (
                  <>
                    <FiLoader className="animate-spin text-stone-850 w-3.5 h-3.5" />
                    <span className="text-stone-500">SAVING NOTE...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <FiCheck className="text-green-700 w-3.5 h-3.5" />
                    <span className="text-stone-500">SAVED TO JOURNAL</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <span className="text-red-600">SAVING FAILED</span>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setAiPanelOpen(!aiPanelOpen)}
                className="flex items-center text-[9px] font-extrabold uppercase tracking-widest text-stone-750 hover:text-stone-950 bg-white hover:bg-stone-50 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none px-3.5 py-1.5 rounded-xl transition-all"
              >
                {aiPanelOpen ? (
                  <>
                    <span>Hide Assistant</span>
                    <FiChevronRight className="w-3.5 h-3.5 ml-1" />
                  </>
                ) : (
                  <>
                    <FiBookOpen className="w-3.5 h-3.5 mr-1" />
                    <span>Study Panel</span>
                    <FiChevronLeft className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Redesigned Formatting Toolbar Tray - Neo-brutalist Ring Binder Style */}
            <div className="px-6 py-3 border-b-2 border-stone-900 flex flex-wrap items-center gap-2 bg-[#FAF9F6] shadow-sm select-none">
              
              {/* Undo / Redo group */}
              <div className="flex items-center border border-stone-300 rounded-lg p-0.5 bg-white">
                <button
                  onClick={() => applyFormat('undo')}
                  className="p-1.5 hover:bg-stone-150 rounded text-stone-850 hover:text-stone-950 transition-colors"
                  title="Undo"
                >
                  <FiRotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('redo')}
                  className="p-1.5 hover:bg-stone-150 rounded text-stone-850 hover:text-stone-950 transition-colors"
                  title="Redo"
                >
                  <FiRotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-[1.5px] h-5 bg-stone-300 mx-0.5" />

              {/* Headings */}
              <div className="flex items-center border border-stone-300 rounded-lg p-0.5 bg-white">
                <button
                  onClick={() => applyFormat('formatBlock', '<h1>')}
                  className="px-2.5 py-1 hover:bg-stone-150 rounded text-[10px] font-mono font-black text-stone-850"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  onClick={() => applyFormat('formatBlock', '<h2>')}
                  className="px-2.5 py-1 hover:bg-stone-150 rounded text-[10px] font-mono font-black text-stone-850"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  onClick={() => applyFormat('formatBlock', '<p>')}
                  className="px-2.5 py-1 hover:bg-stone-150 rounded text-[10px] font-mono font-black text-stone-850"
                  title="Normal Text"
                >
                  TXT
                </button>
              </div>

              <div className="w-[1.5px] h-5 bg-stone-300 mx-0.5" />

              {/* Inline formatting group */}
              <div className="flex items-center border border-stone-300 rounded-lg p-0.5 bg-white">
                <button
                  onClick={() => applyFormat('bold')}
                  className="p-1.5 hover:bg-stone-150 rounded text-stone-850 hover:text-stone-950"
                  title="Bold"
                >
                  <FiBold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('italic')}
                  className="p-1.5 hover:bg-stone-150 rounded text-stone-850 hover:text-stone-950"
                  title="Italic"
                >
                  <FiItalic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('underline')}
                  className="p-1.5 hover:bg-stone-150 rounded text-stone-850 hover:text-stone-950"
                  title="Underline"
                >
                  <FiUnderline className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('strikeThrough')}
                  className="px-2 py-1.5 hover:bg-stone-150 rounded text-[10px] font-mono font-black text-stone-850 line-through"
                  title="Strike-through"
                >
                  S
                </button>
              </div>

              <div className="w-[1.5px] h-5 bg-stone-300 mx-0.5" />

              {/* Lists and Indents */}
              <div className="flex items-center border border-stone-300 rounded-lg p-0.5 bg-white">
                <button
                  onClick={() => applyFormat('insertUnorderedList')}
                  className="p-1.5 hover:bg-stone-150 rounded text-stone-850"
                  title="Bullet List"
                >
                  <FiList className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('insertOrderedList')}
                  className="px-2 py-1 hover:bg-stone-150 rounded text-[10px] font-mono font-black text-stone-850"
                  title="Numbered List"
                >
                  1.
                </button>
                <button
                  onClick={() => applyFormat('indent')}
                  className="p-1.5 hover:bg-stone-150 rounded text-stone-850"
                  title="Indent"
                >
                  <FiChevronsRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('outdent')}
                  className="p-1.5 hover:bg-stone-150 rounded text-stone-850"
                  title="Outdent"
                >
                  <FiChevronsLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-[1.5px] h-5 bg-stone-300 mx-0.5" />

              {/* Utility / Highlight */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => applyFormat('backColor', '#FEF5D1')}
                  className="px-3 py-1.5 bg-[#FEF5D1] hover:bg-stone-900 border border-stone-400 hover:text-white rounded-lg text-stone-950 font-mono font-bold text-[9px] uppercase tracking-wider transition-colors shadow-sm"
                  title="Highlight Text"
                >
                  Highlight
                </button>
                <button
                  onClick={() => applyFormat('insertHorizontalRule')}
                  className="px-2.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-[9px] font-mono font-bold text-stone-850"
                  title="Insert Divider Line"
                >
                  Line
                </button>
                <button
                  onClick={() => applyFormat('removeFormat')}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-red-50 hover:text-red-700 hover:border-red-300 border border-stone-300 rounded-lg text-[9px] font-mono font-bold text-stone-850"
                  title="Clear formatting"
                >
                  Clear
                </button>
              </div>

              <div className="w-[1.5px] h-5 bg-stone-300 mx-0.5" />

              {/* Text Colors */}
              <div className="flex items-center gap-1.5 border border-stone-300 bg-white rounded-lg p-1.5">
                <button
                  onClick={() => applyFormat('foreColor', '#1c1917')}
                  className="w-3 h-3 rounded-full bg-stone-900 border border-stone-400"
                  title="Dark"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#F26430')}
                  className="w-3 h-3 rounded-full bg-[#F26430]"
                  title="Orange"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#2C5EFA')}
                  className="w-3 h-3 rounded-full bg-[#2C5EFA]"
                  title="Blue"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#2ECC71')}
                  className="w-3 h-3 rounded-full bg-[#2ECC71]"
                  title="Green"
                />
              </div>
            </div>

            {/* Editing Canvas */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto space-y-4">
              <input
                type="text"
                placeholder="Journal Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-serif-cormorant font-bold border-none outline-none focus:ring-0 bg-transparent text-stone-950 placeholder-stone-350"
              />
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                className="w-full flex-1 border-none outline-none focus:ring-0 text-stone-900 font-serif-cormorant font-bold leading-relaxed text-lg rich-editor min-h-[300px]"
                data-placeholder="Write your study notes here..."
              />
            </div>
            
            <style>{`
              .rich-editor h1 {
                font-size: 1.875rem;
                font-family: Cormorant Garamond, serif;
                font-weight: 800;
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
                color: #1c1917;
              }
              .rich-editor h2 {
                font-size: 1.5rem;
                font-family: Cormorant Garamond, serif;
                font-weight: 700;
                margin-top: 1.25rem;
                margin-bottom: 0.5rem;
                color: #1c1917;
              }
              .rich-editor p {
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                line-height: 1.625;
                color: #292524;
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
                border-color: #1c1917;
                padding-left: 1rem;
                font-style: italic;
                color: #44403c;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              .rich-editor:empty:before {
                content: attr(data-placeholder);
                color: #a8a29e;
                cursor: text;
              }
            `}</style>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-50/20 text-center">
            <div className="w-16 h-16 bg-white border border-stone-200 rounded-full flex items-center justify-center mb-4 text-stone-400 shadow-sm">
              <FiFileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif-cormorant font-bold text-stone-900 mb-2">No Note Selected</h3>
            <p className="text-xs text-stone-500 max-w-xs">
              Choose a journal folder from the directory list or hit the plus button to create a new page.
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
            className="border-l border-stone-250/70 flex flex-col flex-shrink-0 bg-[#FDFBF6] h-full overflow-hidden z-10"
            style={{ filter: 'url(#handdrawn)' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-200 bg-[#FDFBF6] text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950 flex items-center">
                <FiBookOpen className="mr-2 w-4 h-4 text-[#D9866B]" />
                PDF Study Assistant
              </h3>
            </div>

            {/* If no PDF attached */}
            {!selectedNote.pdfId ? (
              <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                <div className="w-14 h-14 bg-stone-50 text-stone-800 border-2 border-stone-900 rounded-2xl flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <FiUpload className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="font-serif-cormorant font-bold text-stone-950 text-lg mb-1">Attach Study PDF</h4>
                <p className="text-xs text-stone-500 mb-6 max-w-xs leading-normal">
                  Upload a PDF outline or lecture slides to summarize and vectors-query the contents.
                </p>

                <label className="cursor-pointer inline-flex items-center bg-[#2C5EFA] hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-widest py-3 px-5 border-2 border-stone-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                  {uploadingPdf ? (
                    <>
                      <FiLoader className="animate-spin mr-2 w-3.5 h-3.5" />
                      <span>Indexing PDF...</span>
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
              <div className="flex-1 flex flex-col overflow-hidden text-left">
                {/* PDF info bar */}
                <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-stone-850">
                  <div className="flex items-center min-w-0 pr-2">
                    <FiFileText className="text-[#D9866B] w-4.5 h-4.5 mr-2 flex-shrink-0" />
                    <span className="text-xs font-bold font-serif-cormorant truncate">
                      {selectedNote.pdfId.filename}
                    </span>
                  </div>
                  <label className="text-[9px] uppercase tracking-widest font-extrabold text-stone-800 bg-white border border-stone-250 rounded-md px-2 py-1 cursor-pointer hover:bg-stone-900 hover:text-white transition-colors flex-shrink-0">
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

                {/* Overlapping divider tabs (yellow & blue index cards) */}
                <div className="flex border-b border-stone-200 bg-[#FDFBF6] text-[10px] font-mono font-bold uppercase tracking-wider">
                  <button
                    onClick={() => setAiTab('summary')}
                    className={`flex-1 py-3 text-center border-r border-stone-200 transition-all ${
                      aiTab === 'summary' 
                        ? 'bg-[#F8C537] text-stone-950 border-b-2 border-b-stone-900 font-extrabold' 
                        : 'text-stone-500 hover:bg-stone-50/50'
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setAiTab('chat')}
                    className={`flex-1 py-3 text-center transition-all ${
                      aiTab === 'chat' 
                        ? 'bg-[#2C5EFA] text-white border-b-2 border-b-stone-900 font-extrabold' 
                        : 'text-stone-500 hover:bg-stone-50/50'
                    }`}
                  >
                    Chat Assistant
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#FDFBF6]">
                  
                  {/* Summary Tab */}
                  {aiTab === 'summary' && (
                    <div className="flex-1 overflow-y-auto p-4">
                      {selectedNote.summary ? (
                        <div className="space-y-4">
                          <div 
                            className="prose prose-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote.summary) }}
                          />
                          <button
                            onClick={handleSummarizePdf}
                            disabled={summarizing}
                            className="w-full py-3 bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs font-extrabold uppercase tracking-widest transition-all mt-6"
                          >
                            {summarizing ? (
                              <div className="flex items-center justify-center">
                                <FiLoader className="animate-spin mr-2 w-4 h-4" />
                                <span>Generating...</span>
                              </div>
                            ) : (
                              <span>Regenerate Summary</span>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="py-12 text-center flex flex-col items-center justify-center">
                          <div className="w-12 h-12 bg-white border border-stone-200 rounded-full flex items-center justify-center mb-3 shadow-sm">
                            <FiBookOpen className="w-5 h-5 text-stone-700" />
                          </div>
                          <h5 className="font-serif-cormorant font-bold text-stone-950 text-base mb-1">Generate PDF Outline</h5>
                          <p className="text-xs text-stone-450 mb-6 max-w-xs font-handwritten">
                            Create a study outline covering key concepts and summaries.
                          </p>
                          <button
                            onClick={handleSummarizePdf}
                            disabled={summarizing}
                            className="bg-stone-850 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest py-3 px-5 rounded-xl transition-all shadow-sm flex items-center"
                          >
                            {summarizing ? (
                              <>
                                <FiLoader className="animate-spin mr-2 w-3.5 h-3.5" />
                                <span>Generating Summary...</span>
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
                    <div className="flex-1 flex flex-col overflow-hidden bg-[#FDFBF6]">
                      
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {activeChat.length === 0 ? (
                          <div className="text-center py-12 text-stone-400 text-xs font-handwritten font-bold">
                            * Ask me anything about the content of <br />
                            <span className="font-serif-cormorant text-stone-650 underline">{selectedNote.pdfId.filename}</span>.
                          </div>
                        ) : (
                          activeChat.map((msg, index) => {
                            const isUser = msg.role === 'user';
                            return (
                              <div
                                key={index}
                                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                              >
                                {isUser ? (
                                  <div className="max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed bg-stone-900 text-stone-100 shadow-sm rounded-tr-none font-sans font-medium">
                                    {msg.content}
                                  </div>
                                ) : (
                                  <div className="max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed bg-[#FEF5D1] text-stone-950 border-2 border-stone-900 rounded-tl-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-serif-cormorant font-bold">
                                    {msg.content}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-stone-50 border border-stone-200 rounded-2xl rounded-tl-none p-3 text-xs flex items-center space-x-2 text-stone-500 shadow-sm font-handwritten font-bold">
                              <FiLoader className="animate-spin w-3.5 h-3.5 text-stone-850" />
                              <span>Thinking...</span>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat Input form */}
                      <form 
                        onSubmit={handleSendChat}
                        className="p-3 bg-[#FDFBF6] border-t border-stone-200 flex items-center space-x-2"
                      >
                        <input
                          type="text"
                          placeholder="Ask a question about the PDF..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          disabled={chatLoading}
                          className="flex-1 bg-white border-2 border-stone-900 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-950 font-serif-cormorant font-bold shadow-sm"
                        />
                        <button
                          type="submit"
                          disabled={chatLoading || !chatInput.trim()}
                          className="p-2.5 bg-[#F26430] hover:bg-[#e05825] border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white rounded-xl disabled:opacity-40 disabled:hover:bg-[#F26430] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center flex-shrink-0"
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
