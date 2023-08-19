import type { UserSettings } from "./user";

export async function updateUserSettings(settings: UserSettings): Promise<boolean> {

    const apiCall = await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify(settings),
    });

    const apiResponse = await apiCall.json() as { success: boolean };

    if (apiResponse && apiResponse.success) {
        return true;
    }

    return false;
}
