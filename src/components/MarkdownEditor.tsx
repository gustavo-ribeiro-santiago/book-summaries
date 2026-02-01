'use client';

import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownEditorProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  initialContent,
  onSave,
  onCancel,
  placeholder = 'Write your summary in Markdown...',
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(content);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !isPreview
                ? 'bg-accent-600 text-white'
                : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isPreview
                ? 'bg-accent-600 text-white'
                : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-ink-600 hover:text-ink-900 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-accent-600 text-white rounded-lg font-medium btn-hover hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div className="min-h-[400px] bg-white rounded-xl border border-paper-200 p-6">
          <MarkdownRenderer content={content} />
        </div>
      ) : (
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[400px] px-4 py-4 bg-white border border-paper-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-ink-800 placeholder-ink-400 font-mono text-sm resize-y"
          />
          <div className="absolute bottom-4 right-4 text-xs text-ink-400">
            Markdown supported
          </div>
        </div>
      )}

      {/* Markdown Help */}
      {!isPreview && (
        <div className="bg-paper-100 rounded-xl p-4 text-sm text-ink-600">
          <p className="font-medium text-ink-700 mb-2">Markdown Tips:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <span><code className="bg-paper-200 px-1 rounded"># Heading</code></span>
            <span><code className="bg-paper-200 px-1 rounded">**bold**</code></span>
            <span><code className="bg-paper-200 px-1 rounded">*italic*</code></span>
            <span><code className="bg-paper-200 px-1 rounded">- list item</code></span>
            <span><code className="bg-paper-200 px-1 rounded">&gt; quote</code></span>
            <span><code className="bg-paper-200 px-1 rounded">`code`</code></span>
            <span><code className="bg-paper-200 px-1 rounded">[link](url)</code></span>
            <span><code className="bg-paper-200 px-1 rounded">---</code> divider</span>
          </div>
        </div>
      )}
    </div>
  );
}

