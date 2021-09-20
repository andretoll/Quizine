import { useRef, useEffect } from 'react'

export function useTitle(title, prevailOnUnmount = false) {
    const defaultTitle = useRef(document.title);

    useEffect(() => {
        document.title = "Quizine | " + title;
    }, [title]);

    useEffect(() => () => {
        if (!prevailOnUnmount) {
            document.title = "Quizine | " + defaultTitle.current;
        }
    }, [prevailOnUnmount, ])
}

export default useTitle;