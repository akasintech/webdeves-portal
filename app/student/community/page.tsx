"use client"

import { useState } from "react"
import { mockRecentQuestions, mockStudyGroups, mockAdminChats } from "@/lib/mock-data/community"

type Tab = "forum" | "chat" | "groups"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("forum")
  const [questionTitle, setQuestionTitle] = useState("")
  const [questionBody, setQuestionBody] = useState("")
  const [posted, setPosted] = useState(false)

  const handlePost = () => {
    if (!questionTitle.trim() || !questionBody.trim()) return
    setPosted(true)
    setQuestionTitle("")
    setQuestionBody("")
    setTimeout(() => setPosted(false), 3000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Community &amp; Forum</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">Connect with peers and instructors.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-100">
        {(["forum", "chat", "groups"] as Tab[]).map((tab) => {
          const labels: Record<Tab, string> = { forum: "Forum", chat: "Chat with Admin", groups: "Study Groups" }
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[13.5px] font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {labels[tab]}
            </button>
          )
        })}
      </div>

      {/* Forum Tab */}
      {activeTab === "forum" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-[14px] font-semibold text-gray-900 mb-4">Ask a Question</h2>
            {posted && (
              <div className="mb-3 p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-[13px]">
                ✓ Your question has been posted successfully!
              </div>
            )}
            <div className="space-y-3">
              <input
                type="text"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="Question title..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-[13.5px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <textarea
                value={questionBody}
                onChange={(e) => setQuestionBody(e.target.value)}
                placeholder="Describe your question in detail..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-[13.5px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
              />
              <button
                onClick={handlePost}
                className="px-5 py-2.5 bg-gray-900 text-white text-[13px] font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Post Question
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-[14px] font-semibold text-gray-900 mb-4">Recent Questions</h2>
            <div className="divide-y divide-gray-50">
              {mockRecentQuestions.map((q) => (
                <div key={q.id} className="py-4 cursor-pointer hover:bg-gray-50/50 -mx-5 px-5 transition-colors">
                  <p className="text-[13.5px] font-semibold text-gray-900 hover:text-[#8C2453] transition-colors">
                    {q.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[12px] text-gray-400">
                    <span>by <span className="text-[#8C2453] font-medium">{q.author}</span></span>
                    <span>{q.replies} replies</span>
                    <span>{q.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat with Admin Tab */}
      {activeTab === "chat" && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-[14px] font-semibold text-gray-900 mb-4">Chat with Admin</h2>
          <div className="space-y-3">
            {mockAdminChats.map((chat) => (
              <div key={chat.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                  {chat.admin.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-gray-900">{chat.admin}</p>
                    <span className="text-[11px] text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-[12.5px] text-gray-600 mt-0.5">{chat.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <button className="px-4 py-2.5 bg-gray-900 text-white text-[13px] font-semibold rounded-lg hover:bg-gray-700 transition-colors">
              Send
            </button>
          </div>
        </div>
      )}

      {/* Study Groups Tab */}
      {activeTab === "groups" && (
        <div className="space-y-3">
          {mockStudyGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:border-gray-200 transition-colors">
              <div>
                <p className="text-[14px] font-bold text-gray-900">{group.name}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  {group.members} members · Last active {group.lastActive}
                </p>
              </div>
              <button className="px-4 py-2 bg-gray-900 text-white text-[12.5px] font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                Join
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
