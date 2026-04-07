import { Settings } from "@/components/Settings";
import { PurchaseForm } from "@/components/PurchaseForm";
import { PortfolioTable } from "@/components/PortfolioTable";
import { ChatInterface } from "@/components/ChatInterface";
import { TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">Stock Advisor AI</span>
          </h1>
          <p className="text-slate-400 md:w-[70%] mt-2 text-sm md:text-base leading-relaxed">
            포트폴리오를 관리하고 AI 어드바이저와 상담하여 더 나은 투자 결정을 내리세요.
          </p>
        </div>
        <div className="w-full md:w-auto md:min-w-[350px]">
          <Settings />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          <PurchaseForm />
          <PortfolioTable />
        </div>
        
        <div className="lg:col-span-1 h-[600px] lg:h-auto min-h-[600px]">
          <div className="sticky top-8 h-full"> 
            <ChatInterface />
          </div>
        </div>
      </div>
    </main>
  );
}
