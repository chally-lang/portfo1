"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for the custom event from Hero component
  useEffect(() => {
    const handleOpenAssistant = () => {
      setOpen(true);
    };

    window.addEventListener('openPortfolioAssistant', handleOpenAssistant);
    
    return () => {
      window.removeEventListener('openPortfolioAssistant', handleOpenAssistant);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botReply = { role: "assistant", text: data.reply || "..." };
      setMessages((prev) => [...prev, botReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error getting reply." },
      ]);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-200 hover:scale-105"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white shadow-2xl rounded-lg flex flex-col z-50">
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">Charles AI Assistant</span>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center text-gray-600 mb-4">
                  <p className="text-sm">Quick Actions</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/about"
                    className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200">
                      <span className="text-blue-600 text-sm">👨‍💻</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">About Developer</p>
                      <p className="text-blue-600 text-xs">Learn about my skills & experience</p>
                    </div>
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-green-200">
                      <span className="text-green-600 text-sm">📞</span>
                    </div>
                    <div>
                      <p className="font-medium text-green-900 text-sm">Contact Developer</p>
                      <p className="text-green-600 text-xs">Get in touch for projects</p>
                    </div>
                  </Link>
                  
                  <Link
                    href="/projects"
                    className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-purple-200">
                      <span className="text-purple-600 text-sm">🚀</span>
                    </div>
                    <div>
                      <p className="font-medium text-purple-900 text-sm">View Projects</p>
                      <p className="text-purple-600 text-xs">Explore my portfolio work</p>
                    </div>
                  </Link>
                </div>
                <div className="text-center text-gray-500 text-xs mt-4 pt-4 border-t border-gray-200">
                  Or start a conversation below 👇
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-900 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 mr-2 text-gray-900 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
