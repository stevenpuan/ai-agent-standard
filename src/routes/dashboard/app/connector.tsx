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

export const Route = createFileRoute("/dashboard/app/connector")({ component: Page });

const KEYS = ["connector_app_url", "connector_app_anon_key", "connector_tables"];
const LABELS: Record<string, string> = {
  connector_app_url: "應用系統 Supabase URL",
  connector_app_anon_key: "應用系統 anon key",
  connector_tables: "可讀取的表/視圖白名單（逗號分隔）",
};

function Page() {
  const { can } = useAuth();
  const qc = useQueryClient();
  const editable = can("connector", "edit");

  const { data: rows = [] } = useQuery({
    queryKey: ["connector_cfg"],
    queryFn: async () => {
      const { data } = await supabase.from("system_configs").select("key,value").in("key", KEYS);
      return (data ?? []) as { key: string; value: string | null }[];
    },
  });

  const [draft, setDraft] = useState<Record<string, string>>({});
  useEffect(() => { const m: Record<string, string> = {}; rows.forEach((r) => (m[r.key] = r.value ?? "")); setDraft(m); }, [rows]);

  const save = async () => {
    const results = await Promise.all(KEYS.map((k) => supabase.from("system_configs").update({ value: draft[k] ?? "" }).eq("key", k)));
    const err = results.find((x) => x.error);
    if (err?.error) { toast.error(err.error.message); return; }
    toast.success("已儲存"); qc.invalidateQueries({ queryKey: ["connector_cfg"] });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="系統連接器" description="設定要讀取的應用系統（如 base01）以供 AI 代理應對" actions={editable ? <Button onClick={save}>儲存</Button> : undefined} />
      <Card><CardContent className="py-6 space-y-4 max-w-2xl">
        {KEYS.map((k) => (
          <div key={k} className="space-y-1">
            <Label>{LABELS[k]}</Label>
            {k === "connector_tables"
              ? <Textarea value={draft[k] ?? ""} disabled={!editable} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} placeholder="work_orders, customers" />
              : <Input value={draft[k] ?? ""} disabled={!editable} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />}
          </div>
        ))}
        <p className="text-xs text-muted-foreground">anon key 為可公開金鑰，存取由該應用系統的 RLS 控管。</p>
      </CardContent></Card>
    </div>
  );
}
