"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { usePortfolio } from "@/lib/hooks";
import { Sector, StockRecord } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const SECTORS: Sector[] = ["IT", "금융", "헬스케어", "에너지", "소비재", "산업재", "기타"];

export function PurchaseForm() {
  const { addRecord } = usePortfolio();
  const [symbol, setSymbol] = useState("");
  const [sector, setSector] = useState<string>("IT");
  const [purchaseDate, setPurchaseDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [priceStr, setPriceStr] = useState("");
  const [quantityStr, setQuantityStr] = useState("");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setPriceStr(val);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setQuantityStr(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !priceStr || !quantityStr) return;

    const price = parseInt(priceStr, 10);
    const quantity = parseInt(quantityStr, 10);

    const record: StockRecord = {
      id: uuidv4(),
      symbol: symbol.toUpperCase(),
      sector,
      purchaseDate,
      purchasePrice: price,
      quantity,
      totalAmount: price * quantity,
    };

    addRecord(record);
    // Reset form
    setSymbol("");
    setPriceStr("");
    setQuantityStr("");
  };

  return (
    <Card className="shadow-lg border-white/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-primary" />
          신규 매수 기록
        </CardTitle>
        <CardDescription>새로운 주식 매수 내역을 추가합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">종목명 (Ticker)</Label>
              <Input
                id="symbol"
                placeholder="예: TSLA"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">섹터 (분야)</Label>
              <Select value={sector} onValueChange={(val) => setSector(val || "")}>
                <SelectTrigger id="sector">
                  <SelectValue placeholder="섹터를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map((sec) => (
                    <SelectItem key={sec} value={sec}>
                      {sec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">매수 일자</Label>
              <Input
                id="date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
                className="block w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">매수 단가 (원)</Label>
              <Input
                id="price"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="숫자만 입력"
                value={priceStr}
                onChange={handlePriceChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qty">매수 수량</Label>
              <Input
                id="qty"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="숫자만 입력"
                value={quantityStr}
                onChange={handleQuantityChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 border-0 font-bold tracking-wide mt-2">
            추가하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
