import { Fragment, useEffect, useState } from 'react';
import { Prompt } from 'react-router';

function PromptWrapper(props) {

    const title = props.title;
    const when = props.when;

    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage(props.message);
    }, [props.message]);

    useEffect(() => {

        console.debug("Adding eventlistener for 'beforeunload' event.");
        window.addEventListener("beforeunload", handleBeforeUnload);

        function handleBeforeUnload(e) {

            console.debug("beforeUnload triggered");

            if (when) {
                var confirmationMessage = { message };

                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }
        }

        return () => {
            console.debug("Removing eventlistener for 'beforeunload' event.");
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, [message, when]);

    return (
        <Fragment>
            <Prompt title={title} message={message} when={when} />
        </Fragment>
    )
}

export default PromptWrapper;