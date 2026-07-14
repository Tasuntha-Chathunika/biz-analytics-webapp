import { useState } from 'react';
import { login, signup } from '../api/api';

const AuthPage = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('viewer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && (!name || !role))) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const response = await login(email, password);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        onAuthSuccess(user);
      } else {
        const response = await signup(email, password, name, role);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        onAuthSuccess(user);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.response?.data?.error || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCredentials = (emailVal, passVal) => {
    setEmail(emailVal);
    setPassword(passVal);
    setIsLogin(true);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-slate-900">
      {/* Animated Background Mesh Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/40 mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-400/30 mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-purple-600/30 mix-blend-screen filter blur-[130px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Glass Card */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.12)] z-10 overflow-hidden relative">
        
        {/* Left Side: Visual/Branding (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-r border-white/10">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
             <svg className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
               <defs>
                 <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                   <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                 </pattern>
               </defs>
               <rect width="100" height="100" fill="url(#grid)" />
             </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 cursor-pointer inline-flex" onClick={onBack}>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg group hover:bg-white/30 transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </div>
              <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">InsightEngine</span>
            </div>
          </div>

          <div className="relative z-10 mt-20 mb-20">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Empower your<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300">data journey.</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed font-light">
              Experience the next generation of business intelligence. Transform raw data into strategic insights instantly.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-500"></div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-cyan-400"></div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-purple-500"></div>
            </div>
            <div className="text-slate-300 text-sm font-medium">
              Join <span className="text-white font-bold">10,000+</span> teams today.
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
          {onBack && (
            <button 
              onClick={onBack}
              className="lg:hidden self-start mb-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium transition-colors bg-slate-100 px-4 py-2 rounded-xl"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back
            </button>
          )}

          <div className="max-w-md w-full mx-auto">
            {/* Tabs */}
            <div className="flex p-1.5 bg-slate-100/80 rounded-2xl mb-10">
              <button 
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ease-out ${isLogin ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ease-out ${!isLogin ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Register
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-slate-500 font-medium">
                {isLogin ? 'Enter your details to access your dashboard.' : 'Start your 14-day free trial today.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1.5 group">
                  <label className="block text-sm font-bold text-slate-700 group-focus-within:text-indigo-600 transition-colors">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all bg-slate-50/50 outline-none text-slate-900 font-medium placeholder-slate-400" 
                    placeholder="John Doe"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5 group">
                <label className="block text-sm font-bold text-slate-700 group-focus-within:text-indigo-600 transition-colors">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    className="w-full px-5 py-3.5 pl-12 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all bg-slate-50/50 outline-none text-slate-900 font-medium placeholder-slate-400" 
                    placeholder="name@company.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 group">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-700 group-focus-within:text-indigo-600 transition-colors">Password</label>
                  {isLogin && <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset instructions sent to your email.'); }} className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</a>}
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full px-5 py-3.5 pl-12 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all bg-slate-50/50 outline-none text-slate-900 font-medium placeholder-slate-400" 
                    placeholder="••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5 group">
                  <label className="block text-sm font-bold text-slate-700 group-focus-within:text-indigo-600 transition-colors">Organizational Role</label>
                  <div className="relative">
                    <select 
                      className="w-full px-5 py-3.5 pl-12 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all bg-slate-50/50 outline-none text-slate-900 font-medium appearance-none cursor-pointer" 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="admin">Admin (Full Control)</option>
                      <option value="manager">Manager (View Data)</option>
                      <option value="viewer">Viewer (Summary Only)</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm font-medium animate-pulse">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </>
                )}
              </button>
            </form>

            {/* Quick Access Badges */}
            {isLogin && (
              <div className="mt-12 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Test Accounts</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => handleUseCredentials('admin@insightengine.com', 'admin123')} className="px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors">Admin</button>
                  <button onClick={() => handleUseCredentials('manager@insightengine.com', 'manager123')} className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors">Manager</button>
                  <button onClick={() => handleUseCredentials('viewer@insightengine.com', 'viewer123')} className="px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors">Viewer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Global CSS for animations just for this component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
};

export default AuthPage;

