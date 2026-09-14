"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  CAREER_FILE_TYPES,
  careerAcceptValue,
  megabytesToBytes,
  type CareerFormConfig,
} from "@/lib/careers-config";
import { localizeDigits } from "@/lib/locale-digits";

type FormState = "idle" | "submitting" | "success" | "error";

export function CareerApplicationForm({
  config,
  initialFormToken,
}: {
  config: CareerFormConfig;
  initialFormToken: string;
}) {
  const { locale } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  const startedAt = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [formToken, setFormToken] = useState(initialFormToken);
  const formats = config.allowedFileTypes.map((type) => CAREER_FILE_TYPES[type].label).join(en ? ", " : "، ");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const setSelectedFiles = (next: File[]) => {
    setState("idle");
    setMessage("");
    if (next.length > config.maxFiles) {
      setState("error");
      setMessage(en ? `Choose up to ${config.maxFiles} files.` : `حداکثر ${localizeDigits(config.maxFiles, locale)} فایل انتخاب کنید.`);
      return;
    }
    const total = next.reduce((sum, file) => sum + file.size, 0);
    if (next.some((file) => file.size > megabytesToBytes(config.maxFileSizeMB)) || total > megabytesToBytes(config.maxTotalSizeMB)) {
      setState("error");
      setMessage(en ? "The selected files exceed the allowed size." : "حجم فایل‌های انتخاب‌شده بیشتر از حد مجاز است.");
      return;
    }
    setFiles(next);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!files.length || state === "submitting" || startedAt.current === null) return;
    setState("submitting");
    setMessage("");
    const data = new FormData(event.currentTarget);
    data.set("startedAt", String(startedAt.current));
    data.set("locale", locale);
    data.delete("resumes");
    for (const file of files) data.append("resumes", file);

    try {
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: data,
        headers: { "X-Career-Form-Token": formToken },
      });
      const result = await response.json() as { ok?: boolean; message?: string; formToken?: string };
      if (result.formToken) setFormToken(result.formToken);
      if (!response.ok || !result.ok) throw new Error(result.message || "Submission failed");
      event.currentTarget.reset();
      setFiles([]);
      startedAt.current = Date.now();
      setState("success");
      setMessage(en ? "Your résumé was received. Thank you." : "رزومه شما دریافت شد. متشکریم.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error && error.message !== "Submission failed"
        ? error.message
        : en ? "We could not submit the form. Please try again." : "ثبت فرم انجام نشد؛ لطفاً دوباره تلاش کنید.");
    }
  };

  if (!config.enabled) {
    return (
      <div className={`${font} rounded-[28px] bg-[#f7f4ed] p-8 text-[16px] font-bold leading-8 text-black/60`}>
        {en ? "Résumé submissions are temporarily unavailable." : "دریافت رزومه در حال حاضر موقتاً غیرفعال است."}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      <label className="grid gap-2">
        <span className={`${font} text-[13px] font-black`}>{en ? "Full name" : "نام و نام خانوادگی"}</span>
        <input name="fullName" autoComplete="name" required minLength={3} maxLength={120} className={`${font} min-h-14 rounded-[18px] border border-black/10 bg-[#f7f4ed] px-5 text-[15px] outline-none transition focus:border-[#e42e1d]/60 focus:ring-4 focus:ring-[#e42e1d]/10`} />
      </label>

      <label className="grid gap-2">
        <span className={`${font} text-[13px] font-black`}>{en ? "Phone number" : "شماره تماس"}</span>
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={32} dir="ltr" className={`${font} min-h-14 rounded-[18px] border border-black/10 bg-[#f7f4ed] px-5 text-start text-[15px] outline-none transition focus:border-[#e42e1d]/60 focus:ring-4 focus:ring-[#e42e1d]/10`} />
      </label>

      <div className="grid gap-2">
        <span className={`${font} text-[13px] font-black`}>{en ? "Résumé files" : "فایل‌های رزومه"}</span>
        <input ref={inputRef} type="file" name="resumes" multiple accept={careerAcceptValue(config.allowedFileTypes)} className="sr-only" onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))} />
        <button type="button" onClick={() => inputRef.current?.click()} className={`${font} flex min-h-28 items-center justify-between gap-5 rounded-[22px] border border-dashed border-black/20 bg-[#f7f4ed] px-5 text-start transition hover:border-[#e42e1d]/50 hover:bg-[#e42e1d]/[.035]`}>
          <span>
            <strong className="block text-[15px] font-black">{en ? "Choose files" : "انتخاب فایل‌ها"}</strong>
            <small className="mt-2 block text-[12px] font-medium leading-6 text-black/45">
              {en
                ? `${formats} · up to ${config.maxFiles} files · ${config.maxFileSizeMB} MB each · ${config.maxTotalSizeMB} MB total`
                : `${formats} · حداکثر ${localizeDigits(config.maxFiles, locale)} فایل · هر فایل ${localizeDigits(config.maxFileSizeMB, locale)} و مجموع ${localizeDigits(config.maxTotalSizeMB, locale)} مگابایت`}
            </small>
          </span>
          <UploadIcon />
        </button>
      </div>

      {files.length > 0 && (
        <ul className="grid gap-2">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-4 rounded-[16px] bg-black/[.045] px-4 py-3">
              <span className={`${font} min-w-0 truncate text-[12px] font-bold`} dir="ltr">{file.name}</span>
              <button type="button" onClick={() => setSelectedFiles(files.filter((_, itemIndex) => itemIndex !== index))} className={`${font} shrink-0 text-[12px] font-black text-[#e42e1d]`}>
                {en ? "Remove" : "حذف"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="pointer-events-none absolute -start-[9999px] top-auto size-px overflow-hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <button type="submit" disabled={!files.length || state === "submitting"} className={`${font} min-h-14 rounded-full bg-[#181512] px-7 text-[15px] font-black text-white transition hover:bg-[#e42e1d] disabled:cursor-not-allowed disabled:opacity-35`}>
        {state === "submitting" ? (en ? "Submitting…" : "در حال ارسال…") : (en ? "Submit résumé" : "ارسال رزومه")}
      </button>

      <p aria-live="polite" className={`${font} min-h-6 text-[13px] font-bold ${state === "error" ? "text-[#c22a20]" : "text-[#28724b]"}`}>
        {message}
      </p>
    </form>
  );
}

function UploadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-8 shrink-0 text-[#e42e1d]">
      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
