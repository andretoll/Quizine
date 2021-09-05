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

        window.addEventListener("beforeunload", handleBeforeUnload);

        function handleBeforeUnload(e) {

            if (when) {
                var confirmationMessage = { message };

                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }
        }

        return function cleanup() {
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