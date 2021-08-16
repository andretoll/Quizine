import QuizForm from "./QuizForm";

function Quiz(props) {

    const content = props.content;

    return (
        <div>
            <div>{content.question}</div>
            <div>{content.category}</div>
            <div>{content.difficulty}</div>
            <QuizForm answers={content.answers} correctAnswer={props.correctAnswer} onSubmit={props.onSubmit} onNext={props.onNext} onFinal={props.onFinal} lastQuestion={content.lastQuestion} />
        </div>
    )
}

export default Quiz;