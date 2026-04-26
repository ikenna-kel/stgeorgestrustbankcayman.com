'use client'
import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  CheckCircle2,
  Star,
  Menu,
  X,
  Play
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage: React.FC = () => {
  // Add state to track if the mobile menu is open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-blue-500/30">

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">

            <Image src={'/logo.png'} alt='logo' width={50} height={50} />

            <span className="text-white font-bold text-xl tracking-tight">St. Georges Trust Bank</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href={'/login'} className="text-sm font-medium hover:text-white transition-colors">Log in</Link>
            <Link href={'/signup'} className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden text-slate-300 hover:text-white z-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div
        className={`fixed inset-0 z-40 bg-[#0F172A] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 border-b border-slate-800 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="flex flex-col gap-6 text-lg font-medium mb-8">
          <a href="#features" onClick={closeMenu} className="hover:text-white transition-colors py-2 border-b border-slate-800">Features</a>
          <a href="#how-it-works" onClick={closeMenu} className="hover:text-white transition-colors py-2 border-b border-slate-800">How it Works</a>
          <a href="#testimonials" onClick={closeMenu} className="hover:text-white transition-colors py-2 border-b border-slate-800">Testimonials</a>
        </div>

        <div className="flex flex-col gap-4 mt-auto pb-10">
          <Link href={'/login'} onClick={closeMenu} className="w-full text-center text-white py-4 rounded-full font-bold border border-slate-700 hover:bg-slate-800 transition-colors">
            Log in
          </Link>
          <Link href={'/signup'} onClick={closeMenu} className="w-full bg-white text-slate-900 py-4 rounded-full font-bold hover:bg-slate-200 transition-colors">
            Get Started
          </Link>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-200 h-100 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left">

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              The future of <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
                borderless banking.
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Send, receive, and manage your money globally with zero hidden fees. Experience financial freedom tailored for the modern world.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 group">
                Open Free Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2">
                <Play size={18} className="fill-current" /> View Demo
              </button>
            </div>
          </div>

          {/* Hero Image / Dashboard Mockup */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-full perspective-1000">
            <div className="relative rounded-2xl bg-linear-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-2xl overflow-hidden transform lg:rotate-y-[-10deg] lg:rotate-x-[5deg] transition-transform duration-500 hover:rotate-0">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
                alt="Dashboard Preview"
                className="w-full h-auto opacity-80 mix-blend-screen"
              />
              {/* Floating Element */}
              <div className="absolute bottom-10 -left-6 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Payment Received</p>
                  <p className="text-xs text-slate-400">+$1,250.00 from Apple Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOGO CLOUD --- */}
      <section className="py-10 border-y border-slate-800/50 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Replace with actual SVG logos in production */}
            <h2 className="text-xl font-bold text-white">acme corp.</h2>
            <h2 className="text-xl font-bold text-white">GlobalTech</h2>
            <h2 className="text-xl font-bold text-white">Quantum</h2>
            <h2 className="text-xl font-bold text-white">PiedPiper</h2>
            <h2 className="text-xl font-bold text-white">Hooli</h2>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Everything you need, <br />nothing you don't.</h2>
            <p className="text-slate-400 text-lg">We've stripped away the complexity of traditional banking to bring you a lightning-fast, secure, and beautiful financial experience.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/50 transition-colors">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global Transfers</h3>
              <p className="text-slate-400 leading-relaxed">Send money to over 150 countries at real exchange rates with zero markup. Arrives in seconds.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/50 transition-colors">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 text-cyan-400">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-slate-400 leading-relaxed">Built on modern infrastructure, our transactions settle instantly. No more waiting 3-5 business days.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/50 transition-colors">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-400">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Bank-Grade Security</h3>
              <p className="text-slate-400 leading-relaxed">Your money is protected by 256-bit encryption and multi-factor authentication. FDIC insured up to $250k.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- IMAGE WITH TEXT SECTION --- */}
      <section className="py-24 px-6 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1616077168079-7e09a6a38b4f?q=80&w=1000&auto=format&fit=crop"
              alt="Mobile App"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-2">
              <Smartphone size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Control your wealth from your pocket.</h2>
            <p className="text-slate-400 text-lg">Our award-winning mobile app puts you in complete control. Freeze your card, manage subscriptions, and analyze spending habits with just a tap.</p>

            <ul className="space-y-4 pt-4">
              {['Virtual cards for safe online shopping', 'Automated savings round-ups', 'Instant push notifications for every transaction'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 size={20} className="text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="testimonials" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Loved by thousands</h2>
            <p className="text-slate-400">Don't just take our word for it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Jenkins", role: "Freelance Designer", quote: "St. Georges Trust Bank completely changed how I handle international clients. I save hundreds in conversion fees every month." },
              { name: "David Chen", role: "Startup Founder", quote: "The cleanest, most intuitive banking interface I've ever used. Getting my team onboarded took less than 5 minutes." },
              { name: "Elena Rodriguez", role: "Digital Nomad", quote: "Finally, a bank that travels with me. The virtual cards and instant notifications give me peace of mind anywhere." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 relative">
                <div className="flex gap-1 mb-6 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}
                </div>
                <p className="text-slate-300 mb-8 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-slate-700 rounded-full overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt={testimonial.name} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{testimonial.name}</h4>
                    <p className="text-slate-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto bg-linear-to-br from-blue-600 to-cyan-500 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Ready to upgrade your finances?</h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">Join over 100,000 users who are already experiencing the future of banking. Takes 2 minutes to apply.</p>

            <div className="pt-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl">
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0B1120] border-t border-slate-800 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Image src={'/logo.png'} alt='logo' width={50} height={50} />
              <span className="text-white font-bold tracking-tight">St. Georges Trust Bank</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">Banking made simple, secure, and beautiful. Designed for the modern internet economy.</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center md:text-left text-slate-600 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 St. Georges Trust Bank. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social placeholders */}
            <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"></div>
            <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"></div>
            <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;