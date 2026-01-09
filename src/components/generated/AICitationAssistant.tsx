import React, { useState } from 'react';
import { Sparkles, Upload, FileText, Image, File, X, Send, Bot, User, Paperclip, CheckCircle2, AlertCircle, Loader2, ChevronDown, Copy, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: UploadedFile[];
}
interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'document';
  size: number;
  url?: string;
}
interface Citation {
  id: string;
  text: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
}

// --- Sub-components ---

const FilePreview = ({
  file,
  onRemove
}: {
  file: UploadedFile;
  onRemove: () => void;
}) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  return <motion.div initial={{
    opacity: 0,
    scale: 0.9
  }} animate={{
    opacity: 1,
    scale: 1
  }} exit={{
    opacity: 0,
    scale: 0.9
  }} className="relative group">
      <div className="flex items-center gap-3 p-3 bg-white border border-[#1E5F46]/10 rounded-lg hover:border-[#1E5F46]/20 transition-colors">
        <div className="w-10 h-10 bg-[#F5F3EF] rounded flex items-center justify-center text-[#1E5F46]/70">
          {file.type === 'image' ? <Image className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1E5F46] truncate">{file.name}</p>
          <p className="text-xs text-[#1E5F46]/50">{formatSize(file.size)}</p>
        </div>
        <button onClick={onRemove} className="p-1 hover:bg-[#F5F3EF] rounded transition-colors">
          <X className="w-4 h-4 text-[#1E5F46]/40" />
        </button>
      </div>
    </motion.div>;
};
const MessageBubble = ({
  message
}: {
  message: Message;
}) => {
  const isUser = message.role === 'user';
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-gradient-to-br from-[#1E5F46] to-[#166534] text-[#F5F3EF]' : 'bg-[#1E5F46]/10 text-[#1E5F46]'}`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-2xl ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-3 rounded-lg ${isUser ? 'bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF]' : 'bg-white border border-[#1E5F46]/10'}`}>
          <p className={`text-sm leading-relaxed ${isUser ? 'text-[#F5F3EF]' : 'text-[#1E5F46]'}`}>
            {message.content}
          </p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && <div className="mt-3 space-y-2">
              {message.attachments.map(file => <div key={file.id} className={`flex items-center gap-2 p-2 rounded ${isUser ? 'bg-[#166534]' : 'bg-[#F5F3EF]'}`}>
                  {file.type === 'image' ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  <span className="text-xs font-medium truncate">{file.name}</span>
                </div>)}
            </div>}
        </div>
        <p className="text-xs text-[#1E5F46]/40 mt-1 px-1">
          {message.timestamp.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })}
        </p>
      </div>
    </motion.div>;
};
const SuggestedPrompt = ({
  text,
  onClick
}: {
  text: string;
  onClick: () => void;
}) => <button onClick={onClick} className="px-4 py-2 bg-white border border-[#1E5F46]/10 rounded-lg text-sm text-[#1E5F46] hover:border-[#1E5F46]/20 hover:bg-[#F5F3EF] transition-colors text-left">
    {text}
  </button>;

// --- Main Component ---

