"use client";

import { useState, useEffect } from "react";
import { useApiKey } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

export function Settings() {
  const { apiKey, saveApiKey, isLoaded } = useApiKey();
  const [inputKey, setInputKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Sync loaded key to local input state
  useEffect(() => {
    if (isLoaded && inputKey === "" && apiKey && !isSaved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputKey(apiKey);
    }
  }, [isLoaded, apiKey, inputKey, isSaved]);

  const handleSave = () => {
    saveApiKey(inputKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Card className="shadow-lg border-white/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          AI 상담 설정 (Gemini API Key)
        </CardTitle>
        <CardDescription>
          안전한 사용을 위해 API Key는 브라우저에만 저장되며 서버로 전송되지 않습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="AI Studio API Key 입력"
            value={inputKey}
            onChange={(e) => {
              setInputKey(e.target.value);
              setIsSaved(false);
            }}
            className="flex-1 font-mono bg-white/5 border-white/10 focus-visible:ring-indigo-500"
          />
          <Button onClick={handleSave} variant={isSaved ? "secondary" : "default"} className={!isSaved ? "bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all" : "bg-emerald-600 hover:bg-emerald-500 text-white"}>
            {isSaved ? "저장됨" : "저장"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
