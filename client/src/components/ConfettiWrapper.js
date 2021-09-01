import { useWindowSize } from '../hooks/useWindowSize';
import Confetti from 'react-confetti';

function ConfettiWrapper(props) {

    const size = useWindowSize();

    const colors = props.colors;

    return (
        <Confetti
            width={size.width}
            height={size.height}
            numberOfPieces={300}
            gravity={0.05}
            colors={colors}
        />
    )
}

export default ConfettiWrapper;