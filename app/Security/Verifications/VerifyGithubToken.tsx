import { Octokit } from '@octokit/rest';

export default async function VerifyGithubToken(token: string): Promise<boolean | string | object> {
    try {
        if (!token || token.trim().length === 0) {
            return "Token is required";
        }
        
        const trimmedToken = token.trim();
        
        if (trimmedToken.length < 20) {
            return "Token appears to be too short. Please check your GitHub personal access token.";
        }

        const octokit = new Octokit({
            auth: trimmedToken,
        });
        
        const user = await octokit.rest.users.getAuthenticated()
        return user.data;
    }
    catch (error: any) {
        console.log('Error captured in VerifyGithubToken.tsx: ', error)
        if (error.status === 401) {
            return "Invalid or expired token. Please check your GitHub personal access token.";
        } else if (error.status === 403) {
            return "Token lacks required permissions. Please ensure the token has the necessary scopes.";
        } else if (error.status === 404) {
            return "GitHub API endpoint not found. Please check the API version.";
        } else if (error.status === 422) {
            return "Token validation failed. Please check the token format.";
        } else if (error.message) {
            return `GitHub API error: ${error.message}`;
        } else {
            return "Token verification failed due to an unknown error.";
        }
    }
}