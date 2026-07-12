import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiBookOpen, 
  FiFileText, 
  FiTrash2, 
  FiUpload, 
  FiLoader, 
  FiCheck, 
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

  // AI Study panel state & adjustable width
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [aiPanelWidth, setAiPanelWidth] = useState(380); // adjustable width state
  const [aiTab, setAiTab] = useState('summary'); // 'summary' or 'chat'
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState({}); // noteId -> array of messages
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const isResizingRef = useRef(false);

  // Drag-to-resize study panel assistant mouse handle
  const startResizing = (mouseDownEvent) => {
    isResizingRef.current = true;
    mouseDownEvent.preventDefault();
    
    const handleMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = window.innerWidth - moveEvent.clientX;
      // Boundaries check: min 280px, max 700px
      if (newWidth > 280 && newWidth < 700) {
        setAiPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-5 mb-2 text-[#60a5fa]">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-6 mb-3 text-[#c084fc]">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-950">$1</strong>');
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-stone-800 my-1 font-mono font-bold">$1</li>');
    
    html = html.split('\n').map(line => {
      if (line.trim().startsWith('<h') || line.trim().startsWith('<li') || line.trim() === '') {
        return line;
      }
      return `<p class="text-stone-700 my-2 leading-relaxed text-sm font-sans font-semibold">${line}</p>`;
    }).join('\n');

    return html;
  };

  const activeChat = chatHistory[selectedNote?._id] || [];

  return (
    <div className="flex h-screen pt-0 bg-[#050408] text-[#FAF9F6] overflow-hidden font-sans relative select-none">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-[5%] right-[20%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[20%] w-[350px] h-[350px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />

      {/* 1. Left Panel: Note List Directory */}
      <div className="w-80 border-r-2 border-stone-850 flex flex-col flex-shrink-0 bg-[#121016] z-10 relative">
        
        {/* Header */}
        <div className="p-5 border-b-2 border-stone-850 flex items-center justify-between">
          <div className="space-y-0.5 text-left">
            <span className="text-[9px] font-mono font-black tracking-widest text-[#F26430] uppercase block rotate-[-1deg]">[ Index ]</span>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Study Journal</h2>
          </div>
          <button 
            onClick={handleCreateNote}
            className="p-2.5 bg-[#F8C537] hover:bg-stone-900 border-2 border-stone-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] text-stone-950 hover:text-white rounded-xl transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center"
            title="Create Note"
          >
            <FiPlus className="w-4.5 h-4.5 stroke-[3]" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-stone-850">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3 text-stone-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search journals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1c1917] border-2 border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-white placeholder-stone-600 focus:outline-none focus:border-[#60a5fa] transition-colors"
            />
          </div>
        </div>

        {/* List of notes folders */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-stone-600 text-xs font-mono font-bold">
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

              // Color mappings for border indicators
              const colors = ['border-l-[#F26430]', 'border-l-[#22c55e]', 'border-l-[#60a5fa]', 'border-l-[#F8C537]'];
              const folderColor = colors[index % colors.length];

              return (
                <div
                  key={note._id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 group flex justify-between items-start border-l-4 ${folderColor} ${
                    isSelected 
                      ? 'bg-[#FAF9F6] border-2 border-stone-950 border-l-4 shadow-[3px_3px_0px_0px_#c084fc] text-stone-950 font-extrabold' 
                      : 'bg-[#1c1917]/50 hover:bg-[#1c1917] border border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2 text-left">
                    <h3 className={`font-sans font-bold text-sm truncate ${isSelected ? 'text-stone-950' : 'text-white'}`}>
                      {note.title || 'Untitled Note'}
                    </h3>
                    <p className={`text-[10px] mt-1 truncate ${isSelected ? 'text-stone-605 font-bold' : 'text-stone-500'}`}>
                      {previewText}
                    </p>
                    <span className={`text-[8px] font-mono mt-2 block ${isSelected ? 'text-stone-500' : 'text-stone-600'}`}>
                      {dateString}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteNote(note._id, e)}
                    className="p-1 rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 hover:bg-stone-200 hover:text-red-600 text-stone-500"
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

      {/* 2. Middle Panel: Rich Text Editor Workspace */}
      <div className="flex-1 flex flex-col min-w-0 z-0 text-left bg-[#0C0A10] relative">
        {selectedNote ? (
          <>
            {/* Editor Top Bar */}
            <div className="px-6 py-4 border-b-2 border-stone-850 flex items-center justify-between bg-[#121016] shadow-sm">
              <div className="flex items-center space-x-2 text-[9px] font-mono font-black tracking-widest uppercase">
                {saveStatus === 'saving' && (
                  <>
                    <FiLoader className="animate-spin text-stone-400 w-3.5 h-3.5" />
                    <span className="text-stone-400">SAVING NOTE...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <FiCheck className="text-[#22c55e] w-3.5 h-3.5 stroke-[3]" />
                    <span className="text-stone-500">SAVED TO JOURNAL</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-500">SAVING FAILED</span>
                )}
              </div>
              
              <button
                onClick={() => setAiPanelOpen(!aiPanelOpen)}
                className="flex items-center text-[9px] font-mono font-black uppercase tracking-widest text-stone-950 bg-[#60a5fa] border-2 border-stone-950 shadow-[2.5px_2.5px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] px-3.5 py-1.5 rounded-xl transition-all"
              >
                {aiPanelOpen ? (
                  <>
                    <span>Hide Assistant</span>
                    <FiChevronRight className="w-3.5 h-3.5 ml-1 stroke-[3]" />
                  </>
                ) : (
                  <>
                    <FiBookOpen className="w-3.5 h-3.5 mr-1 stroke-[3]" />
                    <span>Study Panel</span>
                    <FiChevronLeft className="w-3.5 h-3.5 ml-1 stroke-[3]" />
                  </>
                )}
              </button>
            </div>

            {/* Formatting Toolbar */}
            <div className="px-6 py-3 border-b-2 border-stone-850 flex flex-wrap items-center gap-2 bg-[#18161f] select-none">
              
              {/* Undo / Redo */}
              <div className="flex items-center border-2 border-stone-900 rounded-lg p-0.5 bg-stone-900">
                <button
                  onClick={() => applyFormat('undo')}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-colors"
                  title="Undo"
                >
                  <FiRotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('redo')}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-colors"
                  title="Redo"
                >
                  <FiRotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Headings */}
              <div className="flex items-center border-2 border-stone-900 rounded-lg p-0.5 bg-stone-900">
                <button
                  onClick={() => applyFormat('formatBlock', '<h1>')}
                  className="px-2.5 py-1 hover:bg-stone-800 rounded text-[9px] font-mono font-black text-stone-300 hover:text-[#c084fc]"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  onClick={() => applyFormat('formatBlock', '<h2>')}
                  className="px-2.5 py-1 hover:bg-stone-800 rounded text-[9px] font-mono font-black text-stone-300 hover:text-[#60a5fa]"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  onClick={() => applyFormat('formatBlock', '<p>')}
                  className="px-2.5 py-1 hover:bg-stone-800 rounded text-[9px] font-mono font-black text-stone-300"
                  title="Normal Text"
                >
                  TXT
                </button>
              </div>

              {/* Inline Formatting */}
              <div className="flex items-center border-2 border-stone-900 rounded-lg p-0.5 bg-stone-900">
                <button
                  onClick={() => applyFormat('bold')}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300"
                  title="Bold"
                >
                  <FiBold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('italic')}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300"
                  title="Italic"
                >
                  <FiItalic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('underline')}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300"
                  title="Underline"
                >
                  <FiUnderline className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('strikeThrough')}
                  className="px-2 py-1.5 hover:bg-stone-800 rounded text-[9px] font-mono font-black text-stone-300 line-through"
                  title="Strike-through"
                >
                  S
                </button>
              </div>

              {/* Lists and Indents */}
              <div className="flex items-center border-2 border-stone-900 rounded-lg p-0.5 bg-stone-900">
                <button
                  onClick={() => applyFormat('insertUnorderedList')}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300"
                  title="Bullet List"
                >
                  <FiList className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('insertOrderedList')}
                  className="px-2 py-1 hover:bg-stone-800 rounded text-[9px] font-mono font-black text-stone-300"
                  title="Numbered List"
                >
                  1.
                </button>
                <button
                  onClick={() => applyFormat('indent')}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300"
                  title="Indent"
                >
                  <FiChevronsRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyFormat('outdent')}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300"
                  title="Outdent"
                >
                  <FiChevronsLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Highlights & Utility */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => applyFormat('backColor', '#FEF5D1')}
                  className="px-3 py-1.5 bg-[#FAF9F6] border-2 border-stone-900 rounded-lg text-stone-950 font-mono font-black text-[9px] uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  title="Highlight Text"
                >
                  Highlight
                </button>
                <button
                  onClick={() => applyFormat('removeFormat')}
                  className="px-2.5 py-1.5 bg-stone-900 border border-stone-850 hover:bg-red-950 hover:text-red-400 rounded-lg text-[9px] font-mono font-bold text-stone-400"
                  title="Clear formatting"
                >
                  Clear
                </button>
              </div>

              {/* Text Colors */}
              <div className="flex items-center gap-1.5 border-2 border-stone-900 bg-stone-900 rounded-lg p-1.5">
                <button
                  onClick={() => applyFormat('foreColor', '#FAF9F6')}
                  className="w-3 h-3 rounded-full bg-white border border-stone-600"
                  title="Light"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#F26430')}
                  className="w-3 h-3 rounded-full bg-[#F26430]"
                  title="Orange"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#60a5fa')}
                  className="w-3 h-3 rounded-full bg-[#60a5fa]"
                  title="Blue"
                />
                <button
                  onClick={() => applyFormat('foreColor', '#22c55e')}
                  className="w-3 h-3 rounded-full bg-[#22c55e]"
                  title="Green"
                />
              </div>
            </div>

            {/* Note Editor Area */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto space-y-4 bg-white/5 rounded-3xl m-4 border border-white/5 shadow-inner">
              <input
                type="text"
                placeholder="Journal Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-sans font-black border-none outline-none focus:ring-0 bg-transparent text-white placeholder-stone-800"
              />
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                className="w-full flex-1 border-none outline-none focus:ring-0 text-stone-200 font-sans font-bold leading-relaxed text-sm rich-editor min-h-[300px]"
                data-placeholder="Write your study notes here..."
              />
            </div>
            
            <style>{`
              .rich-editor h1 {
                font-size: 1.875rem;
                font-family: Outfit, sans-serif;
                font-weight: 900;
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
                color: #c084fc;
              }
              .rich-editor h2 {
                font-size: 1.5rem;
                font-family: Outfit, sans-serif;
                font-weight: 900;
                margin-top: 1.25rem;
                margin-bottom: 0.5rem;
                color: #60a5fa;
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
                border-color: #F26430;
                padding-left: 1rem;
                font-style: italic;
                color: #9ca3af;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              .rich-editor:empty:before {
                content: attr(data-placeholder);
                color: #4b5563;
                cursor: text;
              }
            `}</style>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#050408]/40 text-center">
            
            {/* Cute Mascot Study Doodle for empty state */}
            <svg className="w-24 h-24 text-stone-600 stroke-[2.2] mb-4" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <path d="M 25 75 L 75 75 L 68 35 C 65 30, 35 30, 32 35 Z" fill="#1c1917" />
              <path d="M 32 35 C 30 25, 45 22, 50 32 C 55 22, 70 25, 68 35" fill="#FAF9F6" />
              <circle cx="43" cy="45" r="1.5" fill="black" stroke="none" />
              <circle cx="57" cy="45" r="1.5" fill="black" stroke="none" />
              <path d="M 48 50 Q 50 54, 52 50" stroke="black" />
              <path d="M 20 75 L 80 75" strokeWidth="3.5" />
              <path d="M 25 75 L 20 85 M 75 75 L 80 85" strokeWidth="2.5" />
            </svg>

            <h3 className="text-lg font-sans font-black text-white mb-2 uppercase tracking-wide">No Note Selected</h3>
            <p className="text-xs text-stone-500 font-bold max-w-xs leading-relaxed">
              Choose a journal folder from the directory list or hit the plus button to create a new page.
            </p>
          </div>
        )}
      </div>

      {/* Resize handle bar: draggable to adjust AI panel width */}
      {selectedNote && aiPanelOpen && (
        <div 
          onMouseDown={startResizing}
          className="w-[6px] h-full cursor-col-resize hover:bg-[#c084fc] bg-stone-850 border-l border-r border-stone-800 transition-colors z-20 flex-shrink-0"
          title="Drag to resize Study Panel"
        />
      )}

      {/* 3. Right Panel: AI PDF Study Assistant (with adjustable width) */}
      <AnimatePresence initial={false}>
        {selectedNote && aiPanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: aiPanelWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="flex flex-col flex-shrink-0 bg-[#121016] h-full overflow-hidden z-10 border-l border-stone-850"
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-850 bg-[#121016] text-left flex items-center justify-between">
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-white flex items-center">
                <FiBookOpen className="mr-2 w-4 h-4 text-[#F8C537]" />
                PDF Study Assistant
              </h3>
            </div>

            {/* If no PDF attached */}
            {!selectedNote.pdfId ? (
              <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                <div className="w-14 h-14 bg-stone-900 text-white border-2 border-stone-950 rounded-2xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_#F26430]">
                  <FiUpload className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="font-sans font-black text-white text-base mb-1 uppercase tracking-wide">Attach Study PDF</h4>
                <p className="text-xs text-stone-500 mb-6 max-w-xs font-bold leading-normal">
                  Upload a PDF outline or lecture slides to summarize and vectors-query the contents.
                </p>

                <label className="cursor-pointer inline-flex items-center bg-[#F8C537] text-stone-950 font-black text-xs uppercase tracking-widest py-3 px-5 border-2 border-stone-950 rounded-xl shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all">
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
              <div className="flex-1 flex flex-col overflow-hidden text-left bg-[#121016]">
                {/* PDF info bar */}
                <div className="p-3.5 bg-stone-900 border-b border-stone-850 flex items-center justify-between text-stone-300">
                  <div className="flex items-center min-w-0 pr-2">
                    <FiFileText className="text-[#F26430] w-4.5 h-4.5 mr-2 flex-shrink-0" />
                    <span className="text-xs font-mono font-bold truncate">
                      {selectedNote.pdfId.filename}
                    </span>
                  </div>
                  <label className="text-[9px] uppercase tracking-widest font-black text-stone-950 bg-[#60a5fa] border-2 border-stone-950 rounded-md px-2 py-1 cursor-pointer hover:translate-y-[-0.5px] transition-transform">
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

                {/* Overlapping tabs */}
                <div className="flex border-b border-stone-850 bg-[#121016] text-[10px] font-mono font-black uppercase tracking-wider">
                  <button
                    onClick={() => setAiTab('summary')}
                    className={`flex-1 py-3 text-center border-r border-stone-850 transition-all ${
                      aiTab === 'summary' 
                        ? 'bg-[#F8C537] text-stone-950 font-black border-b-2 border-b-stone-950' 
                        : 'text-stone-500 hover:text-stone-300 hover:bg-[#18161f]'
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setAiTab('chat')}
                    className={`flex-1 py-3 text-center transition-all ${
                      aiTab === 'chat' 
                        ? 'bg-[#60a5fa] text-stone-950 font-black border-b-2 border-b-stone-950' 
                        : 'text-stone-500 hover:text-stone-300 hover:bg-[#18161f]'
                    }`}
                  >
                    Chat Assistant
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#121016]">
                  
                  {/* Summary Tab */}
                  {aiTab === 'summary' && (
                    <div className="flex-1 overflow-y-auto p-4 bg-stone-950/20 border border-stone-850/45 rounded-2xl m-3">
                      {selectedNote.summary ? (
                        <div className="space-y-4">
                          <div 
                            className="text-stone-300 leading-relaxed text-xs prose-dark"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote.summary) }}
                          />
                          <button
                            onClick={handleSummarizePdf}
                            disabled={summarizing}
                            className="w-full py-3 bg-white hover:bg-stone-50 text-stone-950 border-2 border-stone-950 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] text-xs font-black uppercase tracking-widest transition-all mt-6"
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
                          <div className="w-12 h-12 bg-stone-900 border-2 border-stone-950 rounded-full flex items-center justify-center mb-3 shadow-[2.5px_2.5px_0px_0px_#F8C537]">
                            <FiBookOpen className="w-5 h-5 text-white" />
                          </div>
                          <h5 className="font-sans font-black text-white text-base mb-1 uppercase tracking-wider">Generate PDF Outline</h5>
                          <p className="text-xs text-stone-500 mb-6 max-w-xs font-bold leading-relaxed">
                            Create a study outline covering key concepts and summaries.
                          </p>
                          <button
                            onClick={handleSummarizePdf}
                            disabled={summarizing}
                            className="px-5 py-3 bg-[#F8C537] text-stone-950 border-2 border-stone-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all flex items-center"
                          >
                            {summarizing ? (
                              <>
                                <FiLoader className="animate-spin mr-2 w-3.5 h-3.5 stroke-[2.5]" />
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
                    <div className="flex-1 flex flex-col overflow-hidden bg-[#121016]">
                      
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {activeChat.length === 0 ? (
                          <div className="text-center py-12 text-stone-600 text-xs font-mono font-bold leading-normal">
                            * Ask me anything about the content of <br />
                            <span className="font-mono text-stone-400 underline">{selectedNote.pdfId.filename}</span>.
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
                                  <div className="max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed bg-[#c084fc] text-stone-950 border-2 border-stone-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-tr-none font-sans font-bold">
                                    {msg.content}
                                  </div>
                                ) : (
                                  <div className="max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed bg-[#1c1917] text-stone-100 border-2 border-stone-850 rounded-tl-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] font-sans font-semibold">
                                    {msg.content}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-stone-900 border-2 border-stone-950 rounded-2xl rounded-tl-none p-3 text-xs flex items-center space-x-2 text-stone-400 shadow-sm font-mono font-black">
                              <FiLoader className="animate-spin w-3.5 h-3.5 text-white" />
                              <span>Thinking...</span>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat Input form */}
                      <form 
                        onSubmit={handleSendChat}
                        className="p-3 bg-[#121016] border-t-2 border-stone-850 flex items-center space-x-2"
                      >
                        <input
                          type="text"
                          placeholder="Ask a question about the PDF..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          disabled={chatLoading}
                          className="flex-1 bg-stone-950 border-2 border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#60a5fa] font-sans font-bold"
                        />
                        <button
                          type="submit"
                          disabled={chatLoading || !chatInput.trim()}
                          className="p-2.5 bg-[#F26430] border-2 border-stone-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] text-white rounded-xl disabled:opacity-40 hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center flex-shrink-0"
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
