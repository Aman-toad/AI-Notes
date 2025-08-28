import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "../models/User";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? (() => { throw new Error("GOOGLE_CLIENT_ID is not set"); })(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? (() => { throw new Error("GOOGLE_CLIENT_SECRET is not set"); })(),
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label:"Email", type: "text"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials){
        if(!credentials?.email || !credentials?.password){
          throw new Error("Missing email or Password")
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({email: credentials.email})

          if(!user){
            throw new Error("No user found with this email !!")
          }

          const isvalid = await bcrypt.compare(credentials.password, user.password);

          if(!isvalid){
            throw new Error("Invalid Password !!")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          }
        } catch (error) {
          console.error("Auth Error", error);
          throw error
        }
      }
    })
  ],

  callbacks: {

    async signIn({user,account, profile, email}){
      await connectToDatabase();
      const existingUser = await User.findOne({email: user.email});
      if(!existingUser){
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image
        });
      }
      return true
    },

    async jwt({token, user}){
      if(user){
        token.id = user.id;
        token.name = user.name;
        token.email = user.email
      }
      return token
    },
    async session({session,token }){
      if(session.user){
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session
    },

    async redirect({url, baseUrl}){
      return `${baseUrl}/dashboard`;
    },

    
  }, 

  pages: {
    signIn: "/login",
    error: "/login",
  }, 

  session: {
    strategy: "jwt",
    maxAge: 30*24*60*60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};