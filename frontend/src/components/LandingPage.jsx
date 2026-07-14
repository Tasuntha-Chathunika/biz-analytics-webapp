
import heroMask from '../assets/hero_mask.png';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full top-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">InsightEngine</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#product" onClick={(e) => { e.preventDefault(); alert('Product section coming soon!'); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                Product
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </a>
              <a href="#solutions" onClick={(e) => { e.preventDefault(); alert('Solutions section coming soon!'); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                Solutions
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </a>
              <a href="#learn" onClick={(e) => { e.preventDefault(); alert('Learn section coming soon!'); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                Learn
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); alert('Pricing coming soon!'); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#enterprise" onClick={(e) => { e.preventDefault(); alert('Enterprise details coming soon!'); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Enterprise</a>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#demo" onClick={(e) => { e.preventDefault(); alert('Demo request form coming soon!'); }} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors mr-2">Get a Demo</a>
              <button 
                onClick={() => onNavigate('login')}
                className="text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 ring-1 ring-indigo-200 px-5 py-2.5 rounded-xl transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => onNavigate('signup')}
                className="text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 px-6 py-2.5 rounded-xl transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto mt-12 md:mt-20">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.05] mb-6">
            A new era of analytics,<br />
            <span className="text-slate-900 inline-block mt-2">with <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">InsightEngine™</span></span>
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-20">
            <button 
              onClick={() => onNavigate('signup')}
              className="text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 px-8 py-4 rounded-2xl transition-all duration-300 w-full sm:w-auto"
            >
              Build your own dashboard
            </button>
            <button 
              onClick={() => alert('Documentation and Learn More features coming soon!')}
              className="text-lg font-bold text-slate-700 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm hover:shadow-md px-8 py-4 rounded-2xl transition-all duration-300 w-full sm:w-auto"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full max-w-5xl mx-auto relative mt-8 flex justify-center perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40 bottom-0 z-10 pointer-events-none h-full"></div>
          <img 
            src={heroMask} 
            alt="InsightEngine 3D Mask" 
            className="w-full md:w-3/4 max-w-[800px] object-contain drop-shadow-2xl mix-blend-multiply hover:scale-[1.02] transition-transform duration-700 ease-out"
          />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
