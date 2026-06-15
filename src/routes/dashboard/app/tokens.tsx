import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/app/tokens")({ component: Page });

interface Tok { id: string; name: string; token: string; last_used_at: string | null; created_at: string; }
function genToken() {
  return "sk-" + Array.from({ length: 3 }, () => Math.random().toString(36).slice(2, 10)).join("");
}

function Page() {
  const { can, user } = useAuth();
  const qc = useQueryClient();
  const canCreate = can("agent_tokens", "create");
  const canDelete = can("agent_tokens", "delete");

  const { data: rows = [] } = useQuery({
    queryKey: ["agent_tokens"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agent_tokens").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tok[];
    },
  });
  const reload = () => qc.invalidateQueries({ queryKey: ["agent_tokens"] });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const create = async () => {
    if (!name) { toast.error("請輸入名稱"); return; }
    const { error } = await supabase.from("agent_tokens").insert({ name, token: genToken(), owner_id: user?.id ?? null });
    if (error) { toast.error(error.message); return; }
    toast.success("已產生 Token"); setOpen(false); setName(""); reload();
  };
  const copy = (t: string) => { navigator.clipboard?.writeText(t); toast.success("已複製"); };
  const del = async (r: Tok) => {
    if (!confirm(`確定刪除「${r.name}」？`)) return;
    const { error } = await supabase.from("agent_tokens").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("已刪除"); reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Token 管理" description="Agent API Token" actions={canCreate ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>產生 Token</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>產生 Token</DialogTitle></DialogHeader>
            <div className="space-y-1"><Label>名稱</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <DialogFooter><Button onClick={create}>產生</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      ) : undefined} />
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>名稱</TableHead><TableHead>Token</TableHead><TableHead>建立時間</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">尚無 Token</TableCell></TableRow>}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="font-mono text-xs">{r.token.slice(0, 10)}…</TableCell>
                <TableCell className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => copy(r.token)}>複製</Button>
                  {canDelete && <Button size="sm" variant="outline" onClick={() => del(r)}>刪除</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
