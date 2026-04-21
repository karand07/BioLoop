import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, ShieldCheck, Truck, BarChart3, Globe, Zap, CheckCircle2, ChevronRight, Menu, X, Factory, Sprout } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200 transition-transform group-hover:rotate-12">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">BioLoop</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">How it Works</a>
            <a href="#solutions" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Solutions</a>
            <a href="#network" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Market Network</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-all">Log In</Link>
            <Link 
              to="/signup" 
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-50">
           <div className="absolute top-20 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 space-y-10 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              India's Leading Bio-Waste Exchange
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Direct Sourcing. <br />
              <span className="text-emerald-600">Zero Friction.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg font-medium">
              The professional B2B marketplace connecting verified agricultural producers with industrial bio-fuel and processing plants.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link 
                to="/signup" 
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Join the Network
                <ArrowRight className="w-6 h-6" />
              </Link>
              <div className="flex flex-col justify-center">
                 <div className="flex -space-x-3 mb-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="Partner" />
                      </div>
                    ))}
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by 200+ Industries</p>
              </div>
            </div>
          </div>

          {/* Product Preview Card */}
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="bg-white p-4 rounded-[3.5rem] border border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] relative z-10">
               <div className="bg-slate-50 p-10 rounded-[2.8rem] space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="font-black text-xl text-slate-900 tracking-tight">Active Market</h3>
                     <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Updates</span>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     {[
                        { name: 'Sugarcane Bagasse', price: '₹4,200', unit: 'MT', trend: '+1.2%', up: true },
                        { name: 'Rice Husk (Pressed)', price: '₹3,850', unit: 'MT', trend: '-0.4%', up: false },
                        { name: 'Wheat Straw', price: '₹2,900', unit: 'MT', trend: '+5.1%', up: true },
                     ].map((item, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                 <BarChart3 className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">North Region</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-black text-slate-900">{item.price}</p>
                              <p className={cn("text-[10px] font-black", item.up ? 'text-emerald-500' : 'text-red-500')}>{item.trend}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
                     <div className="text-center p-4 bg-white rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Vol</p>
                        <p className="font-black text-slate-900">14.2k MT</p>
                     </div>
                     <div className="text-center p-4 bg-emerald-600 rounded-2xl">
                        <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Price Index</p>
                        <p className="font-black text-white">Stable</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="pb-32 px-6">
         <div className="max-w-7xl mx-auto border-y border-slate-100 py-12 flex flex-wrap items-center justify-center gap-x-20 gap-y-10">
            <div className="text-sm font-black text-slate-300 uppercase tracking-[0.4em]">Verified Sourcing</div>
            <div className="text-sm font-black text-slate-300 uppercase tracking-[0.4em]">GST Compliant</div>
            <div className="text-sm font-black text-slate-300 uppercase tracking-[0.4em]">Live Logistics</div>
            <div className="text-sm font-black text-slate-300 uppercase tracking-[0.4em]">Audit Ready</div>
         </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-32 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8 order-2 lg:order-1">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 hover:border-emerald-200 transition-colors">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <Sprout className="w-6 h-6" />
                     </div>
                     <h4 className="font-bold text-slate-900">For Farmers</h4>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">Monetize agricultural residue. Get fair prices and scheduled pickups without brokers.</p>
                  </div>
                  <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 hover:border-blue-200 transition-colors">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                        <Factory className="w-6 h-6" />
                     </div>
                     <h4 className="font-bold text-slate-900">For Industry</h4>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">Secure your supply chain with verified bio-waste. Direct-to-source procurement portal.</p>
                  </div>
               </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
               <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">Our Ecosystem</h2>
               <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Seamless supply for a <span className="text-emerald-600">circular world.</span>
               </h3>
               <p className="text-lg text-slate-500 font-medium">
                  We bridge the gap between rural agriculture and urban energy needs with a technology-first approach to B2B waste management.
               </p>
               <ul className="space-y-4">
                  {[
                     'Transparent price discovery for all waste types.',
                     'Automated logistics and GPS-tracked deliveries.',
                     'Compliance-first documentation and GST invoicing.',
                     'Secure escrow-based payment releases.'
                  ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        {item}
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 bg-slate-900 text-white px-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500" />
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-20 space-y-4">
               <h2 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">The Process</h2>
               <h3 className="text-4xl md:text-5xl font-black tracking-tight">Three steps to scale.</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                  { step: '01', title: 'Onboard & List', desc: 'Create your professional profile and list available inventory with photos and location.' },
                  { step: '02', title: 'Match & Negotiate', desc: 'Our marketplace matches listings with industrial demand. Finalize deals with secure bids.' },
                  { step: '03', title: 'Deliver & Get Paid', desc: 'Logistics partners manage the pickup. Payments are released upon verified delivery.' },
               ].map((item, i) => (
                  <div key={i} className="space-y-6 group">
                     <div className="text-6xl font-black text-white/10 transition-colors group-hover:text-emerald-500/20">{item.step}</div>
                     <h4 className="text-2xl font-bold">{item.title}</h4>
                     <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
         <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-10">
               <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                  Modernize your <br /> bio-waste operations.
               </h2>
               <p className="text-xl text-emerald-50 font-medium max-w-2xl mx-auto">
                  Join India's most efficient B2B network for sustainable agricultural procurement.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                  <Link 
                    to="/signup" 
                    className="w-full sm:w-auto bg-white text-emerald-600 px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-xl"
                  >
                    Create Account
                  </Link>
                  <Link 
                    to="/login" 
                    className="w-full sm:w-auto bg-emerald-700 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-800 transition-all"
                  >
                    Contact Sales
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
               <div className="flex items-center gap-2.5">
                  <div className="bg-emerald-600 p-1.5 rounded-lg">
                     <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tight text-slate-900">BioLoop</span>
               </div>
               <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                  Professionalizing India's agricultural waste supply chain through technology and transparent market access.
               </p>
            </div>
            <div>
               <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-6">Marketplace</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-900">
                  <li><Link to="/signup">For Farmers</Link></li>
                  <li><Link to="/signup">For Industry</Link></li>
                  <li><Link to="/signup">Logistics Fleet</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-6">Company</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-900">
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Security</a></li>
                  <li><a href="#">Legal</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-slate-400">© 2026 BioLoop Technologies Inc. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400">
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:text-emerald-600 transition-all cursor-pointer">𝕏</div>
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:text-emerald-600 transition-all cursor-pointer">in</div>
            </div>
         </div>
      </footer>
    </div>
  );
}
