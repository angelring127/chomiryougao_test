"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useAppStore } from "@/store/app-store";
import {
  validateFile,
  processImage,
  type ValidationError,
} from "../lib/image-processor";

interface ImageUploaderProps {
  onImageProcessed: (dataUrl: string) => void;
}

export function ImageUploader({ onImageProcessed }: ImageUploaderProps) {
  const { t } = useI18n();
  const { setUploadedImage } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<ValidationError | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsProcessing(true);

      try {
        const validationError = await validateFile(file);
        if (validationError) {
          setError(validationError);
          setIsProcessing(false);
          return;
        }

        const processed = await processImage(file);
        setPreview(processed.dataUrl);
        setUploadedImage(processed.dataUrl);
        onImageProcessed(processed.dataUrl);
      } catch (err) {
        setError({
          type: "generic",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [onImageProcessed, setUploadedImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const clearPreview = useCallback(() => {
    setPreview(null);
    setUploadedImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }, [setUploadedImage]);

  if (preview) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative w-full bg-gray-100 rounded-lg shadow-lg overflow-hidden">
          <div className="w-full" style={{ paddingBottom: "133.33%" }}>
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-contain p-2"
            />
          </div>
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
            aria-label="Clear preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? "border-primary bg-primary/5" : "border-border"}
          ${isProcessing ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("upload.dragDrop")}
            </p>
            <p className="text-xs text-muted-foreground">{t("upload.or")}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Upload className="inline h-4 w-4 mr-2" />
              {t("cta.upload")}
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isProcessing}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <Camera className="inline h-4 w-4 mr-2" />
              {t("cta.camera")}
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            {t("upload.requirements")}
          </p>

          {isProcessing && (
            <p className="text-sm text-primary animate-pulse">
              {t("upload.processing")}
            </p>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          capture="user"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">
            {t("upload.error.title")}
          </p>
          <p className="text-xs text-destructive/80 mt-1">
            {t(`upload.error.${error.type}`)}
          </p>
        </div>
      )}

      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          {t("privacy.notice")}
        </p>
      </div>
    </div>
  );
}
