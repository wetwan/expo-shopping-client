import { TokenCache } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const createTokenCache = (): TokenCache => {
    return {
        getToken: async (key: string) => {
            try {
                const token = await SecureStore.getItemAsync(key);
                if (token) {
                    console.log(`${token} found in cache \n`);
                } else {
                    console.log(`No token found in cache ` + key);
                }
                return token;
            } catch (error) {
                console.log(error);
            }
        },
        saveToken: (key: string, token: string) => {
            return SecureStore.setItemAsync(key, token)

        },

    }

}

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;