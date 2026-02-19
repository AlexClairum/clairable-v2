"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, UserPlus } from "lucide-react";
import Link from "next/link";

interface AdminDashboardProps {
  totalMembers: number;
  adoptionPct: number;
  totalTried: number;
  successRate: number;
  totalTimeSaved: number;
  popularUseCases: { title: string; count: number }[];
}

export function AdminDashboard({
  totalMembers,
  adoptionPct,
  totalTried,
  successRate,
  totalTimeSaved,
  popularUseCases,
}: AdminDashboardProps) {
  function exportCsv() {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Total team members", totalMembers],
      ["Adoption %", adoptionPct],
      ["Total use cases tried", totalTried],
      ["Success rate %", successRate],
      ["Est. total time saved (min)", totalTimeSaved],
    ];
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
      "",
      "Popular use cases",
      "Title,Attempts",
      ...popularUseCases.map((uc) => `"${uc.title}",${uc.count}`),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clairable-metrics.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/invite">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite team
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalMembers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Adoption %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{adoptionPct}%</p>
            <p className="text-xs text-muted-foreground">who tried at least one</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Use cases tried
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTried}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{successRate}%</p>
            <p className="text-xs text-muted-foreground">worked / tried</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Est. time saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">~{totalTimeSaved} min</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Use cases by popularity</CardTitle>
        </CardHeader>
        <CardContent>
          {popularUseCases.length === 0 ? (
            <p className="text-muted-foreground">No attempts yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Use case</TableHead>
                  <TableHead>Attempts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularUseCases.map((uc, i) => (
                  <TableRow key={i}>
                    <TableCell>{uc.title}</TableCell>
                    <TableCell>{uc.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
