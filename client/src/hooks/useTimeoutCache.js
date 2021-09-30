/* 
This is a hook that is used to cache remaining timeout by using the localStorage API. 
It exposes the cached value and a function to set the value. 
*/

import { useState } from 'react';

export function useTimeoutCache(initialValue) {

    const key = 'timeRemaining';

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