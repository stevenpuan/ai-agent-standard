import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/app/skills")({ component: Page });

interface Skill { id: string; name: string; type: string; description: string | null; content: string | null; status: string; }
const blank = (): Partial<Skill> => ({ name: "", type: "shared", description: "", content: "", status: "active" });

function Page() {
  const { can } = useAuth();
  const qc = useQueryClient();
  const canEdit = can("agent_skills", "edit");
  const canDelete = can("agent_skills", "delete");

  const { data: rows = [] } = useQuery({
    queryKey: ["agent_skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agent_skills").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Skill[];
    },
  });
  const reload = () => qc.invalidateQueries({ queryKey: ["agent_skills"] });

  const [form, setForm] = useState<Partial<Skill> | null>(null);
  const isNew = form && !form.id;
  const save = async () => {
    if (!form?.name) { toast.error("請輸入技能名稱"); return; }
    const payload = { name: form.name, type: form.type ?? "shared", description: form.description || null, content: form.content || null, status: form.status ?? "active" };
    const res = form.id ? await supabase.from("agent_skills").update(payload).eq("id", form.id) : await supabase.from("agent_skills").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("已儲存"); setForm(null); reload();
  };
  const del = async (r: Skill) => {
    if (!confirm(`確定刪除「${r.name}」？`)) return;
    const { error } = await supabase.from("agent_skills").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("已刪除"); reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="技能維護" description="Agent 可載入的技能（SKILL.md）" actions={can("agent_skills", "create") ? <Button onClick={() => setForm(blank())}>新增技能</Button> : undefined} />
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>名稱</TableHead><TableHead>類型</TableHead><TableHead>說明</TableHead><TableHead>狀態</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">尚無技能</TableCell></TableRow>}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell><Badge variant="secondary">{r.type === "shared" ? "共用" : "部門"}</Badge></TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{r.description ?? "—"}</TableCell>
                <TableCell><Badge variant={r.status === "active" ? "default" : "outline"}>{r.status}</Badge></TableCell>
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
          <DialogHeader><DialogTitle>{isNew ? "新增技能" : "編輯技能"}</DialogTitle></DialogHeader>
          {form && (
            <div className="space-y-3">
              <div className="space-y-1"><Label>名稱</Label><Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1"><Label>類型</Label>
                <Select value={form.type ?? "shared"} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="shared">共用</SelectItem><SelectItem value="department">部門</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>說明</Label><Input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1"><Label>內容 SKILL.md</Label><Textarea className="min-h-[200px] font-mono text-sm" value={form.content ?? ""} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button onClick={save}>儲存</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
