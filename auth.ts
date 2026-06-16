import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_BACK_URL || 'http://localhost:4000';
// Cambia la línea 4 para que quede exactamente así:
//const API_URL = typeof window !== "undefined" 
 // ? "/api" 
 // : (process.env.INTERNAL_API_URL || "http://veracruz-back:4000");
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                keepSession: { label: "Keep Session", type: "text" }
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null; // Retornar null dispara el CredentialsSignin internamente
                    }

                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                            keepSession: credentials.keepSession === 'true'
                        }),
                        headers: { "Content-Type": "application/json" },
                    })

                    // Si el backend responde con error (ej. 401), rechazamos
                    if (!res.ok) {
                        return null;
                    }

                    const user = await res.json()

                    if (user) {
                        const safeUser = { ...user.user };
                        delete safeUser.photo;

                        return {
                            ...safeUser,
                            accessToken: user.access_token,
                            keepSession: credentials.keepSession === 'true'
                        }
                    }

                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.user = user
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.accessToken = (user as any).accessToken
            }

            if (trigger === "update" && session?.user) {
                const updatedUser = { ...session.user };
                delete updatedUser.photo;

                token.user = {
                    ...(token.user as any),
                    ...updatedUser
                };
            }

            return token
        },
        async session({ session, token }) {
            if (token?.user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                session.user = token.user as any
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session as any).accessToken = token.accessToken

                if (token.keepSession) {
                    (session as any).keepSession = token.keepSession;
                }
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: "/login",
    },
    // 👇 ESTO SILENCIA EL ERROR ROJO EN TU TERMINAL 👇
    logger: {
        error(error) {
            if (error?.name === "CredentialsSignin") {
                return;
            }
            console.error(error);
        },
    },
})