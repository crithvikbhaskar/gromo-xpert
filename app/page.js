"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), { ssr: false });

const dummyLeads = [
  { name: "Ravi Kumar", location: "Hyderabad", language: "Telugu", phone: "+919876543210" },
  { name: "Sunita Sharma", location: "Lucknow", language: "Hindi", phone: "+919876543211" },
  { name: "Neha Jain", location: "Delhi", language: "Hindi", phone: "+919876543212" },
  { name: "Rithvik Bhaskar", location: "Guntur", language: "English", phone: "+919491642754" },
];

const growthData = {
  earningsForecast: "₹12,000 this month",
  salesData: {
    "Health Insurance": 3,
    "Credit Card": 2,
    "Loan": 0,
    "Mutual Funds": 0,
    "Savings Account": 1,
  },
  dailyGoal: { target: 500, achieved: 300 },
  weeklyGoal: { target: 3500, achieved: 2800 },
  topGPs: [
    { rank: 1, name: "Anjali Gupta", sales: { "Health Insurance": 10, "Loan": 5, "Credit Card": 3 } },
    { rank: 2, name: "Rahul Sharma", sales: { "Mutual Funds": 8, "Savings Account": 4, "Health Insurance": 2 } },
    { rank: 3, name: "Priya Menon", sales: { "Credit Card": 7, "Loan": 3, "Mutual Funds": 2 } },
  ],
  dailyMission: "Pitch 2 insurance plans today to boost earnings by ₹600",
};

