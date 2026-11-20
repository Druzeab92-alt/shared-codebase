import { useState, type FormEvent, type ReactNode } from "react";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAccount } from "@/lib/cloud-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CloudAccess({ children }: { children: ReactNode }) {
  const { user, ready } = useAccount();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (!ready) return <p className="py-8 text-muted-foreground">جارٍ التحميل…</p>;
  if (user) return <>{children}</>;
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const result = mode === "signup" ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.href } }) : mode === "reset" ? await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }) : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) setMessage(mode === "login" ? "تعذر الدخول؛ تحقق من البريد وكلمة المرور." : "تعذر إرسال الطلب؛ حاول مرة أخرى.");
      else if (mode !== "login") setMessage(mode === "signup" ? "تحقق من بريدك لتأكيد الحساب." : "تم إرسال رابط تغيير كلمة المرور.");
    } catch { setMessage("تعذر الاتصال؛ حاول مرة أخرى."); }
    finally { setBusy(false); }
  }
  async function social(provider: "google" | "lovable") {
    setBusy(true);
    try { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.href }); if (result.error) setMessage("تعذر تسجيل الدخول."); }
    catch { setMessage("تعذر الاتصال؛ حاول مرة أخرى."); }
    finally { setBusy(false); }
  }
  return <div className="max-w-sm py-8">
    <h2 className="mb-5 text-lg font-semibold">{mode === "signup" ? "إنشاء حساب" : mode === "reset" ? "استعادة كلمة المرور" : "تسجيل الدخول"}</h2>
    <form onSubmit={submit} className="space-y-4">
      <label className="block space-y-2"><span className="text-sm">البريد الإلكتروني</span><Input type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      {mode !== "reset" && <label className="block space-y-2"><span className="text-sm">كلمة المرور</span><Input type="password" dir="ltr" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} /></label>}
      <Button disabled={busy} type="submit" className="w-full">{mode === "signup" ? "إنشاء حساب" : mode === "reset" ? "إرسال الرابط" : "دخول"}</Button>
    </form>
    {message && <p role="status" className="mt-4 text-sm text-warning">{message}</p>}
    <div className="mt-4 flex flex-col gap-2">
      <Button variant="outline" disabled={busy} onClick={() => social("google")}><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.61 4.75 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>المتابعة مع Google</Button>
      <Button variant="outline" disabled={busy} onClick={() => social("lovable")}><LovableMark />المتابعة مع Lovable</Button>
      <Button variant="link" onClick={() => { setMessage(""); setMode(mode === "login" ? "signup" : "login"); }}>{mode === "login" ? "إنشاء حساب" : "العودة للدخول"}</Button>
      {mode === "login" && <Button variant="link" onClick={() => setMode("reset")}>نسيت كلمة المرور؟</Button>}
    </div>
  </div>;
}