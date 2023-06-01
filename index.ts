import { IgApiClient } from 'instagram-private-api';
import { config } from 'dotenv';

config();

const username = process.env.IG_USERNAME as string;
const password = process.env.IG_PASSWORD as string;

const ig = new IgApiClient();

export async function login() {
    ig.state.generateDevice(username);
    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login(username, password);
    process.nextTick(async () => await ig.simulate.postLoginFlow());
    return loggedInUser;
}

export async function getUser() {
    const loggedInUser = await ig.account.currentUser();
    return loggedInUser;
}

export async function getFollowers() {
    const followersFeed = ig.feed.accountFollowers(ig.state.cookieUserId);
    const followers = await followersFeed.items();
    return followers;
}

export async function getFollowing() {
    const followingFeed = ig.feed.accountFollowing(ig.state.cookieUserId);
    const following = await followingFeed.items();
    return following;
}

export async function getFollowingPosts() {
    const following = await ig.feed.accountFollowing().request();
    const followingPosts = following.users.map((user: any) => user.pk);
    return followingPosts;
}
