/* 
This is a service that is used for communication with the server. 
It exposes functions to send requests to both WebAPI and SignalR hub. 
*/

export function Connect(connection, sessionId) {
    return connection.send('Connect', sessionId);
}

export function Disconnect(connection) {
    return connection.send('Disconnect');
}

export function Start(connection, sessionId) {
    return connection.send('Start', sessionId);
}

export function SubmitAnswer(connection, sessionId, quizId, answerId) {
    return connection.send('SubmitAnswer', sessionId, quizId, answerId);
}

export function NextQuestion(connection, sessionId) {
    return connection.send('NextQuestion', sessionId);
}

export function GetResults(connection, sessionId) {
    return connection.send('GetResults', sessionId);
}

export function PromptRematch(connection, sessionId, newSessionId) {
    return connection.send('PromptRematch', sessionId, newSessionId);
}

export async function FetchCategories() {
    return await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
        }
    });
}

export async function FetchRules() {
    return await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/rules`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
        }
    });
}

export async function FetchSessionLifetime() {
    return await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/session-lifetime`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
        }
    });
}

export async function Create(data) {
    return await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/create`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
        }
    });
}

export async function Join(data) {
    return await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/join`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
        }
    });
}

export async function Rematch(data) {
    return await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/rematch`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
        }
    });
}

export async function FetchAnswers(data) {
    return await fetch(`${process.env.REACT_APP_QUIZINE_API_BASE_URL}quiz/answers`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.REACT_APP_QUIZINE_API_KEY
        }
    });
}