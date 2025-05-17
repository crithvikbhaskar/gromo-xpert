"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Dynamically import Bar and Pie components to disable SSR
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), { ssr: false });
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), { ssr: false });

// Dummy leads for the Lead Generator
const dummyLeads = [
  { name: "Ravi Kumar", location: "Hyderabad", language: "Telugu", phone: "+919876543210" },
  { name: "Sunita Sharma", location: "Lucknow", language: "Hindi", phone: "+919876543211" },
  { name: "Neha Jain", location: "Delhi", language: "Hindi", phone: "+919876543212" },
  { name: "Rithvik Bhaskar", location: "Guntur", language: "English", phone: "+919491642754" },
];

// Dummy data for the Growth Dashboard
const growthData = {
  earningsForecast: "₹12,000 this month",
  salesData: {
    "Health Insurance": 3,
    "Credit Card": 2,
    "Loan": 0,
    "Mutual Funds": 0,
    "Savings Account": 1,
  },
  categoryGaps: ["Loan", "Mutual Funds"],
  dailyGoal: { target: "₹500", achieved: "₹300" },
  weeklyGoal: { target: "₹3,500", achieved: "₹2,800" },
  topGPs: [
    { rank: 1, name: "Anjali Gupta", sales: { "Health Insurance": 10, "Loan": 5, "Credit Card": 3 } },
    { rank: 2, name: "Rahul Sharma", sales: { "Mutual Funds": 8, "Savings Account": 4, "Health Insurance": 2 } },
    { rank: 3, name: "Priya Menon", sales: { "Credit Card": 7, "Loan": 3, "Mutual Funds": 2 } },
    { rank: 4, name: "Vikram Singh", sales: { "Health Insurance": 6, "Savings Account": 3, "Loan": 1 } },
    { rank: 5, name: "Neha Jain", sales: { "Mutual Funds": 5, "Credit Card": 4, "Health Insurance": 2 } },
  ],
  dailyMission: "Pitch 2 insurance plans today to boost earnings by ₹600",
};

// Dummy data for Post-Sale Automation
const customers = [
  {
    name: "Ravi Kumar",
    policy: "Health Insurance",
    renewalDate: "2025-05-20",
    phone: "+919876543210",
    language: "Telugu",
    claimStatus: "Pending",
    sentiment: "neutral",
  },
  {
    name: "Sunita Sharma",
    policy: "Credit Card",
    renewalDate: "2025-05-18",
    phone: "+919876543211",
    language: "Hindi",
    claimStatus: "Approved",
    sentiment: "positive",
  },
  {
    name: "Neha Jain",
    policy: "Health Insurance",
    renewalDate: "2025-06-01",
    phone: "+919876543212",
    language: "Hindi",
    claimStatus: "Not Filed",
    sentiment: "negative",
  },
];

// Dummy data for Clients and their Sales/Profits
const clientsData = [
  {
    name: "Aarav Patel",
    sales: { "Health Insurance": 8, "Credit Card": 5, "Loan": 2, "Mutual Funds": 3, "Savings Account": 4 },
    profits: { "Health Insurance": 3000, "Credit Card": 1500, "Loan": 500, "Mutual Funds": 1000, "Savings Account": 1200 },
  },
  {
    name: "Priya Sharma",
    sales: { "Health Insurance": 5, "Credit Card": 3, "Loan": 0, "Mutual Funds": 4, "Savings Account": 2 },
    profits: { "Health Insurance": 2000, "Credit Card": 900, "Loan": 0, "Mutual Funds": 1200, "Savings Account": 800 },
  },
  {
    name: "Vikram Singh",
    sales: { "Health Insurance": 6, "Credit Card": 2, "Loan": 1, "Mutual Funds": 5, "Savings Account": 3 },
    profits: { "Health Insurance": 2500, "Credit Card": 600, "Loan": 300, "Mutual Funds": 1500, "Savings Account": 1000 },
  },
];

