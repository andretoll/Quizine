export function Connect(connection, sessionId, user) {
    connection.send('Connect', sessionId, user);
}

export function Start(connection, sessionId) {
    connection.send('Start', sessionId);
}

export function SubmitAnswer(connection, sessionId, quizId, answerId) {
    connection.send('SubmitAnswer', sessionId, quizId, answerId);
}

export function NextQuestion(connection, sessionId) {
    connection.send('NextQuestion', sessionId);
}