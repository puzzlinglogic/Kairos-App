import React, { useState, useEffect, useRef } from 'react';
import { X, Loader } from 'lucide-react';

interface EditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newText: string) => Promise<void>;
  initialText: string;
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialText,
}) => {
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!text.trim() || text === initialText) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      await onSave(text);
      onClose();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-kairos-dark/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg card-glass">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-serif text-kairos-dark">
            Edit Entry
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-kairos-border/30 transition-colors"
          >
            <X className="w-5 h-5 text-kairos-dark/60" />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[150px] p-3 rounded-xl bg-white/50 border border-kairos-border/30 focus:border-kairos-purple focus:ring-1 focus:ring-kairos-purple outline-none resize-y text-kairos-dark"
          placeholder="Write your thoughts..."
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-kairos-dark/70 hover:text-kairos-dark transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !text.trim()}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
