import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { formatDate } from '../lib/helpers';
import type { Entry } from '../lib/supabase';

interface PhotoGalleryViewProps {
  entries: Entry[];
}

export const PhotoGalleryView: React.FC<PhotoGalleryViewProps> = ({ entries }) => {
  const [lightboxEntry, setLightboxEntry] = useState<Entry | null>(null);

  // Filter entries that have photos
  const photoEntries = entries.filter((entry) => entry.photo_url);

  if (photoEntries.length === 0) {
    return (
      <div className="card-glass text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kairos-purple/10 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-kairos-purple/40" />
        </div>
        <h3 className="text-xl font-semibold font-serif text-kairos-dark mb-2">
          No photos yet
        </h3>
        <p className="text-kairos-dark/70">
          Capture a moment in your next entry
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photoEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setLightboxEntry(entry)}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer ring-1 ring-kairos-border/30 hover:ring-kairos-purple/50 transition-all hover:scale-[1.02]"
          >
            <img
              src={entry.photo_url!}
              alt="Journal entry"
              className="w-full h-full object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-xs font-medium mb-1">
                  {formatDate(entry.created_at)}
                </p>
                <p className="text-sm line-clamp-2">
                  {entry.entry_text.substring(0, 60)}
                  {entry.entry_text.length > 60 ? '...' : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxEntry && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxEntry(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxEntry(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image container */}
          <div
            className="max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1 flex items-center justify-center mb-4">
              <img
                src={lightboxEntry.photo_url!}
                alt="Journal entry"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Caption */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-h-[20vh] overflow-y-auto">
              <p className="text-xs text-white/60 mb-2">
                {formatDate(lightboxEntry.created_at)}
              </p>
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {lightboxEntry.entry_text}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
