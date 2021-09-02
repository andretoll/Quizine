import { useWindowSize } from '../hooks/useWindowSize';
import Confetti from 'react-confetti';

function ConfettiWrapper(props) {

    const size = useWindowSize();

    const colors = props.colors;

    return (
        <Confetti
            width={size.width}
            height={size.height}
            numberOfPieces={200}
            gravity={0.045}
            colors={colors}
        />
    )
}

export default ConfettiWrapper;