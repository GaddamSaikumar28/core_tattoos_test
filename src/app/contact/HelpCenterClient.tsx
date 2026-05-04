"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, HelpCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HelpCenterClient({ data }: { data: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      order: formData.get("order"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(data.successMessage);
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gray-50 py-16 sm:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight sm:text-5xl">
            {data.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto whitespace-pre-line">
            {data.heroDescription}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Quick Contact Cards */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{data.contactTitle}</h2>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-lg shrink-0">
                <MessageSquare className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-500 mt-1">{data.chatText}</p>
                <button 
                  onClick={() => window.dispatchEvent(new Event('open-chat'))} 
                  className="mt-2 text-sm font-bold text-[#fe8204] hover:text-orange-700"
                >
                  Start a conversation &rarr;
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-lg shrink-0">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-500 mt-1">Drop us a line anytime</p>
                <a href={`mailto:${data.email}`} className="mt-2 text-sm font-bold text-[#fe8204] hover:text-orange-700 block">
                  {data.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-lg shrink-0">
                <HelpCircle className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">FAQ & Policies</h3>
                <p className="text-sm text-gray-500 mt-1">Find answers instantly</p>
                <a href="/returns" className="mt-2 text-sm font-bold text-[#fe8204] hover:text-orange-700 block">
                  Read our policies &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{data.formTitle}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3 px-4 bg-gray-50 border" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3 px-4 bg-gray-50 border" placeholder="jane@example.com" />
                  </div>
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700">Order Number (Optional)</label>
                  <input type="text" id="order" name="order" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3 px-4 bg-gray-50 border" placeholder="#1001" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">How can we help?</label>
                  <textarea id="message" name="message" rows={5} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3 px-4 bg-gray-50 border resize-none" placeholder="Briefly describe your issue..." />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-black hover:bg-[#fe8204] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 text-white" /> : <><span className="mr-2">Send Message</span><Send className="h-4 w-4" /></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}