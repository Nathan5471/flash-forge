import { createContext, useState, useContext } from "react";
import { getCurrentUser } from "../utils/AuthAPIHandler";

interface AuthContextType {
  user:
    | {
        id: string;
        username: string;
        flashcardSets: {
          id: string;
          name: string;
          description: string;
          creator: string;
          flashcards: number;
        }[];
        viewedFlashcardSets: {
          id: string;
          name: string;
          description: string;
          creator: string;
          flashcards: number;
        }[];
      }
    | null
    | undefined;
  getUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);

  const getUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser.user);
    } catch (error) {
      setUser(null);
    }
  };

  const contextValue = { user, getUser };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
