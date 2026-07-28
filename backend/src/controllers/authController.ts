import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken";

export const signup = async (req: any, res: any) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const token = generateToken(newUser.id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
    });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const login = async (req: any, res: any) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
    });
    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Failed to log in user" });
  }
};
