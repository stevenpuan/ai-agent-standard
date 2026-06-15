import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/app/deploy")({ component: Page });

function slug(s: string) {
  return (s || "agent").toLowerCase().trim().replace(/[^a-z0-9一-龥]+/g, "-").replace(/^-+|-+$/g, "") || "agent";
}
function companyPrefix(c: any): string {
  if (!c) return "";
  const lines: string[] = ["# 公司全域基底"];
  if (c.name) lines.push(`- 公司名稱：${c.name}`);
  if (c.industry) lines.push(`- 產業：${c.industry}`);
  if (c.brand_tone) lines.push(`- 品牌語氣：${c.brand_tone}`);
  const v = (c.core_values || "").split("\n").map((x: string) => x.trim()).filter(Boolean);
  if (v.length) { lines.push("\n## 核心價值"); v.forEach((x: string) => lines.push(`- ${x}`)); }
  const p = (c.global_principles || "").split("\n").map((x: string) => x.trim()).filter(Boolean);
  if (p.length) { lines.push("\n## 全域工作原則"); p.forEach((x: string) => lines.push(`- ${x}`)); }
  lines.push("\n---\n");
  return lines.join("\n");
}
function agentMd(a: any): string {
  const tools = Array.isArray(a.tools) ? a.tools.join(", ") : "";
  return `---\nname: ${a.name}\ndescription: ${a.description ?? ""}\ntools: ${tools}\n---\n\n${a.systemPrompt ?? a.description ?? ""}\n`;
}
function defaultSkill(name: string) {
  return `---\nname: ${name}\ndescription: ${name} skill 使用指引。\n---\n\n# ${name}\n\n## 何時使用\n當任務需要 ${name} 時載入。\n`;
}

function Page() {
  const { can } = useAuth();
  const canExport = can("deploy", "export") || can("deploy", "view");

  const { data: company } = useQuery({ queryKey: ["company"], queryFn: async () => { const { data } = await supabase.from("company_settings").select("*").eq("id", 1).maybeSingle(); return data as any; } });
  const { data: skills = [] } = useQuery({ queryKey: ["agent_skills"], queryFn: async () => { const { data } = await supabase.from("agent_skills").select("name,content"); return (data ?? []) as { name: string; content: string | null }[]; } });
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["my_agents"],
    queryFn: async () => { const { data, error } = await supabase.from("my_agents").select("*, departments(name)").order("created_at", { ascending: false }); if (error) throw error; return data as any[]; },
  });

  const exportAgent = async (agent: any) => {
    try {
      const [{ default: JSZip }, fs] = await Promise.all([import("jszip"), import("file-saver")]);
      const saveAs = (fs as any).saveAs ?? (fs as any).default?.saveAs ?? (fs as any).default;
      const zip = new JSZip();
      const dir = slug(agent.name);
      const root = zip.folder(dir)!;
      const cd = root.folder(".claude")!;
      cd.file("CLAUDE.md", companyPrefix(company) + (agent.claude_md ?? ""));
      const ad = cd.folder("agents")!;
      (Array.isArray(agent.subagents) ? agent.subagents : []).forEach((a: any) => { if (a?.name) ad.file(`${a.name}.md`, agentMd(a)); });
      const sd = cd.folder("skills")!;
      (Array.isArray(agent.skills) ? agent.skills : []).forEach((s: any) => {
        const nm = typeof s === "string" ? s : s?.name;
        if (!nm) return;
        const content = skills.find((x) => x.name === nm)?.content || defaultSkill(nm);
        sd.folder(slug(nm))!.file("SKILL.md", content);
      });
      cd.file(".mcp.json", JSON.stringify({ mcpServers: {} }, null, 2));
      root.file("README.md", `# ${agent.name}\n\n由 AI Agent 平台匯出，可用於 Claude Code：\n\n\`\`\`bash\ncd ${dir}\nclaude\n\`\`\`\n`);
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${dir}.claude.zip`);
      toast.success("已匯出 " + agent.name);
    } catch (e: any) {
      toast.error("匯出失敗：" + (e?.message ?? e));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="匯出部署" description="打包代理為 .claude bundle，可直接用於 Claude Code" />
      {isLoading ? <p className="text-muted-foreground">載入中…</p> : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>代理</TableHead><TableHead>部門</TableHead><TableHead>狀態</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">尚無代理（請先至「個人訓練」建立）</TableCell></TableRow>}
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.departments?.name ?? "—"}</TableCell>
                  <TableCell><Badge variant={r.status === "ready" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    {canExport && <Button size="sm" onClick={() => exportAgent(r)}>匯出 .claude</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  );
}
