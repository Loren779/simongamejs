import { connect } from 'react-redux';
import { handleSimonButton,
         leaveGame,
         startGame,
         stopButtonSound } from '../actions/index';
import SimonButtonGroup from '../components/SimonButtonGroup';

const mapStateToProps = (state) => {
  console.log(state); // eslint-disable-line
  return {
    colors: state.simonButtons.buttonColors,
    gameOver: state.game.gameOver,
    playing: state.game.playing,
    simonButtons: state.simonButtons.buttons,
  };
};

const mapDispatchToProps = dispatch => (
  {
    onLeaveGame: () => dispatch(leaveGame()),
    onSimonButtonMouseDown: (id) => {
      dispatch(handleSimonButton(id));
    },
    onSimonButtonMouseLeave: (active, id) => {
      dispatch(stopButtonSound(active, id));
    },
    onSimonButtonMouseUp: (active, id) => {
      dispatch(stopButtonSound(active, id));
    },
    startGame: () => dispatch(startGame()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SimonButtonGroup);
