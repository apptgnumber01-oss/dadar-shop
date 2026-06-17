import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
 * Dadar Shop — Client-side Auth System
 * ---------------------------------------------------------
 * Features:
 *  - Email + Password login
 *  - Registration with email/phone verification
 *  - Forgot / Reset password
 *  - OTP login (email or phone)
 *  - Social login (Google / Facebook) — mocked
 *  - Remember Me (persisted session)
 *  - Account lock after 5 failed attempts (15 min)
 *  - Rate limiting on OTP requests (60s cooldown)
 *  - Mock JWT issuance + session expiry
 *  - Bilingual (en / bn)
 * Notes:
 *  - Pure client mock — no backend. Suitable for demos.
 *  - DEMO accounts (kept out of UI per request):
 *      ADMIN  : admin@dadar.shop      / Admin@2026
 *      USER   : user@dadar.shop       / User@2026
 * ========================================================= */

export type AuthRole = "admin" | "user";
export type Lang = "en" | "bn";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AuthRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  avatarUrl?: string;
  createdAt: number;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface Session {
  token: string; // mock JWT
  userId: string;
  issuedAt: number;
  expiresAt: number;
  remember: boolean;
}

interface LockState {
  failures: number;
  lockedUntil?: number;
}

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  lang: Lang;
  loading: boolean;
}

interface AuthApi extends AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setLang: (l: Lang) => void;
  t: (k: TranslationKey) => string;
  login: (email: string, password: string, remember: boolean) => Promise<AuthUser>;
  register: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<AuthUser>;
  logout: () => void;
  requestOtp: (channel: "email" | "phone", target: string) => Promise<string>; // returns dev otp
  verifyOtp: (target: string, code: string) => Promise<AuthUser>;
  verifyEmail: (code: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
  sendVerificationEmail: () => Promise<string>;
  sendVerificationPhone: () => Promise<string>;
  forgotPassword: (email: string) => Promise<string>; // returns reset token
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  socialLogin: (provider: "google" | "facebook") => Promise<AuthUser>;
  getLockInfo: (email: string) => LockState;
}

const AuthContext = createContext<AuthApi | null>(null);

const LS_USERS = "dadar.auth.users.v1";
const LS_SESSION = "dadar.auth.session.v1";
const LS_LANG = "dadar.auth.lang.v1";
const LS_LOCKS = "dadar.auth.locks.v1";
const LS_OTPS = "dadar.auth.otps.v1";
const LS_RESETS = "dadar.auth.resets.v1";
const LS_COOLDOWN = "dadar.auth.cooldown.v1";

const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const SESSION_MS_REMEMBER = 30 * 24 * 60 * 60 * 1000;
const SESSION_MS_DEFAULT = 12 * 60 * 60 * 1000;

/* ------------- helpers ------------- */
const safeJson = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  return safeJson(window.localStorage.getItem(key), fallback);
};
const write = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const randomId = () =>
  "u_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const mockJwt = (payload: Record<string, unknown>) => {
  // NOT a real JWT — purely for demo
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const sig = btoa(
    "dadar." + Math.random().toString(36).slice(2, 10) + "." + Date.now(),
  );
  return `${header}.${body}.${sig}`;
};

const sixDigit = () =>
  String(Math.floor(100000 + Math.random() * 900000));

/* ------------- demo seed ------------- */
const DEMO_USERS: StoredUser[] = [
  {
    id: "u_admin_demo",
    name: "Dadar Admin",
    email: "admin@dadar.shop",
    phone: "+8801700000001",
    password: "Admin@2026",
    role: "admin",
    emailVerified: true,
    phoneVerified: true,
    createdAt: Date.now(),
  },
  {
    id: "u_user_demo",
    name: "Demo User",
    email: "user@dadar.shop",
    phone: "+8801700000002",
    password: "User@2026",
    role: "user",
    emailVerified: true,
    phoneVerified: true,
    createdAt: Date.now(),
  },
];

