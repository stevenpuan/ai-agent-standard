import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/app/templates")({ component: Page });

interface Tpl { id: string; department_id: string | null; name: string; role: string | null; emoji: string | null; tone: string | null; description: string | null; claude_md: string | null; }
const blank = (): Partial<Tpl> => ({ department_id: null, name: "", role: "", emoji: "", tone: "", description: "", claude_md: "" });

function Page() {
  const { can } = useAuth();
  const qc = useQueryClient();
  const canEdit = can("agent_templates", "edit");
  const canDelete = can("agent_templates", "delete");

  const { data: depts = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => { const { data } = await supabase.from("departments").select("id,name").order("sort_order"); return (data ?? []) as { id: string; name: string }[]; },
  });
  const { data: rows = [] } = useQuery({
    queryKey: ["agent_templates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agent_templates").select("*, departments(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });
  const reload = () => qc.invalidateQueries({ queryKey: ["agent_templates"] });

  const [form, setForm] = useState<Partial<Tpl> | null>(null);
  const isNew = form && !form.id;
  const save = async () => {
    if (!form?.name) { toast.error("請輸入範本名稱"); return; }
    const payload = { department_id: form.department_id || null, name: form.name, role: form.role || null, emoji: form.emoji || null, tone: form.tone || null, description: form.description || null, claude_md: form.claude_md || null };
    const res = form.id ? await supabase.from("agent_templates").update(payload).eq("id", form.id) : await supabase.from("agent_templates").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("已儲存"); setForm(null); reload();
  };
  const del = async (r: any) => {
    if (!confirm(`確定刪除「${r.name}」？`)) return;
    const { error } = await supabase.from("agent_templates").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("已刪除"); reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="範本管理" description="部門 AI 代理範本（人格、語氣、CLAUDE.md）" actions={can("agent_templates", "create") ? <Button onClick={() => setForm(blank())}>新增範本</Button> : undefined} />
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>範本</TableHead><TableHead>角色</TableHead><TableHead>部門</TableHead><TableHead>語氣</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">尚無範本</TableCell></TableRow>}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.emoji} {r.name}</TableCell>
                <TableCell>{r.role ?? "—"}</TableCell>
                <TableCell>{r.departments?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{r.tone ?? "—"}</TableCell>
                <TableCell className="text-right space-x-2">
                  {canEdit && <Button size="sm" variant="outline" onClick={() => setForm({ ...r })}>編輯</Button>}
                  {canDelete && <Button size="sm" variant="outline" onClick={() => del(r)}>刪除</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isNew ? "新增範本" : "編輯範本"}</DialogTitle></DialogHeader>
          {form && (
            <div className="space-y-3">
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div className="space-y-1"><Label>圖示</Label><Input value={form.emoji ?? ""} onChange={(e) => setForm({ ...form, emoji: e.target.value })} /></div>
                <div className="space-y-1"><Label>範本名稱</Label><Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              </div>
              <div className="space-y-1"><Label>部門</Label>
                <Select value={form.department_id ?? "none"} onValueChange={(v) => setForm({ ...form, department_id: v === "none" ? null : v })}>
                  <SelectTrigger><SelectValue placeholder="選擇部門" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">（未指定）</SelectItem>
                    {depts.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>角色</Label><Input value={form.role ?? ""} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="人資夥伴" /></div>
                <div className="space-y-1"><Label>語氣</Label><Input value={form.tone ?? ""} onChange={(e) => setForm({ ...form, tone: e.target.value })} placeholder="溫暖支持" /></div>
              </div>
              <div className="space-y-1"><Label>說明</Label><Input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1"><Label>CLAUDE.md（人格定義）</Label><Textarea className="min-h-[200px] font-mono text-sm" value={form.claude_md ?? ""} onChange={(e) => setForm({ ...form, claude_md: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button onClick={save}>儲存</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
