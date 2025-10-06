import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { bearer } from "better-auth/plugins";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3000/",
    "https://3000-ba42a4b6-bc7c-466a-b17d-04de8ec1b123.orchids.page",
    "https://3000-ba42a4b6-bc7c-466a-b17d-04de8ec1b123.orchids.page/",
    baseURL
  ],
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {    
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [bearer()]
});