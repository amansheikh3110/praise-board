"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Creator {
  username: string; // unique slug
  name: string;
  bio: string;
  about: string;
  avatar: string;
  coverPhoto: string;
  coffeePrice: number;
  itemNoun: string; // e.g., "coffee"
  itemEmoji: string; // e.g., "☕"
  paymentUpi: string;
  supportersCount: number;
  earnings: number;
  pageViews: number;
}

export interface Transaction {
  id: string;
  creatorUsername: string;
  supporterName: string;
  coffeeCount: number;
  amount: number;
  message: string;
  isPrivate: boolean;
  timestamp: string;
}

interface AppContextType {
  creators: Creator[];
  transactions: Transaction[];
  currentUser: Creator | null;
  registerCreator: (username: string, name: string, email: string, password: string) => { success: boolean; error?: string };
  loginCreator: (emailOrUsername: string, password: string) => { success: boolean; error?: string };
  logoutCreator: () => void;
  updateCreatorProfile: (updatedData: Partial<Creator>) => { success: boolean; error?: string };
  addSupport: (creatorUsername: string, supporterName: string, coffeeCount: number, message: string, isPrivate: boolean) => void;
  getCreatorByUsername: (username: string) => Creator | undefined;
  getTransactionsForCreator: (username: string) => Transaction[];
  theme: "funko" | "hacker";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample seed data
const initialCreators: Creator[] = [
  {
    username: "carlos",
    name: "Carlos Mendez",
    bio: "Creating futuristic 3D web art and interactive animations",
    about: "Hey everyone! I am Carlos, a digital artist based in Madrid. I spend my days coding WebGL shaders, playing with Three.js, and building open-source templates for creative developers. If you like my interactive canvases, feel free to buy me a coffee! It helps keep me fueled for late-night coding sessions.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    coverPhoto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    coffeePrice: 5,
    itemNoun: "coffee",
    itemEmoji: "☕",
    paymentUpi: "carlos@upi",
    supportersCount: 142,
    earnings: 710,
    pageViews: 4890,
  },
  {
    username: "sara",
    name: "Sara Dev",
    bio: "Building open-source developer tooling and writing technical tutorials",
    about: "Hi! I'm Sara. I write deep-dive tutorials on React, Next.js, and system architecture. I also maintain several open-source libraries that make developer lives easier. Buying me a tea helps me dedicate more time to writing documentation and building new plugins!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    coverPhoto: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80",
    coffeePrice: 4,
    itemNoun: "tea",
    itemEmoji: "🍵",
    paymentUpi: "sara@upi",
    supportersCount: 98,
    earnings: 392,
    pageViews: 3200,
  },
  {
    username: "alex",
    name: "Alex River",
    bio: "Host of the 'ByteSized' Tech Podcast and Indie Maker",
    about: "Welcome to my page! I interview creators, share indie-maker insights, and produce weekly audio shows about the future of tech. Your support directly funds equipment upgrades, transcripts, and hosting costs.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    coverPhoto: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
    coffeePrice: 6,
    itemNoun: "pizza slice",
    itemEmoji: "🍕",
    paymentUpi: "alex@upi",
    supportersCount: 55,
    earnings: 330,
    pageViews: 1980,
  }
];

const initialTransactions: Transaction[] = [
  {
    id: "tx-1",
    creatorUsername: "carlos",
    supporterName: "Emily Watson",
    coffeeCount: 3,
    amount: 15,
    message: "Absolutely love your shaders! The recent landing page demo you built is breathtaking. Keep it up!",
    isPrivate: false,
    timestamp: "2026-07-10T12:00:00.000Z"
  },
  {
    id: "tx-2",
    creatorUsername: "carlos",
    supporterName: "Dave K.",
    coffeeCount: 1,
    amount: 5,
    message: "Thanks for the WebGL tips, they saved me hours of troubleshooting.",
    isPrivate: false,
    timestamp: "2026-07-10T15:30:00.000Z"
  },
  {
    id: "tx-3",
    creatorUsername: "sara",
    supporterName: "Nate",
    coffeeCount: 5,
    amount: 20,
    message: "The custom SSR explanation was spot on. Here are some tea cups to keep you going!",
    isPrivate: false,
    timestamp: "2026-07-09T09:15:00.000Z"
  },
  {
    id: "tx-4",
    creatorUsername: "alex",
    supporterName: "Sophia",
    coffeeCount: 2,
    amount: 12,
    message: "Great podcast episode on building solo projects. Looking forward to the next one!",
    isPrivate: false,
    timestamp: "2026-07-11T08:00:00.000Z"
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [creators, setCreators] = useState<Creator[]>(initialCreators);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [currentUser, setCurrentUser] = useState<Creator | null>(null);
  const [theme, setTheme] = useState<"funko" | "hacker">("funko");

  // Load from local storage on mount
  useEffect(() => {
    const storedCreators = localStorage.getItem("bmc_creators");
    const storedTransactions = localStorage.getItem("bmc_transactions");
    const storedSession = localStorage.getItem("bmc_session");
    const storedTheme = localStorage.getItem("bmc_theme") as "funko" | "hacker" | null;

    if (storedCreators) {
      setCreators(JSON.parse(storedCreators));
    } else {
      localStorage.setItem("bmc_creators", JSON.stringify(initialCreators));
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      localStorage.setItem("bmc_transactions", JSON.stringify(initialTransactions));
    }

    if (storedSession) {
      setCurrentUser(JSON.parse(storedSession));
    }

    if (storedTheme === "hacker" || storedTheme === "funko") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "funko" ? "hacker" : "funko";
    setTheme(nextTheme);
    localStorage.setItem("bmc_theme", nextTheme);
  };

  // Sync helpers
  const saveCreators = (newCreators: Creator[]) => {
    setCreators(newCreators);
    localStorage.setItem("bmc_creators", JSON.stringify(newCreators));
  };

  const saveTransactions = (newTx: Transaction[]) => {
    setTransactions(newTx);
    localStorage.setItem("bmc_transactions", JSON.stringify(newTx));
  };

  const saveSession = (user: Creator | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("bmc_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("bmc_session");
    }
  };

  const registerCreator = (username: string, name: string, email: string, password: string) => {
    const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
    if (!cleanUsername) return { success: false, error: "Invalid username format" };

    const exists = creators.some(c => c.username === cleanUsername);
    if (exists) return { success: false, error: "Username is already taken" };

    const newCreator: Creator = {
      username: cleanUsername,
      name: name.trim() || cleanUsername,
      bio: "An awesome creator on Buy Me A Coffee!",
      about: `Hello! I'm ${name.trim() || cleanUsername}. Thank you for visiting my profile. I love building things and sharing them with the world. Feel free to support my journey.`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
      coverPhoto: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
      coffeePrice: 5,
      itemNoun: "coffee",
      itemEmoji: "☕",
      paymentUpi: `${cleanUsername}@upi`,
      supportersCount: 0,
      earnings: 0,
      pageViews: 10,
    };

    const updatedCreators = [...creators, newCreator];
    saveCreators(updatedCreators);
    
    // Save email/password configuration mock
    localStorage.setItem(`bmc_user_auth_${cleanUsername}`, JSON.stringify({ email, password }));
    
    // Log them in immediately
    saveSession(newCreator);
    return { success: true };
  };

  const loginCreator = (emailOrUsername: string, password: string) => {
    const cleanInput = emailOrUsername.toLowerCase().trim();
    // Search creator first
    const creator = creators.find(c => c.username === cleanInput);
    if (!creator) {
      return { success: false, error: "User not found" };
    }

    // Check credentials
    const authDataStr = localStorage.getItem(`bmc_user_auth_${creator.username}`);
    if (authDataStr) {
      const authData = JSON.parse(authDataStr);
      if (authData.password === password) {
        saveSession(creator);
        return { success: true };
      }
    } else {
      // Allow fallback login for pre-seeded accounts using password 'password'
      if (password === "password" || password === "") {
        saveSession(creator);
        return { success: true };
      }
    }

    return { success: false, error: "Incorrect password" };
  };

  const logoutCreator = () => {
    saveSession(null);
  };

  const updateCreatorProfile = (updatedFields: Partial<Creator>) => {
    if (!currentUser) return { success: false, error: "Not logged in" };

    const updatedCreators = creators.map(c => {
      if (c.username === currentUser.username) {
        const newProfile = { ...c, ...updatedFields };
        // Sync active user session
        saveSession(newProfile);
        return newProfile;
      }
      return c;
    });

    saveCreators(updatedCreators);
    return { success: true };
  };

  const addSupport = (
    creatorUsername: string,
    supporterName: string,
    coffeeCount: number,
    message: string,
    isPrivate: boolean
  ) => {
    const creator = creators.find(c => c.username === creatorUsername);
    if (!creator) return;

    const amount = coffeeCount * creator.coffeePrice;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      creatorUsername,
      supporterName: supporterName.trim() || "Someone",
      coffeeCount,
      amount,
      message: message.trim(),
      isPrivate,
      timestamp: new Date().toISOString()
    };

    saveTransactions([newTx, ...transactions]);

    // Update creator stats
    const updatedCreators = creators.map(c => {
      if (c.username === creatorUsername) {
        return {
          ...c,
          supportersCount: c.supportersCount + 1,
          earnings: c.earnings + amount
        };
      }
      return c;
    });

    saveCreators(updatedCreators);

    // If the supporter is donating to the current logged in user, refresh session stats
    if (currentUser && currentUser.username === creatorUsername) {
      saveSession({
        ...currentUser,
        supportersCount: currentUser.supportersCount + 1,
        earnings: currentUser.earnings + amount
      });
    }
  };

  const getCreatorByUsername = (username: string) => {
    const cleanUsername = username.toLowerCase().trim();
    // Increment view count randomly or once per load
    const match = creators.find(c => c.username === cleanUsername);
    return match;
  };

  const getTransactionsForCreator = (username: string) => {
    return transactions.filter(t => t.creatorUsername === username.toLowerCase().trim());
  };

  return (
    <AppContext.Provider
      value={{
        creators,
        transactions,
        currentUser,
        registerCreator,
        loginCreator,
        logoutCreator,
        updateCreatorProfile,
        addSupport,
        getCreatorByUsername,
        getTransactionsForCreator,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
