import axiosInstance from '@/configs/axios';

interface PresignFileResponse {
    success: boolean;
    message: string;
    error_code: string;
    data: {
        url: string;
        expires_in: number;
    };
}

// Session storage key prefix for profile pictures
const PROFILE_PICTURE_CACHE_PREFIX = 'profile_picture_';

/**
 * Get cached profile picture URL from sessionStorage
 */
const getCachedProfilePicture = (userId: string): string | null => {
    try {
        return sessionStorage.getItem(`${PROFILE_PICTURE_CACHE_PREFIX}${userId}`);
    } catch {
        return null;
    }
};

/**
 * Set profile picture URL in sessionStorage
 */
const setCachedProfilePicture = (userId: string, url: string): void => {
    try {
        sessionStorage.setItem(`${PROFILE_PICTURE_CACHE_PREFIX}${userId}`, url);
    } catch (error) {
        console.warn('Failed to cache profile picture in sessionStorage:', error);
    }
};

/**
 * Clear cached profile picture URL for a specific user.
 * Call this when updating a user's profile picture to force re-fetch.
 */
export const clearCachedProfilePicture = (userId: string): void => {
    try {
        sessionStorage.removeItem(`${PROFILE_PICTURE_CACHE_PREFIX}${userId}`);
    } catch (error) {
        console.warn('Failed to clear cached profile picture:', error);
    }
};

/**
 * Get (and cache) presigned profile picture URL for a user.
 * - Uses sessionStorage to persist cache during browser session
 * - Cache is automatically cleared when browser/tab is closed
 * - `userId` is used as the cache key
 * - `objectPath` is the path returned by backend for this user's profile picture (e.g. "profiles/xxx.png")
 */
export const getUserProfilePictureUrl = async (
    userId: string,
    objectPath?: string | null
): Promise<string | null> => {
    if (!userId || !objectPath) return null;

    // Return from sessionStorage cache if we already fetched it for this user
    const cachedUrl = getCachedProfilePicture(userId);
    if (cachedUrl) {
        return cachedUrl;
    }

    const res = await axiosInstance.get<PresignFileResponse>('/v1/files/presign', {
        params: {
            object_path: objectPath,
        },
        headers: {
            accept: 'application/json',
            'ngrok-skip-browser-warning': 'true',
        },
    });

    if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to get profile picture URL');
    }

    const url = res.data.data.url;

    // Cache in sessionStorage - persists during session, clears on browser/tab close
    setCachedProfilePicture(userId, url);

    return url;
};


