import { useRef, useEffect } from 'react'

function useTitle(title, prevailOnUnmount = false) {
    const baseTitle = "Quizine - ";
    const defaultTitle = useRef(document.title);

    useEffect(() => {
        document.title = baseTitle + title;
    }, [title]);

    useEffect(() => () => {
        if (!prevailOnUnmount) {
            document.title = baseTitle + defaultTitle.current;
        }
    }, [prevailOnUnmount, ])
}

export default useTitle