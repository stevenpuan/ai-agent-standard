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

export const Route = createFileRoute("/dashboard/app/training")({ component: Page });

interface Agent { id: string; name: string; department_id: string | null; role: string | null; claude_md: string | null; status: string; subagents: any; skills: any; }

function Page() {
  const { can, user } = useAuth();
  const qc = useQueryClient();
  const canCreate = can("training", "create");
  const canEdit = can("training", "edit");

  const { data: depts = [] } = useQuery({ queryKey: ["departments"], queryFn: async () => { const { data } = await supabase.from("departments").select("id,name").order("sort_order"); return (data ?? []) as { id: string; name: string }[]; } });
  const { data: templates = [] } = useQuery({ queryKey: ["agent_templates"], queryFn: async () => { const { data } = await supabase.from("agent_templates").select("*").order("created_at"); return (data ?? []) as any[]; } });
  const { data: rows = [] } = useQuery({
    queryKey: ["my_agents"],
    queryFn: async () => { const { data, error } = await supabase.from("my_agents").select("*, departments(name)").order("created_at", { ascending: false }); if (error) throw error; return data as any[]; },
  });
  const reload = () => qc.invalidateQueries({ queryKey: ["my_agents"] });

  // create
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [deptId, setDeptId] = useState("none");
  const [tplId, setTplId] = useState("none");
  const create = async () => {
    if (!name) { toast.error("請輸入代理名稱"); return; }
    const tpl = templates.find((t) => t.id === tplId);
    const { error } = await supabase.from("my_agents").insert({
      owner_id: user?.id ?? null, name,
      department_id: deptId === "none" ? (tpl?.department_id ?? null) : deptId,
      role: tpl?.role ?? null, claude_md: tpl?.claude_md ?? null,
      subagents: tpl?.subagents ?? [], skills: tpl?.skills ?? [], status: "draft",
    });
    if (error) { toast.error(error.message); return; }
    toast.success("已建立代理"); setOpen(false); setName(""); setDeptId("none"); setTplId("none"); reload();
  };

  // edit
  const [edit, setEdit] = useState<Agent | null>(null);
  const saveEdit = async () => {
    if (!edit) return;
    const { error } = await supabase.from("my_agents").update({ name: edit.name, role: edit.role, claude_md: edit.claude_md, status: edit.status }).eq("id", edit.id);
    if (error) { toast.error(error.message); return; }
    toast.success("已更新"); setEdit(null); reload();
  };
  const del = async (r: any) => {
    if (!confirm(`確定刪除「${r.name}」？`)) return;
    const { error } = await supabase.from("my_agents").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("已刪除"); reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="個人訓練" description="從範本建立並調校你的專屬 AI 代理" actions={canCreate ? <Button onClick={() => setOpen(true)}>新增代理</Button> : undefined} />
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>代理</TableHead><TableHead>角色</TableHead><TableHead>部門</TableHead><TableHead>狀態</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">尚無代理</TableCell></TableRow>}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.role ?? "—"}</TableCell>
                <TableCell>{r.departments?.name ?? "—"}</TableCell>
                <TableCell><Badge variant={r.status === "ready" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
                <TableCell className="text-right space-x-2">
                  {canEdit && <Button size="sm" variant="outline" onClick={() => setEdit({ ...r })}>調校</Button>}
                  {can("training", "delete") && <Button size="sm" variant="outline" onClick={() => del(r)}>刪除</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      {/* create */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>新增代理</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label>名稱</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-1"><Label>套用範本（選填）</Label>
              <Select value={tplId} onValueChange={setTplId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">（不套用）</SelectItem>
                  {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>部門</Label>
              <Select value={deptId} onValueChange={setDeptId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">（依範本）</SelectItem>
                  {depts.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={create}>建立</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* edit */}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>調校代理</DialogTitle></DialogHeader>
          {edit && (
            <div className="space-y-3">
              <div className="space-y-1"><Label>名稱</Label><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div className="space-y-1"><Label>角色</Label><Input value={edit.role ?? ""} onChange={(e) => setEdit({ ...edit, role: e.target.value })} /></div>
              <div className="space-y-1"><Label>狀態</Label>
                <Select value={edit.status} onValueChange={(v) => setEdit({ ...edit, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="draft">草稿</SelectItem><SelectItem value="ready">完成</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>CLAUDE.md（人格定義）</Label><Textarea className="min-h-[220px] font-mono text-sm" value={edit.claude_md ?? ""} onChange={(e) => setEdit({ ...edit, claude_md: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button onClick={saveEdit}>儲存</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
