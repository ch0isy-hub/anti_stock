"use client";

import { usePortfolio } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, PieChart, Briefcase } from "lucide-react";
import { useMemo } from "react";

export function PortfolioTable() {
  const { records, removeRecord, isLoaded } = usePortfolio();

  const { totalInvestment, totalStocks } = useMemo(() => {
    let totalInv = 0;
    const uniqueStocks = new Set();
    records.forEach(r => {
      totalInv += r.totalAmount;
      uniqueStocks.add(r.symbol);
    });
    return {
      totalInvestment: totalInv,
      totalStocks: uniqueStocks.size
    };
  }, [records]);

  // Sector Distribution
  const sectorDistribution = useMemo(() => {
    if (totalInvestment === 0) return {};
    const sectors: Record<string, number> = {};
    records.forEach(r => {
      sectors[r.sector] = (sectors[r.sector] || 0) + r.totalAmount;
    });
    const dist: Record<string, string> = {};
    Object.keys(sectors).forEach(sec => {
      dist[sec] = ((sectors[sec] / totalInvestment) * 100).toFixed(1);
    });
    return dist;
  }, [records, totalInvestment]);

  if (!isLoaded) return <div className="animate-pulse h-64 bg-card rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-white/5 shadow-sm transform transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">총 투자 금액</p>
              <h3 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{totalInvestment.toLocaleString()}원</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/5 shadow-sm transform transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">보유 종목 수</p>
              <h3 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{totalStocks}개</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/5 shadow-sm transform transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 w-full truncate">
              <p className="text-sm text-muted-foreground font-medium">섹터 비중 Top</p>
              <div className="flex gap-2 mt-1 overflow-x-auto no-scrollbar pb-1">
                {Object.keys(sectorDistribution).length === 0 ? (
                  <span className="text-sm font-medium">데이터 없음</span>
                ) : (
                  Object.entries(sectorDistribution)
                    .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
                    .slice(0, 2)
                    .map(([sec, pct]) => (
                      <Badge key={sec} variant="secondary" className="whitespace-nowrap bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                        {sec} {pct}%
                      </Badge>
                    ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-2xl border-white/5">
        <CardHeader>
          <CardTitle>보유 주식 내역</CardTitle>
          <CardDescription>전체 매수 기록을 시간순으로 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              등록된 주식 매수 기록이 없습니다. 새로운 내역을 추가해보세요!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>종목명</TableHead>
                    <TableHead>섹터</TableHead>
                    <TableHead>매수 일자</TableHead>
                    <TableHead className="text-right">매수 단가</TableHead>
                    <TableHead className="text-right">수량</TableHead>
                    <TableHead className="text-right">총 투자액</TableHead>
                    <TableHead className="w-[80px] text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id} className="transition-colors hover:bg-white/5 group">
                      <TableCell className="font-semibold">{r.symbol}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{r.sector}</Badge>
                      </TableCell>
                      <TableCell>{r.purchaseDate}</TableCell>
                      <TableCell className="text-right">{r.purchasePrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.quantity.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">{r.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRecord(r.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
