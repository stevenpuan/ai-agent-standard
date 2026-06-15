import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/app/company")({ component: Page });

function Page() {
  const { can } = useAuth();
  const qc = useQueryClient();
  const editable = can("company", "edit");

  const { data } = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const { data } = await supabase.from("company_settings").select("*").eq("id", 1).maybeSingle();
      return data as any;
    },
  });

  const [f, setF] = useState({ name: "", industry: "", brand_tone: "", core_values: "", global_principles: "" });
  useEffect(() => {
    if (data) setF({ name: data.name ?? "", industry: data.industry ?? "", brand_tone: data.brand_tone ?? "", core_values: data.core_values ?? "", global_principles: data.global_principles ?? "" });
  }, [data]);

  const save = async () => {
    const { error } = await supabase.from("company_settings").update(f).eq("id", 1);
    if (error) { toast.error(error.message); return; }
    toast.success("已儲存"); qc.invalidateQueries({ queryKey: ["company"] });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="公司設定" description="全域基底：注入所有 AI 代理的人格與原則" actions={editable ? <Button onClick={save}>儲存</Button> : undefined} />
      <Card><CardContent className="py-6 space-y-4 max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1"><Label>公司名稱</Label><Input value={f.name} disabled={!editable} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="space-y-1"><Label>產業</Label><Input value={f.industry} disabled={!editable} onChange={(e) => setF({ ...f, industry: e.target.value })} /></div>
        </div>
        <div className="space-y-1"><Label>品牌語氣</Label><Input value={f.brand_tone} disabled={!editable} onChange={(e) => setF({ ...f, brand_tone: e.target.value })} /></div>
        <div className="space-y-1"><Label>核心價值（每行一條）</Label><Textarea className="min-h-[100px]" value={f.core_values} disabled={!editable} onChange={(e) => setF({ ...f, core_values: e.target.value })} /></div>
        <div className="space-y-1"><Label>全域工作原則（每行一條）</Label><Textarea className="min-h-[100px]" value={f.global_principles} disabled={!editable} onChange={(e) => setF({ ...f, global_principles: e.target.value })} /></div>
      </CardContent></Card>
    </div>
  );
}
