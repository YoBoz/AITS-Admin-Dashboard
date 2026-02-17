import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  label?: string;
}

export function FileUpload({
  onFilesChange,
  multiple = false,
  accept,
  maxSizeMB = 10,
  className,
  label = 'Drop files here or click to upload',
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      const arr = multiple ? Array.from(newFiles) : [newFiles[0]];
      const valid = arr.filter((f) => f.size <= maxSizeMB * 1024 * 1024);
      setFiles((prev) => (multiple ? [...prev, ...valid] : valid));
      onFilesChange?.(multiple ? [...files, ...valid] : valid);
    },
    [multiple, maxSizeMB, onFilesChange, files]
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText;
    return File;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 cursor-pointer transition-colors',
          isDragging
            ? 'border-brand bg-brand/5'
            : 'border-border hover:border-brand/50 hover:bg-muted/50'
        )}
      >
        <Upload className={cn('h-8 w-8', isDragging ? 'text-brand' : 'text-muted-foreground')} />
        <p className="text-sm font-lexend text-muted-foreground text-center">{label}</p>
        <p className="text-xs text-muted-foreground">
          {accept ? `Accepted: ${accept}` : 'Any file type'} — Max {maxSizeMB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => {
            const Icon = getFileIcon(file);
            return (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2"
              >
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
                {/* Mock progress */}
                <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-brand rounded-full w-full" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
