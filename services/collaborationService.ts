import { SessionUser, ChatMessage, ActivityLogItem } from "../types";

// Mock Users
const MOCK_USERS: SessionUser[] = [
  { id: 'u1', name: 'Sarah Chen', avatar: 'SC', role: 'admin', status: 'online', color: '#14b8a6' }, // Current User
  { id: 'u2', name: 'Marcus Cole', avatar: 'MC', role: 'editor', status: 'online', color: '#8b5cf6' },
  { id: 'u3', name: 'AI Sentinel', avatar: 'AI', role: 'viewer', status: 'online', color: '#f59e0b' },
  { id: 'u4', name: 'Elena Rodriguez', avatar: 'ER', role: 'editor', status: 'away', color: '#ec4899' },
];

const MOCK_ACTIONS = [
  { action: 'updated', target: 'Core Values' },
  { action: 'commented on', target: 'Mission Statement' },
  { action: 'generated', target: 'New Logo Variation' },
  { action: 'changed', target: 'Primary Color' },
  { action: 'reviewed', target: 'Competitor Analysis' },
];

const MOCK_MESSAGES = [
  "I think the tone is a bit too aggressive in the second paragraph.",
  "Agreed. Let's soften it with 'empowering' instead of 'dominating'.",
  "Has anyone checked the latest trend pulse?",
  "The visual identity looks solid now.",
  "Deploying the update to staging.",
];

export class CollaborationService {
  private subscribers: ((type: 'chat' | 'activity' | 'user', data: any) => void)[] = [];
  private intervalId: any;

  constructor() {
    this.startSimulation();
  }

  public subscribe(callback: (type: 'chat' | 'activity' | 'user', data: any) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  public getInitialUsers(): SessionUser[] {
    return MOCK_USERS;
  }

  public sendMessage(text: string, user: SessionUser) {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      text,
      timestamp: new Date().toISOString(),
      type: 'chat'
    };
    this.notify('chat', msg);
  }

  private notify(type: 'chat' | 'activity' | 'user', data: any) {
    this.subscribers.forEach(cb => cb(type, data));
  }

  private startSimulation() {
    // Randomly generate activity from other users
    this.intervalId = setInterval(() => {
      const r = Math.random();
      
      // 30% chance of a new chat message from a random user (excluding current user u1)
      if (r < 0.3) {
        const user = MOCK_USERS[Math.floor(Math.random() * (MOCK_USERS.length - 1)) + 1];
        const text = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
        const msg: ChatMessage = {
          id: crypto.randomUUID(),
          userId: user.id,
          userName: user.name,
          text,
          timestamp: new Date().toISOString(),
          type: 'chat'
        };
        this.notify('chat', msg);
      }
      
      // 20% chance of an activity log
      else if (r > 0.3 && r < 0.5) {
        const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const action = MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)];
        const log: ActivityLogItem = {
          id: crypto.randomUUID(),
          userId: user.id,
          userName: user.name,
          action: action.action,
          target: action.target,
          timestamp: new Date().toISOString()
        };
        this.notify('activity', log);
      }

    }, 5000); // Check every 5 seconds
  }

  public stop() {
    clearInterval(this.intervalId);
  }
}

export const collabService = new CollaborationService();