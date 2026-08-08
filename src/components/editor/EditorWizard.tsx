"use client";

import { useState, useCallback, useRef } from "react";
import {
  HiOutlineCheck,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineSave,
  HiOutlineQuestionMarkCircle,
  HiOutlineUpload,
  HiOutlineX,
  HiOutlineEye,
} from "react-icons/hi";
import Link from "next/link";

interface SchemaField {
  type: string;
  label: string;
  placeholder?: string;
  tooltip?: string;
  required?: boolean;
  default?: string;
  maxCount?: number;
}

interface SchemaSection {
  label: string;
  fields: Record<string, SchemaField>;
}

interface Schema {
  name: string;
  description: string;
  sections: Record<string, SchemaSection>;
}

interface EditorWizardProps {
  websiteId: number;
  schema: Schema;
  initialData: Record<string, Record<string, string>>;
}

const stepNames = [
  { key: "hero", label: "Hero & Banner", icon: "🖼️" },
  { key: "profil", label: "Profil Desa", icon: "🏘️" },
  { key: "galeri", label: "Galeri Foto", icon: "📸" },
  { key: "kontak", label: "Kontak", icon: "📍" },
  { key: "warna", label: "Warna", icon: "🎨" },
];

export function EditorWizard({
  websiteId,
  schema,
  initialData,
}: EditorWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Record<string, Record<string, unknown>>>(
    initialData || {}
  );
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sections = Object.keys(schema.sections);
  const currentSectionKey = stepNames[currentStep]?.key || sections[0];
  const currentSection = schema.sections[currentSectionKey];

  // Auto-save with debounce
  const autoSave = useCallback(
    (newData: Record<string, Record<string, unknown>>) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(async () => {
        setSaving(true);
        try {
          await fetch(`/api/website/${websiteId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataKonten: newData }),
          });
          setLastSaved(
            new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        } catch {
          // Silently fail - data still in state
        } finally {
          setSaving(false);
        }
      }, 1000);
    },
    [websiteId]
  );

  function updateField(section: string, field: string, value: unknown) {
    setData((prev) => {
      const newData = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
      autoSave(newData);
      return newData;
    });
  }

  async function handleFileUpload(
    section: string,
    field: string,
    file: File,
    isArray = false
  ) {
    const uploadKey = `${section}.${field}`;
    setUploading(uploadKey);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        if (isArray) {
          const currentArr = (data[section]?.[field] as string[]) || [];
          updateField(section, field, [...currentArr, url]);
        } else {
          updateField(section, field, url);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Gagal upload file");
      }
    } catch {
      alert("Error saat mengupload file");
    } finally {
      setUploading(null);
    }
  }

  function removeGalleryImage(section: string, field: string, index: number) {
    const currentArr = (data[section]?.[field] as string[]) || [];
    const newArr = currentArr.filter((_, i) => i !== index);
    updateField(section, field, newArr);
  }

  function renderField(
    sectionKey: string,
    fieldKey: string,
    field: SchemaField
  ) {
    const value = data[sectionKey]?.[fieldKey] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={String(value)}
            onChange={(e) =>
              updateField(sectionKey, fieldKey, e.target.value)
            }
            placeholder={field.placeholder}
            className="input-field"
          />
        );

      case "textarea":
        return (
          <textarea
            value={String(value)}
            onChange={(e) =>
              updateField(sectionKey, fieldKey, e.target.value)
            }
            placeholder={field.placeholder}
            rows={5}
            className="input-field resize-y min-h-[120px]"
          />
        );

      case "image":
        return (
          <div>
            {value ? (
              <div className="relative inline-block">
                <img
                  src={String(value)}
                  alt={field.label}
                  className="w-40 h-40 object-cover rounded-xl border border-dark-700"
                />
                <button
                  onClick={() => updateField(sectionKey, fieldKey, "")}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-danger-500 rounded-full flex items-center justify-center text-white"
                >
                  <HiOutlineX className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="upload-zone block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(sectionKey, fieldKey, file);
                  }}
                />
                {uploading === `${sectionKey}.${fieldKey}` ? (
                  <div className="flex flex-col items-center gap-2 text-dark-400">
                    <svg
                      className="animate-spin w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span className="text-sm">Mengupload...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-dark-400">
                    <HiOutlineUpload className="w-8 h-8" />
                    <span className="text-sm">
                      Klik atau drag file ke sini
                    </span>
                    <span className="text-xs text-dark-500">
                      JPG, PNG, WebP (maks 5MB)
                    </span>
                  </div>
                )}
              </label>
            )}
          </div>
        );

      case "images":
        const images = (value as unknown as string[]) || [];
        const maxCount = field.maxCount || 8;
        return (
          <div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={img}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl border border-dark-700"
                  />
                  <button
                    onClick={() =>
                      removeGalleryImage(sectionKey, fieldKey, index)
                    }
                    className="absolute -top-2 -right-2 w-6 h-6 bg-danger-500 rounded-full flex items-center justify-center text-white"
                  >
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {images.length < maxCount && (
                <label className="upload-zone aspect-square flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        handleFileUpload(sectionKey, fieldKey, file, true);
                    }}
                  />
                  {uploading === `${sectionKey}.${fieldKey}` ? (
                    <svg
                      className="animate-spin w-6 h-6 text-dark-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <div className="text-center text-dark-500">
                      <HiOutlineUpload className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-xs">Tambah Foto</span>
                    </div>
                  )}
                </label>
              )}
            </div>
            <p className="text-xs text-dark-500">
              {images.length}/{maxCount} foto
            </p>
          </div>
        );

      case "color":
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={String(value || field.default || "#059669")}
              onChange={(e) =>
                updateField(sectionKey, fieldKey, e.target.value)
              }
              className="w-12 h-12 rounded-xl border border-dark-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={String(value || field.default || "#059669")}
              onChange={(e) =>
                updateField(sectionKey, fieldKey, e.target.value)
              }
              className="input-field w-32 text-sm"
              placeholder="#059669"
            />
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={String(value)}
            onChange={(e) =>
              updateField(sectionKey, fieldKey, e.target.value)
            }
            placeholder={field.placeholder}
            className="input-field"
          />
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          {stepNames.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  index === currentStep
                    ? "bg-primary-500/15 text-primary-400 border border-primary-500/20"
                    : index < currentStep
                    ? "text-primary-400"
                    : "text-dark-500"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    index < currentStep
                      ? "bg-primary-600 text-white"
                      : index === currentStep
                      ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                      : "bg-dark-800 text-dark-500 border border-dark-700"
                  }`}
                >
                  {index < currentStep ? (
                    <HiOutlineCheck className="w-3.5 h-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden md:inline font-medium">
                  {step.label}
                </span>
              </button>
              {index < stepNames.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    index < currentStep ? "bg-primary-500" : "bg-dark-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-dark-500">
          {saving ? (
            <>
              <svg
                className="animate-spin w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Menyimpan...
            </>
          ) : lastSaved ? (
            <>
              <HiOutlineSave className="w-3 h-3 text-primary-400" />
              <span>
                Tersimpan otomatis pukul{" "}
                <span className="text-primary-400">{lastSaved}</span>
              </span>
            </>
          ) : (
            <span className="text-dark-600">Perubahan akan disimpan otomatis</span>
          )}
        </div>
        <Link
          href="/preview"
          className="btn-secondary text-xs px-3 py-1.5"
        >
          <HiOutlineEye className="w-3.5 h-3.5" />
          Preview
        </Link>
      </div>

      {/* Form Content */}
      {currentSection && (
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">{stepNames[currentStep]?.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">
                {currentSection.label}
              </h2>
              <p className="text-dark-500 text-sm">
                Lengkapi informasi di bawah ini
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(currentSection.fields).map(
              ([fieldKey, field]) => (
                <div key={fieldKey}>
                  <div className="flex items-center mb-2">
                    <label className="input-label mb-0">
                      {field.label}
                      {field.required && (
                        <span className="text-danger-500 ml-1">*</span>
                      )}
                    </label>
                    {field.tooltip && (
                      <span className="tooltip-trigger ml-2">
                        <HiOutlineQuestionMarkCircle className="w-4 h-4" />
                        <span className="tooltip-content">
                          {field.tooltip}
                        </span>
                      </span>
                    )}
                  </div>
                  {renderField(currentSectionKey, fieldKey, field)}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className={`btn-secondary py-2.5 px-5 ${
            currentStep === 0 ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        {currentStep < stepNames.length - 1 ? (
          <button
            onClick={() =>
              setCurrentStep((prev) =>
                Math.min(stepNames.length - 1, prev + 1)
              )
            }
            className="btn-primary py-2.5 px-5"
          >
            Selanjutnya
            <HiOutlineArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link href="/preview" className="btn-primary py-2.5 px-5">
            <HiOutlineEye className="w-4 h-4" />
            Lihat Preview
          </Link>
        )}
      </div>
    </div>
  );
}