export const AICitationAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your AI Citation Assistant. Upload any asset document (title deed, sale agreement, bank statement, etc.) and I'll help you extract key information, verify details, and create proper citations for your records.",
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCitations, setShowCitations] = useState(false);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };
  const handleSend = () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim() || 'Analyze these documents',
      timestamp: new Date(),
      attachments: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: "I've analyzed your document(s). Here's what I found:\n\n**Title Deed Information:**\n- Property: Al Barsha South, Dubai\n- Plot Number: 1234-567\n- Owner: Zanulda\n- Registered Value: AED 800,000\n- Registration Date: March 16, 2022\n- Area: 3,000 sq.ft\n\n**Verification Status:** ✓ All key fields extracted\n\nWould you like me to:\n1. Generate a formal citation for this asset\n2. Cross-reference with existing portfolio data\n3. Flag any discrepancies or missing information",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 2000);
  };
  const suggestedPrompts = ["Extract property details from title deed", "Verify ownership information", "Generate asset citation", "Compare with existing records"];
  return <div className="min-h-screen bg-[#F5F3EF]">
      {/* Header */}
      <header className="bg-white border-b border-[#1E5F46]/10 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1E5F46] to-[#166534] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#F5F3EF]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1E5F46]">AI Citation Assistant</h1>
                <p className="text-xs text-[#1E5F46]/60">Powered by advanced document analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs font-semibold text-[#10B981]">AI Active</span>
              </div>
              <button onClick={() => setShowCitations(!showCitations)} className="flex items-center gap-2 px-4 py-2 border border-[#1E5F46]/20 rounded-md text-sm font-medium text-[#1E5F46] hover:bg-[#1E5F46]/5 transition-colors">
                <FileText className="w-4 h-4" />
                Citations
                <ChevronDown className={`w-4 h-4 transition-transform ${showCitations ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="bg-white border border-[#1E5F46]/10 rounded-xl shadow-sm overflow-hidden flex flex-col" style={{
        height: 'calc(100vh - 200px)'
      }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(message => <MessageBubble key={message.id} message={message} />)}
            
            {isProcessing && <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1E5F46]/10 text-[#1E5F46] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-white border border-[#1E5F46]/10 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1E5F46]" />
                  <span className="text-sm text-[#1E5F46]/70">Analyzing documents...</span>
                </div>
              </motion.div>}

            {/* Suggested Prompts - Show when conversation is empty */}
            {messages.length === 1 && <div className="mt-8">
                <p className="text-sm font-semibold text-slate-700 mb-3">Suggested actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedPrompts.map((prompt, index) => <SuggestedPrompt key={index} text={prompt} onClick={() => setInputValue(prompt)} />)}
                </div>
              </div>}
          </div>

          {/* File Upload Preview */}
          <AnimatePresence>
            {uploadedFiles.length > 0 && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} className="border-t border-[#1E5F46]/10 bg-[#F5F3EF] px-6 py-4">
                <p className="text-xs font-semibold text-[#1E5F46]/70 mb-3 uppercase tracking-wide">
                  Attached Files ({uploadedFiles.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedFiles.map(file => <FilePreview key={file.id} file={file} onRemove={() => removeFile(file.id)} />)}
                </div>
              </motion.div>}
          </AnimatePresence>

          {/* Input Area */}
          <div className="border-t border-[#1E5F46]/10 p-4 bg-white">
            <div className="flex items-end gap-3">
              {/* File Upload Button */}
              <label className="cursor-pointer p-2 hover:bg-[#F5F3EF] rounded-lg transition-colors flex-shrink-0">
                <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                <Paperclip className="w-5 h-5 text-[#1E5F46]/60" />
              </label>

              {/* Text Input */}
              <div className="flex-1">
                <textarea value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }} placeholder="Ask me to analyze documents, extract data, or verify information..." className="w-full px-4 py-3 border border-[#1E5F46]/20 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1E5F46] focus:border-transparent" rows={2} />
              </div>

              {/* Send Button */}
              <button onClick={handleSend} disabled={!inputValue.trim() && uploadedFiles.length === 0} className="px-6 py-3 bg-gradient-to-r from-[#1E5F46] to-[#166534] text-[#F5F3EF] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0">
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
            <p className="text-xs text-[#1E5F46]/50 mt-2">
              Press Enter to send, Shift+Enter for new line. Supports PDF, images, and documents.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white border border-[#1E5F46]/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-4 h-4 text-[#1E5F46]" />
              <h3 className="text-sm font-semibold text-[#1E5F46]">Upload Documents</h3>
            </div>
            <p className="text-xs text-[#1E5F46]/60">Upload title deeds, sale agreements, or any asset documentation</p>
          </div>
          <div className="bg-white border border-[#1E5F46]/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#1E5F46]" />
              <h3 className="text-sm font-semibold text-[#1E5F46]">AI Analysis</h3>
            </div>
            <p className="text-xs text-[#1E5F46]/60">Automatic extraction of key data points and verification</p>
          </div>
          <div className="bg-white border border-[#1E5F46]/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#1E5F46]" />
              <h3 className="text-sm font-semibold text-[#1E5F46]">Generate Citations</h3>
            </div>
            <p className="text-xs text-[#1E5F46]/60">Create proper citations and audit trails for compliance</p>
          </div>
        </div>
      </div>
    </div>;
};