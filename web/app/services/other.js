// Other useful functions
import ApiService from './api';
import { getUserId } from './userApi';

export async function swipeRight(articleId) {
    const userId = await getUserId();
    return ApiService.swipeRight(userId, articleId);
}

export async function interactWithSegment(segmentId) {
    const userId = await getUserId();
    return ApiService.interactWithSegment(userId, segmentId);
}

export async function getInteractedSegments(articleId) {
    const userId = await getUserId();
    return ApiService.getUserInteractedSegments(userId, articleId);
}

export async function getStreakCond() {
    const userId = await getUserId();
    return ApiService.getUserStreakCond(userId);
}

export async function completeStreak() {
    const userId = await getUserId();
    return ApiService.userCompleteStreak(userId);
}

export async function getMyData() {
    const userId = await getUserId();
    return ApiService.getUserData(userId);
}

