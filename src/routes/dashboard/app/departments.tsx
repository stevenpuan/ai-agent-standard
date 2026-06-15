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
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/app/departments")({ component: Page });

interface Dept { id: string; code: string | null; name: string; emoji: string | null; description: string | null; sort_order: number; is_active: boolean; }
const blank = (): Partial<Dept> => ({ code: "", name: "", emoji: "", description: "", sort_order: 10, is_active: true });

function Page() {
  const { can } = useAuth();
  const qc = useQueryClient();
  const canEdit = can("departments", "edit");
  const canDelete = can("departments", "delete");

  const { data: rows = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("*").order("sort_order");
      if (error) throw error;
      return data as Dept[];
    },
  });
  const reload = () => qc.invalidateQueries({ queryKey: ["departments"] });

  const [form, setForm] = useState<Partial<Dept> | null>(null);
  const isNew = form && !form.id;
  const save = async () => {
    if (!form?.name) { toast.error("請輸入名稱"); return; }
    const payload = { code: form.code || null, name: form.name, emoji: form.emoji || null, description: form.description || null, sort_order: form.sort_order ?? 10, is_active: form.is_active ?? true };
    const res = form.id ? await supabase.from("departments").update(payload).eq("id", form.id) : await supabase.from("departments").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("已儲存"); setForm(null); reload();
  };
  const del = async (r: Dept) => {
    if (!confirm(`確定刪除「${r.name}」？`)) return;
    const { error } = await supabase.from("departments").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("已刪除"); reload();
  };
  const toggle = async (r: Dept) => {
    const { error } = await supabase.from("departments").update({ is_active: !r.is_active }).eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="部門" description="AI 代理所屬的部門" actions={can("departments", "create") ? <Button onClick={() => setForm(blank())}>新增部門</Button> : undefined} />
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>部門</TableHead><TableHead>代碼</TableHead><TableHead>說明</TableHead><TableHead>排序</TableHead><TableHead>狀態</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">尚無部門</TableCell></TableRow>}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.emoji} {r.name}</TableCell>
                <TableCell className="font-mono text-xs">{r.code ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{r.description ?? "—"}</TableCell>
                <TableCell>{r.sort_order}</TableCell>
                <TableCell><Badge variant={r.is_active ? "default" : "outline"}>{r.is_active ? "啟用" : "停用"}</Badge></TableCell>
                <TableCell className="text-right space-x-2">
                  {canEdit && <Button size="sm" variant="outline" onClick={() => toggle(r)}>{r.is_active ? "停用" : "啟用"}</Button>}
                  {canEdit && <Button size="sm" variant="outline" onClick={() => setForm({ ...r })}>編輯</Button>}
                  {canDelete && <Button size="sm" variant="outline" onClick={() => del(r)}>刪除</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isNew ? "新增部門" : "編輯部門"}</DialogTitle></DialogHeader>
          {form && (
            <div className="space-y-3">
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div className="space-y-1"><Label>圖示</Label><Input value={form.emoji ?? ""} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="👥" /></div>
                <div className="space-y-1"><Label>名稱</Label><Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              </div>
              <div className="space-y-1"><Label>代碼</Label><Input value={form.code ?? ""} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="hr" /></div>
              <div className="space-y-1"><Label>說明</Label><Input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1"><Label>排序</Label><Input type="number" value={form.sort_order ?? 10} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value || "0", 10) })} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>啟用</Label></div>
            </div>
          )}
          <DialogFooter><Button onClick={save}>儲存</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
