import { useWindowSize } from '../../hooks/useWindowSize';
import Confetti from 'react-confetti';

function ConfettiWrapper(props) {

    const size = useWindowSize();

    const colors = props.colors;

    return (
        <Confetti
            width={size.width}
            height={size.height}
            numberOfPieces={100}
            gravity={0.045}
            colors={colors}
            style={{ position: 'fixed' }}
        />
    )
}

export default ConfettiWrapper;