const customers = [
  { name: "Ravi Kumar", policy: "Health Insurance", renewalDate: "2025-05-20", phone: "+919876543210", language: "Telugu", claimStatus: "Pending" },
  { name: "Sunita Sharma", policy: "Credit Card", renewalDate: "2025-05-18", phone: "+919876543211", language: "Hindi", claimStatus: "Approved" },
  { name: "Neha Jain", policy: "Health Insurance", renewalDate: "2025-06-01", phone: "+919876543212", language: "Hindi", claimStatus: "Not Filed" },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("leads");
  const [product, setProduct] = useState("Health Insurance");
  const [pitches, setPitches] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState({});

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "user@gromo.com" && password === "password123") {
      localStorage.setItem("authToken", "loggedIn");
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid email or password");
    }
  };

  const generatePitches = async () => {
    try {
      const results = await Promise.all(
        dummyLeads.map(async (lead) => {
          const res = await fetch("/api/generate-pitch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product, lead }),
          });
          const data = await res.ok ? await res.json() : { pitch: `Hi ${lead.name}, I have a great ${product} plan for you!` };
          return { ...lead, pitch: data.pitch };
        })
      );
      setPitches(results);
      setLeadStatuses(results.reduce((acc, lead) => ({ ...acc, [lead.name]: "Not Contacted" }), {}));
    } catch (error) {
      console.error(error);
      alert("Failed to generate pitches.");
    }
  };

  const updateLeadStatus = (leadName, status) => {
    setLeadStatuses(prev => ({ ...prev, [leadName]: status }));
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] p-4">
        <div className="w-full max-w-md bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              GROMO XPERT
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Sign in to your professional dashboard</p>
          </div>
          <div className="flex flex-col gap-5">
            <input 
              type="email" 
              placeholder="user@gromo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border border-white/10 text-white rounded-xl h-12 px-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border border-white/10 text-white rounded-xl h-12 px-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button onClick={handleLogin} className="w-full h-12 bg-blue-600 text-white font-bold rounded-xl mt-2 hover:bg-blue-500 transition-colors">
              Log In
            </button>
            <button onClick={() => { setIsLoggedIn(true); localStorage.setItem("authToken", "loggedIn"); }} className="text-gray-500 text-sm hover:text-gray-300">
              Skip for testing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">
            <span className="text-blue-500">GroMo</span> Xpert
          </div>
          <button onClick={() => { setIsLoggedIn(false); localStorage.removeItem("authToken"); }} className="bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400 rounded-lg py-2 px-4 text-sm font-medium transition-colors">
            Log Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2 text-white">Welcome back.</h1>
            <p className="text-gray-400 text-lg">Manage your leads and track your sales growth.</p>
          </div>
          <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-4 rounded-2xl border border-blue-500/30">
            <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider mb-1">Daily Mission</p>
            <p className="font-medium text-white">{growthData.dailyMission}</p>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex space-x-2 border-b border-white/10 mb-8 overflow-x-auto pb-2">
          {["leads", "dashboard", "automation"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab === "leads" && "Lead Generator"}
              {tab === "dashboard" && "Growth Dashboard"}
              {tab === "automation" && "Post-Sale Automation"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-end gap-4">
              <div className="w-full sm:w-64">
                <label className="block text-sm font-medium text-gray-400 mb-2">Select Product</label>
                <select 
                  value={product} 
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Health Insurance">Health Insurance</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Loan">Loan</option>
                </select>
              </div>
              <button onClick={generatePitches} className="h-12 px-8 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 w-full sm:w-auto transition-colors">
                Generate Pitches
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pitches.map((lead, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <img src={`https://i.pravatar.cc/150?u=${lead.name}`} className="w-12 h-12 rounded-full border-2 border-white/10" alt="" />
                      <div>
                        <h4 className="font-bold text-white text-lg">{lead.name}</h4>
                        <p className="text-sm text-gray-400">{lead.location} • {lead.language}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      leadStatuses[lead.name] === "Closed" ? "bg-green-500/20 text-green-400" :
                      leadStatuses[lead.name] === "Contacted" ? "bg-blue-500/20 text-blue-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>
                      {leadStatuses[lead.name] || "Not Contacted"}
                    </span>
                  </div>
                  <div className="flex-grow bg-black/40 p-4 rounded-xl text-sm text-gray-300 italic mb-6">
                    "{lead.pitch}"
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <button onClick={() => updateLeadStatus(lead.name, "Contacted")} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">Contacted</button>
                    <button onClick={() => updateLeadStatus(lead.name, "Closed")} className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors">Closed</button>
                    <a href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(lead.pitch)}`} target="_blank" rel="noreferrer" className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold transition-colors">
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="space-y-6 lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Goals Progress</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Daily Goal</span>
                      <span className="font-bold">₹{growthData.dailyGoal.achieved} / ₹{growthData.dailyGoal.target}</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(growthData.dailyGoal.achieved / growthData.dailyGoal.target) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Weekly Goal</span>
                      <span className="font-bold">₹{growthData.weeklyGoal.achieved} / ₹{growthData.weeklyGoal.target}</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(growthData.weeklyGoal.achieved / growthData.weeklyGoal.target) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Sales by Category</h3>
                <div className="h-72 w-full">
                  <Bar 
                    data={{
                      labels: Object.keys(growthData.salesData),
                      datasets: [{
                        label: "Sales",
                        data: Object.values(growthData.salesData),
                        backgroundColor: "#3b82f6",
                        borderRadius: 6
                      }]
                    }} 
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 border border-emerald-500/30 rounded-2xl p-6 text-center">
                <p className="text-emerald-300 font-medium mb-2">Earnings Forecast</p>
                <p className="text-4xl font-black text-white">{growthData.earningsForecast}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Top Performing GPs</h3>
                <div className="space-y-4">
                  {growthData.topGPs.map((gp, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-black/40 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-400">
                        {gp.rank}
                      </div>
                      <div>
                        <p className="font-bold text-white">{gp.name}</p>
                        <p className="text-xs text-gray-400">Top Sale: {Object.keys(gp.sales)[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "automation" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {customers.map((customer, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/10 transition-colors">
                <div className="w-full md:w-1/3">
                  <h4 className="text-xl font-bold text-white">{customer.name}</h4>
                  <p className="text-gray-400 text-sm mb-3">{customer.policy}</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded">Renews: {customer.renewalDate}</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${customer.claimStatus === "Approved" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      Claim: {customer.claimStatus}
                    </span>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 flex flex-col sm:flex-row items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="flex-grow">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Automated Action</p>
                    <p className="text-sm font-medium text-gray-200">Policy renewal is approaching. Recommend a reminder.</p>
                  </div>
                  <a href={`https://wa.me/${customer.phone}?text=Hello ${customer.name}, your policy is due for renewal soon.`} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold text-center transition-colors">
                    Send Reminder
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}