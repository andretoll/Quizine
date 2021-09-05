export function Connect(connection, sessionId, user) {
    return connection.send('Connect', sessionId, user);
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