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