const loadUsers = (): StoredUser[] => {
  const stored = read<StoredUser[]>(LS_USERS, []);
  if (stored.length === 0) {
    write(LS_USERS, DEMO_USERS);
    return DEMO_USERS;
  }
  // ensure demo accounts always exist
  let changed = false;
  const out = [...stored];
  for (const d of DEMO_USERS) {
    if (!out.find((u) => u.email === d.email)) {
      out.push(d);
      changed = true;
    }
  }
  if (changed) write(LS_USERS, out);
  return out;
};

const saveUsers = (u: StoredUser[]) => write(LS_USERS, u);

/* ------------- translations ------------- */
type TranslationKey =
  | "auth.login"
  | "auth.register"
  | "auth.email"
  | "auth.phone"
  | "auth.password"
  | "auth.confirmPassword"
  | "auth.name"
  | "auth.remember"
  | "auth.forgot"
  | "auth.signin"
  | "auth.signup"
  | "auth.or"
  | "auth.continueGoogle"
  | "auth.continueFacebook"
  | "auth.haveAccount"
  | "auth.noAccount"
  | "auth.otpLogin"
  | "auth.sendOtp"
  | "auth.verifyOtp"
  | "auth.enterOtp"
  | "auth.resend"
  | "auth.forgotTitle"
  | "auth.forgotSub"
  | "auth.sendReset"
  | "auth.resetTitle"
  | "auth.newPassword"
  | "auth.resetBtn"
  | "auth.verifyEmailTitle"
  | "auth.verifyPhoneTitle"
  | "auth.welcome"
  | "auth.subtitle"
  | "auth.invalidCreds"
  | "auth.accountLocked"
  | "auth.rateLimited"
  | "auth.success"
  | "auth.logout"
  | "auth.tagline"
  | "auth.demoHint";

