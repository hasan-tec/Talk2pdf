import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Zap, MessageSquare } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-[56px] leading-tight font-bold mb-6 max-w-[900px] mx-auto"
          >
            Turn Complex PDFs into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Easy-to-Understand
            </span>{' '}
            Summaries in Seconds
          </motion.h1>
          <div className="flex justify-center gap-4 mb-16">
            <Input
              type="email"
              placeholder="Enter your email..."
              className="max-w-[280px] h-12 bg-[#1A1A1A] border-[#2A2A2A] rounded-lg"
            />
            <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg" onClick={onGetStarted}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Screenshot Sections */}
      <section className="px-4 py-12">
        <div className="max-w-[1200px] mx-auto space-y-24">
          {[
            { title: "Engage Effortlessly, Get Insights Fast", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&h=600&fit=crop" },
            { title: "Generate Deep, Concise Summaries Instantly", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop" },
            { title: "Maximize Your Document's Value For All Your Documents", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="animate-on-scroll"
            >
              <img
                src={item.image}
                alt={item.title}
                className="rounded-xl shadow-2xl w-full"
              />
              <h3 className="text-xl font-medium mt-6 text-center text-gray-300">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section className="px-4 py-24">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">The right tools just for you...</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Smart Document Analysis", description: "Advanced AI processing for comprehensive document understanding" },
              { icon: Zap, title: "Instant Summaries", description: "Get key insights and summaries in seconds" },
              { icon: MessageSquare, title: "Interactive Chat", description: "Chat with your documents for deeper insights" }
            ].map((item, i) => (
              <Card key={i} className="bg-[#1A1A1A] border-[#2A2A2A] overflow-hidden">
                <CardContent className="p-8">
                  <item.icon className="h-12 w-12 text-blue-500 mb-6" />
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="px-4 py-24 bg-[#0D0D0D]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">
            40+ Free AI-Powered Tools to Help
            <br />
            You Bring Any Ideas To Life
          </h2>
          <div className="grid grid-cols-8 gap-4 max-w-[800px] mx-auto mb-8">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
              >
                <span className="text-blue-400 text-sm font-medium">AI</span>
              </motion.div>
            ))}
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onGetStarted}>
            Explore All Tools
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-24">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">You asked,</h2>
          <p className="text-xl text-gray-400 mb-16">We answer</p>
          <div className="max-w-[800px] mx-auto space-y-4">
            {[
              "How does the PDF analysis work?",
              "What types of documents can I process?",
              "Is my data secure?",
              "What are the pricing plans?"
            ].map((question, i) => (
              <Card key={i} className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardContent className="p-6 text-left">
                  <h3 className="text-lg font-semibold mb-2">{question}</h3>
                  <p className="text-gray-400">
                    This is a detailed answer to the frequently asked question about our PDF analysis service.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 bg-[#0D0D0D]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Make your academic and
            <br />
            professional life easier with
            <br />
            AskYourPDF
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onGetStarted}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-16 border-t border-[#2A2A2A]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {['Product', 'Company', 'Resources', 'Legal', 'Support'].map((section) => (
              <div key={section}>
                <h3 className="font-bold mb-6">{section}</h3>
                <ul className="space-y-4">
                  {['Features', 'Pricing', 'Documentation', 'Support'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 flex justify-between items-center">
            <p className="text-sm text-gray-400">© 2024 AskYourPDF. All rights reserved.</p>
            <img
              src="/qr-code.png"
              alt="QR Code"
              className="w-24 h-24 opacity-80"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}