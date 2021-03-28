import { StorageInterface } from '~/services/LocalStorage'
import { CookieStorage } from '~/services/CookieStorage'

export const PROFILE = 'ct-profile-cache'

export class CookieCache {
    protected store: StorageInterface

    constructor() {
        this.store = new CookieStorage()
    }

    public get<T>(key: string): T | null {
        const item = this.store.get(key)

        if (item === null) {
            return null
        }

        try {
            return JSON.parse(item.value)
        } catch (error) {
            return null
        }
    }

    public set<T>(key: string, data: T) {
        this.store.add({
            key,
            value: JSON.stringify(data),
        })
    }

    public forget(key: string) {
        this.store.remove(key)
    }
}
