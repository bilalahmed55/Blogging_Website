import conf from "../conf/conf.js";
import { Client, Account } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {

        try {
            const userId = Math.random().toString(36).substring(2, 15);

            console.log("Generated userId:", userId); // Log the userId for debugging

            // Create the user account with the valid userId
            const userAccount = await this.account.create(userId, email, password, name);
            

            if (userAccount) {
                // Automatically log in the user
                await this.login({ email, password });
            }

            return userAccount;
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }



    async login({ email, password }) {
        try {
            const session = await this.account.createSession(email, password);
            return session;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;