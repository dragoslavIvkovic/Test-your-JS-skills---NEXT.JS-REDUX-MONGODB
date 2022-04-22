import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
 
import GithubProvider from "next-auth/providers/github"
 
 
export default NextAuth({
 
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
     
      
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
   
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
     
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }  
      },
    }),
  
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
       }),
  ],
secret: process.env.SECRET,

    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            return true;
        },
        // async redirect({ url, baseUrl }) { return baseUrl },
        // async session({ session, token, user }) { return session },
        // async jwt({ token, user, account, profile, isNewUser }) { return token }
    },

    theme: {
        colorScheme: 'light',
    },

    debug: false,
});