const T: Record<Lang, Record<TranslationKey, string>> = {
  en: {
    "auth.login": "Sign in",
    "auth.register": "Create account",
    "auth.email": "Email",
    "auth.phone": "Phone number",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm password",
    "auth.name": "Full name",
    "auth.remember": "Remember me for 30 days",
    "auth.forgot": "Forgot password?",
    "auth.signin": "Sign in",
    "auth.signup": "Create account",
    "auth.or": "or continue with",
    "auth.continueGoogle": "Continue with Google",
    "auth.continueFacebook": "Continue with Facebook",
    "auth.haveAccount": "Already have an account?",
    "auth.noAccount": "New to Dadar Shop?",
    "auth.otpLogin": "Sign in with OTP",
    "auth.sendOtp": "Send code",
    "auth.verifyOtp": "Verify",
    "auth.enterOtp": "Enter the 6-digit code",
    "auth.resend": "Resend code",
    "auth.forgotTitle": "Forgot your password?",
    "auth.forgotSub":
      "Enter your account email and we'll send a reset link.",
    "auth.sendReset": "Send reset link",
    "auth.resetTitle": "Set a new password",
    "auth.newPassword": "New password",
    "auth.resetBtn": "Update password",
    "auth.verifyEmailTitle": "Verify your email",
    "auth.verifyPhoneTitle": "Verify your phone",
    "auth.welcome": "Welcome back",
    "auth.subtitle": "Sign in to keep shopping.",
    "auth.invalidCreds": "Invalid email or password.",
    "auth.accountLocked":
      "Too many attempts. Account temporarily locked. Try again later.",
    "auth.rateLimited": "Please wait before requesting another code.",
    "auth.success": "Success",
    "auth.logout": "Sign out",
    "auth.tagline": "Shop anything, beautifully.",
    "auth.demoHint": "",
  },
  bn: {
    "auth.login": "সাইন ইন",
    "auth.register": "অ্যাকাউন্ট তৈরি",
    "auth.email": "ইমেইল",
    "auth.phone": "মোবাইল নম্বর",
    "auth.password": "পাসওয়ার্ড",
    "auth.confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
    "auth.name": "পূর্ণ নাম",
    "auth.remember": "৩০ দিনের জন্য মনে রাখুন",
    "auth.forgot": "পাসওয়ার্ড ভুলে গেছেন?",
    "auth.signin": "সাইন ইন",
    "auth.signup": "অ্যাকাউন্ট তৈরি করুন",
    "auth.or": "অথবা চালিয়ে যান",
    "auth.continueGoogle": "Google দিয়ে চালিয়ে যান",
    "auth.continueFacebook": "Facebook দিয়ে চালিয়ে যান",
    "auth.haveAccount": "আগে থেকেই অ্যাকাউন্ট আছে?",
    "auth.noAccount": "দাদার শপে নতুন?",
    "auth.otpLogin": "OTP দিয়ে সাইন ইন",
    "auth.sendOtp": "কোড পাঠান",
    "auth.verifyOtp": "যাচাই করুন",
    "auth.enterOtp": "৬-সংখ্যার কোড লিখুন",
    "auth.resend": "আবার পাঠান",
    "auth.forgotTitle": "পাসওয়ার্ড ভুলে গেছেন?",
    "auth.forgotSub":
      "আপনার ইমেইল লিখুন, আমরা একটি রিসেট লিংক পাঠাব।",
    "auth.sendReset": "রিসেট লিংক পাঠান",
    "auth.resetTitle": "নতুন পাসওয়ার্ড সেট করুন",
    "auth.newPassword": "নতুন পাসওয়ার্ড",
    "auth.resetBtn": "পাসওয়ার্ড আপডেট",
    "auth.verifyEmailTitle": "ইমেইল যাচাই করুন",
    "auth.verifyPhoneTitle": "ফোন যাচাই করুন",
    "auth.welcome": "আবার স্বাগতম",
    "auth.subtitle": "কেনাকাটা চালিয়ে যেতে সাইন ইন করুন।",
    "auth.invalidCreds": "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।",
    "auth.accountLocked":
      "অনেকবার ভুল চেষ্টা। অ্যাকাউন্ট সাময়িক বন্ধ। পরে চেষ্টা করুন।",
    "auth.rateLimited": "নতুন কোড চাওয়ার আগে অপেক্ষা করুন।",
    "auth.success": "সফল",
    "auth.logout": "সাইন আউট",
    "auth.tagline": "সুন্দরভাবে যেকোনো কিছু কিনুন।",
    "auth.demoHint": "",
  },
};

export type { TranslationKey };

