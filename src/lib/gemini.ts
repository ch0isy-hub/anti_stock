import { GoogleGenerativeAI } from "@google/generative-ai";
import { StockRecord } from "./types";

export async function askPortfolioAdvisor(
  apiKey: string,
  portfolio: StockRecord[],
  history: { role: "user" | "model", parts: { text: string }[] }[],
  message: string
) {
  if (!apiKey) {
    throw new Error("API Key가 필요합니다.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Calculate summary for context
  let totalInvestment = 0;
  const sectors: Record<string, number> = {};
  
  portfolio.forEach(p => {
    totalInvestment += p.totalAmount;
    sectors[p.sector] = (sectors[p.sector] || 0) + p.totalAmount;
  });

  const portfolioContext = portfolio.length > 0 
    ? `사용자의 현재 포트폴리오 요약:
총 투자 금액: ${totalInvestment.toLocaleString()}원
섹터별 비중: ${JSON.stringify(sectors)}
보유 상세 종목 목록:
${portfolio.map(p => `- ${p.symbol} (${p.sector}): ${p.purchasePrice}원 * ${p.quantity}주 = ${p.totalAmount}원 (${p.purchaseDate} 매수)`).join('\n')}
`
    : `현재 사용자는 주식 매수 기록이 없습니다.`;

  const systemInstruction = `당신은 사용자의 투자 포트폴리오를 분석하고 답변을 제공하는 전문적이고 친절한 AI 주식 어드바이저(AI Stock Portfolio Advisor)입니다.
항상 한국어로 답변하며, 사용자가 현재 보유한 포트폴리오(아래 시스템 주입 데이터)를 바탕으로 구체적인 조언을 해주세요.
위험 평가, 분산 투자 조언, 섹터 편중 리스크 등을 객관적이고 알기 쉽게 설명해 주세요.

[시스템 제공 포트폴리오 상태]
${portfolioContext}`;

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction,
  });

  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}
