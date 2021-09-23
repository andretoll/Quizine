import { useState } from 'react'

const key = 'timeRemaining';

export function useTimeoutCache(initialValue) {

    const [cachedValue, setCachedValue] = useState(() => {

        try {
            const item = localStorage.getItem(key);
            return item ? parseInt(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    function setValue(value) {

        try {

            if (value === null) {
                localStorage.removeItem(key);
                return;
            }

            setCachedValue(value);
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(error);
        }
    }

    return [cachedValue, setValue];
}