// Client List Sidebar Component
const ClientListSidebar = ({ isOpen, toggleSidebar, onClientSelect }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 z-40`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-black">Clients</h2>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded mb-4"
          onClick={toggleSidebar}
        >
          {isOpen ? "Hide Clients" : "Show Clients"}
        </button>
        <ul>
          {clientsData.map((client, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-blue-100 rounded text-black"
              onClick={() => onClientSelect(client)}
            >
              {client.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Client Visualizations Sidebar Component
const ClientVisualizationsSidebar = ({ isOpen, toggleSidebar, selectedClient }) => {
  if (!selectedClient) return null;

  // Bar Chart Data for Sales
  const salesChartData = {
    labels: Object.keys(selectedClient.sales),
    datasets: [
      {
        label: "Sales",
        data: Object.values(selectedClient.sales),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data for Profits
  const profitChartData = {
    labels: Object.keys(selectedClient.profits),
    datasets: [
      {
        label: "Profits (₹)",
        data: Object.values(selectedClient.profits),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } w-96 z-40`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-black">{selectedClient.name} - Performance</h2>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded mb-4"
          onClick={toggleSidebar}
        >
          {isOpen ? "Hide Visualizations" : "Show Visualizations"}
        </button>

        {/* Sales Bar Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-black">Sales by Category</h3>
          <div className="h-64">
            <Bar data={salesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Profits Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">Profit Distribution (₹)</h3>
          <div className="h-64">
            <Pie data={profitChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Assistant Component
const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! I'm your GroMo Xpert AI Assistant. I can help with anything—ask me about the app, sales tips, or anything else!" },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 320 - 16, y: window.innerHeight - 400 - 16 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 320 - 16),
        y: Math.min(prev.y, window.innerHeight - 400 - 16),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = chatRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    newX = Math.max(0, Math.min(newX, window.innerWidth - 320));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 400));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
      return "Hello there! How can I assist you today?";
    }
    if (lowerMessage.includes("how are you")) {
      return "I'm doing great, thanks for asking! How about you?";
    }
    if (lowerMessage.includes("thank you") || lowerMessage.includes("thanks")) {
      return "You're welcome! Anything else I can help with?";
    }
    if (lowerMessage.includes("lead") || lowerMessage.includes("generator")) {
      return "The Lead Generator helps you create personalized pitches for leads. Select a product, click 'Generate Leads & Pitches', and send pitches via WhatsApp!";
    }
    if (lowerMessage.includes("growth") || lowerMessage.includes("dashboard")) {
      return "The Growth Dashboard shows your earnings forecast, sales data, goals, and top-performing GPs. Use it to identify gaps and boost your sales!";
    }
    if (lowerMessage.includes("post-sale") || lowerMessage.includes("automation")) {
      return "Post-Sale Automation helps you manage customers with reminders, claim statuses, and upsell opportunities. You can chat with customers in their language!";
    }
    if (lowerMessage.includes("tip") || lowerMessage.includes("sales tip")) {
      return "Quick tip: Focus on categories with zero sales, like Loans or Mutual Funds, to maximize your earnings! Check the Growth Dashboard for details.";
    }
    if (lowerMessage.includes("weather")) {
      return "I can’t check the weather right now, but if you tell me your location, I can give you some general advice on preparing for the day!";
    }
    if (lowerMessage.includes("joke")) {
      return "Why did the salesperson bring a ladder to the meeting? Because they wanted to take the deal to the next level! 😄 Want another one?";
    }
    if (lowerMessage.includes("motivation") || lowerMessage.includes("inspire")) {
      return "Here’s a little motivation for you: 'Success is the sum of small efforts, repeated day in and day out.' Keep pushing with GroMo Xpert—you’ve got this!";
    }
    if (lowerMessage.includes("math") || lowerMessage.includes("calculate")) {
      const match = userMessage.match(/(\d+)\s*[\+\-\*\/]\s*(\d+)/);
      if (match) {
        const num1 = parseFloat(match[1]);
        const num2 = parseFloat(match[2]);
        const operator = userMessage.match(/[\+\-\*\/]/)[0];
        let result;
        switch (operator) {
          case "+": result = num1 + num2; break;
          case "-": result = num1 - num2; break;
          case "*": result = num1 * num2; break;
          case "/": result = num2 !== 0 ? num1 / num2 : "Cannot divide by zero!"; break;
          default: result = "I couldn’t parse that calculation.";
        }
        return `The result of ${num1} ${operator} ${num2} is ${result}. Need help with another calculation?`;
      }
      return "I can help with simple math! Try something like '5 + 3' or '10 * 2'.";
    }
    return "I’m not sure about that, but I’m here to help! You can ask about GroMo Xpert features, sales tips, or anything else on your mind.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    const botResponse = getBotResponse(input);
    setMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
    setInput("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="z-50">
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close AI Assistant" : "AI Assistant"}
      </button>
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="bg-blue-600 text-white p-3 rounded-t-lg cursor-move"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-lg font-semibold">GroMo Xpert AI Assistant</h3>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${
                  msg.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.type === "user"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 border p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  // State for login
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // State for app features
  const [product, setProduct] = useState("Health Insurance");
  const [pitches, setPitches] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState({});
  const [view, setView] = useState("LeadGenerator");
  const [chatMessages, setChatMessages] = useState({});
  const [userInput, setUserInput] = useState({});
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [isVisualizationsOpen, setIsVisualizationsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const inputRefs = customers.reduce((acc, customer) => {
    acc[customer.name] = useRef(null);
    return acc;
  }, {});

  const handleLogin = (e) => {
    e.preventDefault();
    const validEmail = "user@gromo.com";
    const validPassword = "password123";

    if (email === validEmail && password === validPassword) {
      localStorage.setItem("authToken", "loggedIn");
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleSkipLogin = () => {
    localStorage.setItem("authToken", "loggedIn");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setError("");
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
          if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
          }
          const data = await res.json();
          return { ...lead, pitch: data.pitch };
        })
      );
      setPitches(results);
      const initialStatuses = results.reduce((acc, lead) => {
        acc[lead.name] = leadStatuses[lead.name] || "Not Contacted";
        return acc;
      }, {});
      setLeadStatuses(initialStatuses);
    } catch (error) {
      console.error("Error generating pitches:", error);
      alert("Failed to generate pitches. Check the console for details.");
    }
  };

  const createWhatsAppLink = (phone, message) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  const updateLeadStatus = (leadName, newStatus) => {
    setLeadStatuses((prev) => ({
      ...prev,
      [leadName]: newStatus,
    }));
  };

  const getChatResponse = (customer, queryType) => {
    const lang = customer.language;
    const responses = {
      Telugu: {
        reminder: `మీ ఇన్సూరెన్స్ పాలసీ రీన్యూవల్ దగ్గరలో ఉంది — కస్టమర్‌కు రిమైండ్ చేయాలా?`,
        claimStatus: `మీ క్లెయిమ్ స్థితి: ${customer.claimStatus}`,
        upsell: `మీరు మా కొత్త సేవింగ్స్ అకౌంట్ ప్లాన్‌ను పరిగణించాలనుకుంటున్నారా?`,
        unknown: `దయచేసి "రీన్యూవల్", "క్లెయిమ్ స్థితి", లేదా "కొత్త ప్లాన్" గురించి అడగండి.`,
      },
      Hindi: {
        reminder: `आपकी बीमा पॉलिसी रिन्यूअल के लिए देय है — क्या मुझे ग्राहक को याद दिलाना चाहिए?`,
        claimStatus: `आपके दावे की स्थिति: ${customer.claimStatus}`,
        upsell: `क्या आप हमारे नए बचत खाते योजना पर विचार करना चाहेंगे?`,
        unknown: `कृपया "रिन्यूअल", "दावा स्थिति", या "नया प्लान" के बारे में पूछें।`,
      },
      English: {
        reminder: `Your insurance policy is due for renewal — should I remind the customer?`,
        claimStatus: `Your claim status: ${customer.claimStatus}`,
        upsell: `Would you like to consider our new Savings Account plan?`,
        unknown: `Please ask about "renewal", "claim status", or "new plan".`,
      },
    };
    return responses[lang][queryType] || responses["English"][queryType];
  };

  const determineQueryType = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("renew") || lowerInput.includes("remind")) {
      return "reminder";
    } else if (lowerInput.includes("claim") || lowerInput.includes("status")) {
      return "claimStatus";
    } else if (lowerInput.includes("upsell") || lowerInput.includes("new plan") || lowerInput.includes("recommend")) {
      return "upsell";
    } else {
      return "unknown";
    }
  };

  const handleChatSubmit = (customer, customerName) => {
    const userMessage = userInput[customerName] || "";
    if (!userMessage.trim()) return;

    console.log(`User input for ${customerName}: ${userMessage}`);
    setChatMessages((prev) => ({
      ...prev,
      [customerName]: [
        ...(prev[customerName] || []),
        { type: "user", message: userMessage },
      ],
    }));

    const queryType = determineQueryType(userMessage);
    const response = getChatResponse(customer, queryType);

    console.log(`Chatbot response for ${customerName}: ${response}`);
    setChatMessages((prev) => ({
      ...prev,
      [customerName]: [
        ...(prev[customerName] || []),
        { type: queryType, message: response },
      ],
    }));

    setUserInput((prev) => ({
      ...prev,
      [customerName]: "",
    }));
    if (inputRefs[customerName].current) {
      inputRefs[customerName].current.focus();
    }
  };

  const LeadGeneratorView = () => (
    <>
      <label className="block font-semibold">Select a Product:</label>
      <select
        className="border p-2 rounded w-full mb-4 text-white"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      >
        <option className="text-black">Health Insurance</option>
        <option className="text-black">Credit Card</option>
        <option className="text-black">Loan</option>
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        onClick={generatePitches}
      >
        Generate Leads & Pitches
      </button>

      <div className="text-black">
        {pitches.map((lead, index) => (
          <div key={index} className="p-4 border rounded bg-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-black">{lead.name} ({lead.location})</p>
                <p className="mb-2">{lead.pitch}</p>
                <p className="text-sm text-gray-600">
                  Status: {leadStatuses[lead.name] || "Not Contacted"}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded text-sm ${
                    leadStatuses[lead.name] === "Contacted"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => updateLeadStatus(lead.name, "Contacted")}
                >
                  Contacted
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm ${
                    leadStatuses[lead.name] === "Followed Up"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => updateLeadStatus(lead.name, "Followed Up")}
                >
                  Followed Up
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm ${
                    leadStatuses[lead.name] === "Closed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => updateLeadStatus(lead.name, "Closed")}
                >
                  Closed
                </button>
              </div>
            </div>
            <a
              href={createWhatsAppLink(lead.phone, lead.pitch)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded inline-block mt-2"
            >
              Send via WhatsApp
            </a>
          </div>
        ))}
      </div>
    </>
  );

  const GrowthDashboardView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Why Am I Not Earning More?</h2>
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="font-semibold text-lg text-black">Earnings Forecast</h3>
        <p className="text-gray-700">Projected: {growthData.earningsForecast}</p>
      </div>
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="font-semibold text-lg text-black">Product Category Gaps</h3>
        <p className="text-gray-700 mb-2">
          You haven’t sold in these categories: {growthData.categoryGaps.join(", ")}
        </p>
        <p className="text-gray-700 font-semibold">Your Sales:</p>
        <ul className="list-disc list-inside text-gray-700">
          {Object.entries(growthData.salesData).map(([category, sales], index) => (
            <li key={index}>
              {category}: {sales} {sales === 1 ? "sale" : "sales"}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="font-semibold text-lg text-black">Your Goals</h3>
        <p className="text-gray-700">
          Daily Goal: ₹{growthData.dailyGoal.achieved} / ₹{growthData.dailyGoal.target}
        </p>
        <div className="w-full bg-gray-200 rounded h-4 mt-2">
          <div
            className="bg-blue-600 h-4 rounded"
            style={{
              width: `${(growthData.dailyGoal.achieved / growthData.dailyGoal.target) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-gray-700 mt-2">
          Weekly Goal: ₹{growthData.weeklyGoal.achieved} / ₹{growthData.weeklyGoal.target}
        </p>
        <div className="w-full bg-gray-200 rounded h-4 mt-2">
          <div
            className="bg-blue-600 h-4 rounded"
            style={{
              width: `${(growthData.weeklyGoal.achieved / growthData.weeklyGoal.target) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="font-semibold text-lg text-black">What Top 5 GPs Are Selling</h3>
        <ul className="space-y-2">
          {growthData.topGPs.map((gp) => (
            <li key={gp.rank} className="text-gray-700">
              <span className="font-semibold">
                #{gp.rank} {gp.name}:
              </span>{" "}
              {Object.entries(gp.sales)
                .map(([category, sales]) => `${sales} ${category}`)
                .join(", ")}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border rounded bg-yellow-100 shadow">
        <h3 className="font-semibold text-lg text-black">Daily Mission</h3>
        <p className="text-gray-700">{growthData.dailyMission}</p>
      </div>
    </div>
  );

  const PostSaleAutomationView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Post-Sale Automation</h2>
      {customers.map((customer, index) => (
        <div key={index} className="p-4 border rounded bg-white shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-black">{customer.name}</p>
              <p className="text-gray-700">Policy: {customer.policy}</p>
              <p className="text-gray-700">Renewal Date: {customer.renewalDate}</p>
              <p className="text-gray-700">
                Sentiment: {customer.sentiment.charAt(0).toUpperCase() + customer.sentiment.slice(1)}
              </p>
            </div>
            <div className="flex space-x-2">
              <a
                href={createWhatsAppLink(customer.phone, getChatResponse(customer, "reminder"))}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Send Reminder via WhatsApp
              </a>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-lg text-black">Chatbot Assistance</h3>
            <div className="p-2 border rounded bg-gray-50 max-h-40 overflow-y-auto mb-2">
              {(chatMessages[customer.name] || []).map((msg, idx) => (
                <p
                  key={idx}
                  className={`text-gray-700 mb-1 ${
                    msg.type === "user" ? "text-right text-blue-600" : "text-left"
                  }`}
                >
                  <span className="font-semibold">
                    {msg.type === "user"
                      ? "You: "
                      : `${msg.type.replace(/([A-Z])/g, " $1").trim()}: `}
                  </span>
                  {msg.message}
                </p>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                ref={inputRefs[customer.name]}
                className="border p-2 rounded w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ask about renewal, claim status, or new plan..."
                value={userInput[customer.name] || ""}
                onChange={(e) => {
                  console.log(`Typing in ${customer.name}'s input: ${e.target.value}`);
                  setUserInput((prev) => ({
                    ...prev,
                    [customer.name]: e.target.value,
                  }));
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    console.log(`Enter key pressed for ${customer.name}`);
                    handleChatSubmit(customer, customer.name);
                  }
                }}
              />
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                onClick={() => handleChatSubmit(customer, customer.name)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Login Section
  if (!isLoggedIn) {
    return (
        
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
            Welcome to GroMo Xpert
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Log in to access your dashboard
          </p>
          <div className="flex justify-center mb-6">
            <img
              src="https://sdmntprwestus.oaiusercontent.com/files/00000000-e244-6230-9f2c-257c44932144/raw?se=2025-05-17T15%3A01%3A42Z&sp=r&sv=2024-08-04&sr=b&scid=00000000-0000-0000-0000-000000000000&skoid=789f404f-91a9-4b2f-932c-c44965c11d82&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-17T01%3A30%3A38Z&ske=2025-05-18T01%3A30%3A38Z&sks=b&skv=2024-08-04&sig=8nZTbUCqGPT0EOwoE09i15pQSC47wyPzfvgMCM8XkfY%3D"
              alt="GroMo Xpert Logo"
              className="h-08 w-auto"
            />
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}
            <button
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition mb-4"
              onClick={handleLogin}
            >
              Log In
            </button>
            <button
              className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
              onClick={handleSkipLogin}
            >
              Skip Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main App Content (shown after login)
  return (
    <div className="relative flex min-h-screen">
      {/* Client List Sidebar */}
      <ClientListSidebar
        isOpen={isClientListOpen}
        toggleSidebar={() => setIsClientListOpen(!isClientListOpen)}
        onClientSelect={(client) => {
          setSelectedClient(client);
          setIsVisualizationsOpen(true);
        }}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isClientListOpen ? "ml-64" : "ml-0"
        } ${isVisualizationsOpen ? "mr-96" : "mr-0"}`}
      >
        <main className="p-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">
              GroMo Xpert
            </h1>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <div className="flex space-x-4 mb-6">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setIsClientListOpen(true)}
            >
              Show Clients
            </button>
            <button
              className={`px-4 py-2 rounded ${
                view === "LeadGenerator" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setView("LeadGenerator")}
            >
              Lead Generator & Sales Copilot
            </button>
            <button
              className={`px-4 py-2 rounded ${
                view === "GrowthDashboard" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setView("GrowthDashboard")}
            >
              Growth Dashboard
            </button>
            <button
              className={`px-4 py-2 rounded ${
                view === "PostSaleAutomation" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setView("PostSaleAutomation")}
            >
              Post-Sale Automation
            </button>
          </div>
          {view === "LeadGenerator" ? (
            <LeadGeneratorView />
          ) : view === "GrowthDashboard" ? (
            <GrowthDashboardView />
          ) : (
            <PostSaleAutomationView />
          )}
        </main>
      </div>

      {/* Client Visualizations Sidebar */}
      <ClientVisualizationsSidebar
        isOpen={isVisualizationsOpen}
        toggleSidebar={() => setIsVisualizationsOpen(!isVisualizationsOpen)}
        selectedClient={selectedClient}
      />

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};