"use client";

import { useState, useRef, useEffect } from "react";
import { useApiKey, usePortfolio } from "@/lib/hooks";
import { askPortfolioAdvisor } from "@/lib/gemini";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BotMessageSquare, Send, User, Bot, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export function ChatInterface() {
  const { apiKey } = useApiKey();
  const { records } = usePortfolio();
  
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "model",
    text: "안녕하세요! 저는 AI 포트폴리오 어드바이저입니다. 현재 포트폴리오에 대해 궁금한 점이나 분산 투자 조언이 필요하시면 언제든 질문해주세요."
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add User Message
    const newMessages: ChatMessage[] = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Map history for Gemini format (skipping the first greeting as it's not strictly needed for model context, or map all)
      const history = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const reply = await askPortfolioAdvisor(apiKey, records, history, userMessage);
      
      setMessages([...newMessages, { role: "model", text: reply }]);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "알 수 없는 오류";
      setMessages([...newMessages, { role: "model", text: `오류가 발생했습니다: ${msg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <Card className="shadow-2xl border-white/5 h-[600px] flex flex-col justify-center items-center text-center p-6">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <CardTitle className="text-xl mb-2">API Key가 필요합니다</CardTitle>
        <CardDescription>
          AI 상담을 시작하려면 설정에서 Google Gemini API Key를 먼저 저장해주세요.
        </CardDescription>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl border-white/5 h-full max-h-[800px] flex flex-col relative overflow-hidden backdrop-blur-3xl">
      {/* Decorative ambient light */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      
      <CardHeader className="pb-4 border-b border-white/5 relative z-10">
        <CardTitle className="text-xl flex items-center gap-2">
          <BotMessageSquare className="w-5 h-5 text-primary" />
          AI 포트폴리오 상담
        </CardTitle>
        <CardDescription>자신의 포트폴리오를 기반으로 객관적인 조언을 들어보세요.</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message, i) => (
            <div key={i} className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${message.role === "user" ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" : "bg-white/10 text-cyan-300"}`}>
                {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${message.role === "user" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-tr-sm" : "bg-white/5 border border-white/5 rounded-tl-sm text-slate-200"}`}>
                {message.role === "user" ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-muted text-muted-foreground">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 rounded-tl-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
        
        <div className="p-4 border-t border-white/5 mt-auto bg-slate-950/50 backdrop-blur-md z-10">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="포트폴리오에 대해 질문을 입력하세요..."
              className="flex-1 bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 shadow-[0_0_15px_rgba(99,102,241,0.3)] border-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
