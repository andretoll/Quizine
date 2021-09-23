import { useState } from 'react'

const key = 'timeRemaining';

export function useTimeoutCache(initialValue) {

    const [cachedValue, setCachedValue] = useState(() => {

        try {
            const item = window.localStorage.getItem(key);
            return item ? parseInt(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    function setValue(value) {

        try {

            if (value === null) {
                window.localStorage.removeItem(key);
                return;
            }

            setCachedValue(value);
            window.localStorage.setItem(key, value);
        } catch (error) {
            console.error(error);
        }
    }

    return [cachedValue, setValue];
}