/* ------------- provider ------------- */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [lang, setLangState] = useState<Lang>("en");
  const [loading, setLoading] = useState(true);

  // Bootstrap from storage on mount (client only)
  useEffect(() => {
    loadUsers();
    const storedLang = read<Lang>(LS_LANG, "en");
    setLangState(storedLang);
    const s = read<Session | null>(LS_SESSION, null);
    if (s && s.expiresAt > Date.now()) {
      const users = loadUsers();
      const u = users.find((x) => x.id === s.userId);
      if (u) {
        const { password: _p, ...rest } = u;
        setUser(rest);
        setSession(s);
      } else {
        write(LS_SESSION, null);
      }
    } else if (s) {
      write(LS_SESSION, null);
    }
    setLoading(false);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    write(LS_LANG, l);
  }, []);

  const t = useCallback(
    (k: TranslationKey) => T[lang][k] ?? T.en[k] ?? k,
    [lang],
  );

  const getLockInfo = useCallback((email: string): LockState => {
    const locks = read<Record<string, LockState>>(LS_LOCKS, {});
    return locks[email.toLowerCase()] ?? { failures: 0 };
  }, []);

  const setLockInfo = (email: string, state: LockState) => {
    const locks = read<Record<string, LockState>>(LS_LOCKS, {});
    locks[email.toLowerCase()] = state;
    write(LS_LOCKS, locks);
  };

  const persistSession = (u: AuthUser, remember: boolean) => {
    const now = Date.now();
    const s: Session = {
      token: mockJwt({ sub: u.id, role: u.role, iat: now }),
      userId: u.id,
      issuedAt: now,
      expiresAt: now + (remember ? SESSION_MS_REMEMBER : SESSION_MS_DEFAULT),
      remember,
    };
    write(LS_SESSION, s);
    setSession(s);
    setUser(u);
    return s;
  };

  const login: AuthApi["login"] = async (email, password, remember) => {
    await new Promise((r) => setTimeout(r, 350));
    const lock = getLockInfo(email);
    if (lock.lockedUntil && lock.lockedUntil > Date.now()) {
      throw new Error(t("auth.accountLocked"));
    }
    const users = loadUsers();
    const stored = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!stored || stored.password !== password) {
      const failures = (lock.failures ?? 0) + 1;
      const next: LockState = { failures };
      if (failures >= MAX_FAILURES) {
        next.lockedUntil = Date.now() + LOCK_MS;
        next.failures = 0;
        setLockInfo(email, next);
        throw new Error(t("auth.accountLocked"));
      }
      setLockInfo(email, next);
      throw new Error(t("auth.invalidCreds"));
    }
    setLockInfo(email, { failures: 0 });
    const { password: _p, ...safe } = stored;
    persistSession(safe, remember);
    return safe;
  };

  const register: AuthApi["register"] = async ({ name, email, phone, password }) => {
    await new Promise((r) => setTimeout(r, 400));
    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(
        lang === "bn"
          ? "এই ইমেইল ইতিমধ্যে নিবন্ধিত।"
          : "This email is already registered.",
      );
    }
    const newUser: StoredUser = {
      id: randomId(),
      name,
      email,
      phone,
      password,
      role: "user",
      emailVerified: false,
      phoneVerified: false,
      createdAt: Date.now(),
    };
    saveUsers([...users, newUser]);
    const { password: _p, ...safe } = newUser;
    persistSession(safe, false);
    return safe;
  };

  const logout = useCallback(() => {
    write(LS_SESSION, null);
    setSession(null);
    setUser(null);
  }, []);

  // rate-limited OTP
  const requestOtp: AuthApi["requestOtp"] = async (channel, target) => {
    await new Promise((r) => setTimeout(r, 300));
    const cooldowns = read<Record<string, number>>(LS_COOLDOWN, {});
    const last = cooldowns[target] ?? 0;
    if (Date.now() - last < OTP_COOLDOWN_MS) {
      throw new Error(t("auth.rateLimited"));
    }
    const code = sixDigit();
    const otps = read<Record<string, { code: string; exp: number; channel: string }>>(
      LS_OTPS,
      {},
    );
    otps[target] = { code, exp: Date.now() + 5 * 60 * 1000, channel };
    write(LS_OTPS, otps);
    cooldowns[target] = Date.now();
    write(LS_COOLDOWN, cooldowns);
    // In real life this would be emailed/SMSd. For demo we surface it.
    console.info(`[Dadar Auth] OTP for ${target}: ${code}`);
    return code;
  };

  const verifyOtp: AuthApi["verifyOtp"] = async (target, code) => {
    await new Promise((r) => setTimeout(r, 250));
    const otps = read<Record<string, { code: string; exp: number }>>(LS_OTPS, {});
    const rec = otps[target];
    if (!rec || rec.exp < Date.now() || rec.code !== code) {
      throw new Error(
        lang === "bn" ? "ভুল বা মেয়াদোত্তীর্ণ কোড।" : "Invalid or expired code.",
      );
    }
    delete otps[target];
    write(LS_OTPS, otps);

    const users = loadUsers();
    let stored = users.find(
      (u) =>
        u.email.toLowerCase() === target.toLowerCase() ||
        u.phone === target,
    );
    if (!stored) {
      // auto-provision an account for OTP login by phone/email
      stored = {
        id: randomId(),
        name: target.includes("@") ? target.split("@")[0] : "OTP User",
        email: target.includes("@") ? target : `${randomId()}@otp.dadar.shop`,
        phone: !target.includes("@") ? target : undefined,
        password: randomId(),
        role: "user",
        emailVerified: target.includes("@"),
        phoneVerified: !target.includes("@"),
        createdAt: Date.now(),
      };
      saveUsers([...users, stored]);
    }
    const { password: _p, ...safe } = stored;
    persistSession(safe, false);
    return safe;
  };

  const verifyEmail: AuthApi["verifyEmail"] = async (code) => {
    if (!user) throw new Error("Not signed in");
    await verifyOtp(user.email, code);
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx].emailVerified = true;
      saveUsers(users);
      setUser({ ...user, emailVerified: true });
    }
  };

  const verifyPhone: AuthApi["verifyPhone"] = async (code) => {
    if (!user || !user.phone) throw new Error("No phone on file");
    await verifyOtp(user.phone, code);
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx].phoneVerified = true;
      saveUsers(users);
      setUser({ ...user, phoneVerified: true });
    }
  };

  const sendVerificationEmail = async () => {
    if (!user) throw new Error("Not signed in");
    return requestOtp("email", user.email);
  };
  const sendVerificationPhone = async () => {
    if (!user || !user.phone) throw new Error("No phone on file");
    return requestOtp("phone", user.phone);
  };

  const forgotPassword: AuthApi["forgotPassword"] = async (email) => {
    await new Promise((r) => setTimeout(r, 300));
    const users = loadUsers();
    const stored = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    // Always succeed to avoid email enumeration
    const token =
      "rst_" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
    if (stored) {
      const resets = read<Record<string, { userId: string; exp: number }>>(
        LS_RESETS,
        {},
      );
      resets[token] = { userId: stored.id, exp: Date.now() + 15 * 60 * 1000 };
      write(LS_RESETS, resets);
      console.info(`[Dadar Auth] Reset link: /auth/reset?token=${token}`);
    }
    return token;
  };

  const resetPassword: AuthApi["resetPassword"] = async (token, newPassword) => {
    await new Promise((r) => setTimeout(r, 300));
    const resets = read<Record<string, { userId: string; exp: number }>>(
      LS_RESETS,
      {},
    );
    const rec = resets[token];
    if (!rec || rec.exp < Date.now()) {
      throw new Error(
        lang === "bn" ? "টোকেন অবৈধ বা মেয়াদোত্তীর্ণ।" : "Invalid or expired token.",
      );
    }
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === rec.userId);
    if (idx < 0) throw new Error("Account not found");
    users[idx].password = newPassword;
    saveUsers(users);
    delete resets[token];
    write(LS_RESETS, resets);
    // clear any lock
    setLockInfo(users[idx].email, { failures: 0 });
  };

  const socialLogin: AuthApi["socialLogin"] = async (provider) => {
    await new Promise((r) => setTimeout(r, 500));
    const email = `${provider}.user@dadar.shop`;
    const users = loadUsers();
    let stored = users.find((u) => u.email === email);
    if (!stored) {
      stored = {
        id: randomId(),
        name: provider === "google" ? "Google User" : "Facebook User",
        email,
        password: randomId(),
        role: "user",
        emailVerified: true,
        phoneVerified: false,
        createdAt: Date.now(),
      };
      saveUsers([...users, stored]);
    }
    const { password: _p, ...safe } = stored;
    persistSession(safe, true);
    return safe;
  };

  const api: AuthApi = useMemo(
    () => ({
      user,
      session,
      lang,
      loading,
      isAuthenticated: !!user && !!session && session.expiresAt > Date.now(),
      isAdmin: user?.role === "admin",
      setLang,
      t,
      login,
      register,
      logout,
      requestOtp,
      verifyOtp,
      verifyEmail,
      verifyPhone,
      sendVerificationEmail,
      sendVerificationPhone,
      forgotPassword,
      resetPassword,
      socialLogin,
      getLockInfo,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, session, lang, loading],
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
