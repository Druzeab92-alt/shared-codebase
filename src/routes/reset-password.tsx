import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HomeNav } from "@/components/home/HomeNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const Route = createFileRoute("/reset-password")({
 head: () => ({ meta: [{title:"تغيير كلمة المرور — Winter Wolf"},{name:"description",content:"تغيير كلمة مرور حسابك."},{property:"og:title",content:"تغيير كلمة المرور — Winter Wolf"},{property:"og:description",content:"تغيير كلمة مرور حسابك."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}] }),
 component: ResetPassword,
});
function ResetPassword() {
 const [password,setPassword]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent) {e.preventDefault();setBusy(true);try {const {error}=await supabase.auth.updateUser({password});setMessage(error?"تعذر تغيير كلمة المرور؛ افتح رابط الاستعادة من بريدك.":"تم تغيير كلمة المرور.");}catch {setMessage("تعذر الاتصال.");}finally{setBusy(false);}}
 return <><HomeNav/><div className="mx-auto max-w-6xl px-4 py-8"><h1 className="mb-6 text-2xl font-semibold">تغيير كلمة المرور</h1><form className="max-w-sm space-y-4" onSubmit={submit}><label className="block space-y-2"><span>كلمة المرور الجديدة</span><Input type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} /></label><Button disabled={busy}>حفظ</Button><p role="status">{message}</p></form></div></>;
}