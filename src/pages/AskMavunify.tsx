import { useState, useRef, useEffect } from "react";
import { Send, Mic, Camera, Sprout, BookOpen, Star, MapPin } from "lucide-react";
import AppLayout from "@/components/AppLayout";

type Message = { role: "user" | "ai"; text: string; time: string };

const SUGGESTIONS = [
  "My coffee leaves are turning yellow — what should I do?",
  "When is the best time to plant beans in Mbale?",
  "How do I make compost from banana peels?",
  "My maize is not growing well — please help",
];

const INITIAL: Message[] = [
  {
    role: "ai",
    text: "Hello Nakato! 👋 I'm Mavunify, your personal farming advisor. I know your farm in Mbale and your coffee and bean crops.\n\nHow can I help you grow better today? You can ask me anything — about your crops, soil, pests, weather, or farming practices. You can also send a photo of a problem and I will help you.",
    time: "Now",
  },
];

const AI_REPLIES: Record<string, string> = {
  yellow: "Yellow leaves on coffee plants usually means one of three things:\n\n🍂 **Nutrient deficiency** — most likely nitrogen or iron. Mix 2kg of organic compost per tree into the soil around the base.\n\n🦟 **Coffee leaf rust** — look for orange powder under the leaves. If you see it, spray with neem oil solution (2 tablespoons per 5 litres of water).\n\n💧 **Overwatering** — check if the soil is too wet. Coffee roots need air.\n\nCan you send me a photo of the leaf? That will help me give you the exact answer.",
  beans: "In Mbale, the best time to plant beans is:\n\n🌱 **Long rains season:** March to May — plant in early March when the rains begin\n🌱 **Short rains season:** September to November — plant in early September\n\nFor your soil in Mbale, I recommend:\n• Plant 4 seeds per hole, 30cm apart\n• Mix compost into the soil before planting\n• Your soil has good drainage — good for beans!\n\nWould you like me to remind you when to plant?",
  compost: "Great choice! Composting with banana peels is excellent for your coffee plants. Here's how:\n\n1. 🍌 Collect banana peels, coffee husks, kitchen waste, and dried leaves\n2. 📦 Make a heap 1 metre wide and 1 metre tall\n3. 💧 Keep it moist — water it like bread dough\n4. 🔄 Turn the pile every 2 weeks\n5. ✅ Ready in 6-8 weeks — it should smell like earth\n\nBanana peels are rich in potassium — perfect for your coffee trees!\n\nWould you like me to add a reminder to turn your compost?",
  default: "Thank you for your question! I am looking at your farm details in Mbale to give you the best advice.\n\nFor your coffee and bean crops, here is my recommendation:\n\n🌿 Focus on building your soil first — healthy soil grows healthy crops\n💧 Manage water carefully — too much or too little hurts yields\n🌱 Use organic inputs where possible — they help your sustainability score\n\nCould you tell me more about the problem you are seeing? A photo would help me advise you better.",
};

function getReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("yellow") || t.includes("leaf") || t.includes("rust")) return AI_REPLIES.yellow;
  if (t.includes("bean") || t.includes("plant") || t.includes("when")) return AI_REPLIES.beans;
  if (t.includes("compost") || t.includes("banana") || t.includes("fertiliz")) return AI_REPLIES.compost;
  return AI_REPLIES.default;
}

function formatText(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      )}
      {i < text.split("\n").length - 1 && <br />}
    </span>
  ));
}

export default function AskMavunify() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text, time: now }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: getReply(text), time: now }]);
      setLoading(false);
    }, 1400);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100svh-4rem)] lg:h-screen max-w-3xl mx-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 bg-white border-b border-[#EAF3EA] flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-[#1C2B1C]">Ask Mavunify</p>
            <p className="text-xs text-[#5A6B5A] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] inline-block" />
              Your personal farming advisor · Knows your farm
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="px-2.5 py-1 bg-[#F3F8F3] border border-[#D8EAD8] rounded-full text-xs font-semibold text-[#2E7D32] flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Mbale
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
              {m.role === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center flex-shrink-0 mt-1">
                  <Sprout className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[82%] ${m.role === "user" ? "chat-bubble-user px-4 py-3" : "chat-bubble px-4 py-3"}`}
                style={m.role === "ai" ? { background: "#F3F8F3", borderRadius: "18px 18px 18px 4px", border: "1px solid #D8EAD8" } : {}}>
                <p className="text-sm leading-relaxed">{formatText(m.text)}</p>
                <p className={`text-[10px] mt-1.5 ${m.role === "user" ? "text-white/60 text-right" : "text-[#8A9B8A]"}`}>{m.time}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center flex-shrink-0">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[#F3F8F3] border border-[#D8EAD8] rounded-2xl px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[#2E7D32] animate-bounce" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 sm:px-6 pb-3">
            <p className="text-xs text-[#8A9B8A] mb-2 font-medium">Common questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 bg-white border border-[#D8EAD8] text-xs font-medium text-[#5A6B5A] rounded-full hover:border-[#2E7D32] hover:text-[#2E7D32] transition-smooth"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related resources */}
        {messages.length > 2 && (
          <div className="px-4 sm:px-6 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { icon: BookOpen, label: "Composting Guide", color: "#7B1FA2" },
                { icon: Star, label: "Coffee Farming Basics", color: "#F9A825" },
              ].map(({ icon: Icon, label, color }) => (
                <button key={label} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EAF3EA] rounded-xl text-xs font-semibold text-[#5A6B5A] whitespace-nowrap hover:border-[#2E7D32] transition-smooth flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" style={{ color }} /> {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-[#EAF3EA] flex-shrink-0">
          <div className="flex items-end gap-2">
            <button className="p-3 rounded-xl border border-[#D8EAD8] text-[#5A6B5A] hover:bg-[#F3F8F3] transition-smooth flex-shrink-0">
              <Camera className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask anything about your farm..."
                rows={1}
                className="w-full px-4 py-3 pr-10 rounded-2xl border border-[#D8EAD8] bg-[#FAFAF7] text-sm text-[#1C2B1C] placeholder:text-[#8A9B8A] focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 resize-none transition-smooth"
                style={{ minHeight: 48 }}
              />
            </div>
            <button className="p-3 rounded-xl border border-[#D8EAD8] text-[#5A6B5A] hover:bg-[#F3F8F3] transition-smooth flex-shrink-0">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="p-3 rounded-xl bg-[#2E7D32] text-white hover:bg-[#1B5E20] disabled:opacity-40 transition-smooth flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-[#8A9B8A] text-center mt-2">Mavunify uses your farm profile to give personalized advice</p>
        </div>
      </div>
    </AppLayout>
  );
}
