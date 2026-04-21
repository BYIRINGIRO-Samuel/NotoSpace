import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, Clock, Users, Star, ArrowRight, Shield, Zap, Sparkles, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      title: 'Smart Note Organization',
      description: 'Automatically categorize and tag your notes with our AI-powered organization system.',
      icon: <Sparkles className="w-6 h-6 text-[#349156]" />
    },
    {
      title: 'Real-time Collaboration',
      description: 'Work together with classmates on shared assignments and projects in real-time.',
      icon: <Users className="w-6 h-6 text-[#349156]" />
    },
    {
      title: 'Instant Resource Sharing',
      description: 'Upload and share PDFs, videos, and study guides with your community instantly.',
      icon: <BookOpen className="w-6 h-6 text-[#349156]" />
    },
    {
      title: 'Secure Progress Tracking',
      description: 'Monitor your learning journey with end-to-end encrypted progress analytics.',
      icon: <Shield className="w-6 h-6 text-[#349156]" />
    }
  ];

  const faqs = [
    {
      question: "What exactly is NotoSpace?",
      answer: "NotoSpace is a collaborative digital workspace designed specifically for students and educators. It combines note-taking, file sharing, and project management in one seamless platform."
    },
    {
      question: "Is my data secure on the platform?",
      answer: "Absolutely. We use industry-standard encryption for all your notes and shared files. Your private study space remains private."
    },
    {
      question: "Can I use NotoSpace for group projects?",
      answer: "Yes! NotoSpace's core feature is real-time collaboration. You can create shared notebooks and work together with your team synchronously."
    }
  ];

  const partners = ["Stanford University", "MIT", "Oxford", "Harvard", "Cambridge"];

  return (
    <div className="min-h-screen bg-white font-poppins text-gray-900">
      
      {/* Hero Section & Integrated Navbar */}
      <section className="relative pt-6 pb-20 overflow-hidden bg-[#f7faf9]">
        <div className="max-w-7xl mx-auto px-4 relative">
          
          {/* Framed Navbar - Integrated with minimal bottom space */}
          <nav className="bg-white border border-[#349156]/10 rounded-2xl px-8 py-5 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top duration-700">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#349156]/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-[#349156]" />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">NotoSpace</span>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <a href="#hero" className="text-[#349156] font-semibold text-sm">Home</a>
              <a href="#features" className="text-gray-500 font-medium text-sm hover:text-[#349156] transition">Features</a>
              <a href="#social-proof" className="text-gray-500 font-medium text-sm hover:text-[#349156] transition">Community</a>
              <a href="#faq" className="text-gray-500 font-medium text-sm hover:text-[#349156] transition">Q&A</a>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/login" className="text-gray-600 font-semibold text-sm hover:text-[#349156] transition">Sign In</Link>
              <Link to="/signup" className="px-6 py-2.5 border border-[#349156]/30 text-[#349156] rounded-xl font-bold text-sm hover:bg-[#349156] hover:text-white transition shadow-sm">
                Join Now
              </Link>
            </div>
          </nav>

          {/* Reduced space under navbar (approx 5px conceptually via very small mt on content) */}
          <div id="hero" className="flex flex-col md:flex-row items-center gap-12 relative pt-[5px] pb-10">
            {/* Left Content */}
            <div className="flex-1 space-y-8 z-10 animate-in fade-in slide-in-from-left duration-700">
              <div className="absolute top-10 -left-10 opacity-30">
                 <div className="grid grid-cols-4 gap-2">
                   {[...Array(12)].map((_, i) => (
                     <div key={i} className="w-2 h-1 bg-orange-400 rounded-full rotate-45" />
                   ))}
                 </div>
              </div>

              <div className="space-y-6 pt-10">
                <span className="text-[#349156] font-bold tracking-widest uppercase text-xs opacity-70">Elevate your study game</span>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900">
                  Sharpen Your <br />
                  <span className="text-[#349156]">Success</span> with <br />
                  NotoSpace.
                </h1>
                <p className="text-xl text-gray-500 max-w-md leading-relaxed font-light">
                  The ultimate digital workspace for your notes, assignments, and collaborative learning.
                </p>
              </div>

              <div className="pt-4">
                <button className="px-10 py-5 bg-[#349156] text-white rounded-2xl font-bold text-lg hover:bg-[#2a7a45] transition-all hover:shadow-2xl shadow-xl shadow-[#349156]/30 flex items-center gap-2 group">
                  Start Learning Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative animate-in fade-in slide-in-from-right duration-700">
              <div className="relative z-10">
                <img 
                  src="/hero.png" 
                  alt="Student Studying" 
                  className="w-full h-auto object-contain scale-110 drop-shadow-xl"
                />
              </div>
              
              <div className="absolute top-1/4 left-0 text-[#349156] opacity-20 z-0">
                 <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                   <path d="M10 50C25 45 35 25 50 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                   <path d="M45 10H50V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                 </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="social-proof" className="py-20 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Trusted by students from</h2>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {partners.map(p => (
                <span key={p} className="text-2xl font-bold text-gray-800">{p}</span>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-12">
             <div className="bg-[#349156]/5 px-6 py-3 rounded-full flex items-center gap-4 border border-[#349156]/10">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+25}`} alt="User" />
                     </div>
                   ))}
                </div>
                <span className="text-sm font-semibold text-gray-600">Join over <span className="text-[#349156]">50,000+</span> active learners today</span>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
               <span className="text-[#349156] font-bold text-sm tracking-widest uppercase">Features</span>
               <h2 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight">Everything you need to <span className="text-[#349156]">excel</span> in your studies</h2>
            </div>
            <p className="text-gray-500 max-w-sm">Built by students, for students. We understand the hurdles of collaborative learning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-gray-100 hover:border-[#349156]/20 hover:bg-[#349156]/[0.02] transition-all duration-300">
                <div className="w-14 h-14 bg-[#349156]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Q&A / FAQ Section */}
      <section id="faq" className="py-24 bg-[#fcfdfd]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
             <span className="text-[#349156] font-bold text-sm tracking-widest uppercase">Q&A</span>
             <h2 className="text-4xl font-extrabold mt-4">Questions? We have answers</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`border bg-white rounded-3xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-[#349156] shadow-lg' : 'border-gray-100'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-bold text-gray-800">{faq.question}</span>
                  {openFaq === i ? <ChevronUp className="text-[#349156]" /> : <ChevronDown className="text-gray-400" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-8 pb-8 text-gray-500 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
         <div className="bg-[#349156] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 space-y-8">
               <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">Ready to transform how <br /> you learn?</h2>
               <p className="text-white/80 text-xl max-w-2xl mx-auto">Join NotoSpace today and start building your knowledge base with the best collaborative tools.</p>
               <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <button className="px-10 py-5 bg-white text-[#349156] rounded-2xl font-bold text-lg hover:bg-gray-50 transition shadow-xl">Get Started for Free</button>
                  <button className="px-10 py-5 bg-transparent border border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition">Learn More</button>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-gray-900 text-white font-poppins">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-[#349156]" />
                <span className="text-2xl font-bold tracking-tight">NotoSpace</span>
               </div>
               <p className="text-gray-400 text-sm leading-relaxed">
                  The complete digital ecosystem for modern students and dedicated educators.
               </p>
            </div>
            <div>
               <h4 className="text-lg font-bold mb-6 underline decoration-[#349156] underline-offset-8">Platform</h4>
               <ul className="space-y-4 text-gray-400 text-sm">
                  <li><a href="#features" className="hover:text-[#349156] transition">Features</a></li>
                  <li><a href="#hero" className="hover:text-[#349156] transition">Note Sharing</a></li>
                  <li><a href="#social-proof" className="hover:text-[#349156] transition">Collaboration</a></li>
               </ul>
            </div>
            <div>
               <h4 className="text-lg font-bold mb-6 underline decoration-[#349156] underline-offset-8">Support</h4>
               <ul className="space-y-4 text-gray-400 text-sm">
                  <li><a href="#faq" className="hover:text-[#349156] transition">FAQ</a></li>
                  <li><Link to="#" className="hover:text-[#349156] transition">Contact Us</Link></li>
                  <li><Link to="#" className="hover:text-[#349156] transition">Privacy Policy</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="text-lg font-bold mb-6 underline decoration-[#349156] underline-offset-8">Stay Updated</h4>
               <p className="text-gray-400 text-sm mb-4">Connect with us for learning tips and updates.</p>
               <div className="flex bg-white/10 rounded-xl p-1.5 border border-white/10">
                  <input type="email" placeholder="Your email.." className="bg-transparent border-none focus:outline-none px-3 text-sm flex-1" />
                  <button className="px-5 py-2.5 bg-[#349156] rounded-lg text-sm font-bold hover:bg-[#2a7a45] transition">Join</button>
               </div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
           &copy; 2026 NotoSpace. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
