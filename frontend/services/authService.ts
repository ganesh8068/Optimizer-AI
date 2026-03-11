const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  bio: string;
  jobTitle: string;
  linkedinUrl: string;
  githubUrl: string;
  codingPlatformUrl: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  resumeCount: number;
  linkedinCount: number;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

class AuthService {
  private static TOKEN_KEY = "optimizer_ai_token";
  private static USER_KEY = "optimizer_ai_user";

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getUser(): AuthUser | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  static isLoggedIn(): boolean {
    return !!this.getToken();
  }

  static saveAuth(token: string, user: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    this.saveAuth(data.token, data.user);
    return data;
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    this.saveAuth(data.token, data.user);
    return data;
  }

  static async getProfile(): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    return data.user;
  }

  static async updateProfile(updates: Partial<Pick<AuthUser, "name" | "bio" | "jobTitle" | "linkedinUrl" | "githubUrl" | "codingPlatformUrl" | "education" | "experience" | "skills">>): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile");
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    return data.user;
  }
}

export default AuthService;
