import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {AudioPlayer} from '../audio-player/audio-player.jsx';
import MistakesCounter from '../mistakes-counter/mistakes-counter.jsx';
import {ActionCreator} from '../../reducer.js';

export class GuessArtist extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activePlayer: false,
    };

  }

  render() {
    const {currentQuestion, incrementMistake, stepsLimit, incrementStep, mistakes, mistakesLimit} = this.props;
    const {song} = currentQuestion;
    const handleChange = (evt) => {
      incrementStep(stepsLimit);
      incrementMistake(currentQuestion, evt.target.value, mistakes, mistakesLimit);
    };

    return (
      <section className="game game--artist">
        <header className="game__header">
          <a className="game__back" href="#">
            <span className="visually-hidden">Сыграть ещё раз</span>
            <img className="game__logo" src="img/melody-logo-ginger.png" alt="Угадай мелодию" />
          </a>

          <svg xmlns="http://www.w3.org/2000/svg" className="timer" viewBox="0 0 780 780">
            <circle className="timer__line" cx="390" cy="390" r="370" style={{filter: `url(#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center`}} />
          </svg>

          <div className="timer__value" xmlns="http://www.w3.org/1999/xhtml">
            <span className="timer__mins">05</span>
            <span className="timer__dots">:</span>
            <span className="timer__secs">00</span>
          </div>

          <MistakesCounter />
        </header>

        <section className="game__screen">
          <h2 className="game__title">Кто исполняет эту песню?</h2>
          <div className="game__track">
            <div className="track">
              <AudioPlayer
                src={song.src}
                isPlaying={this.state.activePlayer}
                onPlayButtonClick={() => this.setState({
                  activePlayer: !this.state.activePlayer
                })}
              />
            </div>
          </div>

          <form className="game__artist">
            {
              currentQuestion.answers.map((item, i) => {
                const currentValue = item.artist;
                return (
                  <div className="artist" key={item + i}>
                    <input
                      className="artist__input visually-hidden"
                      type="radio"
                      name={`artist-${i + 1}`}
                      value={currentValue}
                      id={`artist-${i + 1}`}
                      onChange={handleChange}
                    />
                    <label className="artist__name" htmlFor={`artist-${i + 1}`}>
                      <img className="artist__picture" src={item.picture} alt={item.artist} />
                      {item.artist}
                    </label>
                  </div>
                );
              })
            }
          </form>
        </section>
      </section>
    );
  }
}

GuessArtist.propTypes = {
  currentQuestion: PropTypes.object,
  stepsLimit: PropTypes.number,
  mistakes: PropTypes.number,
  mistakesLimit: PropTypes.number,
  incrementMistake: PropTypes.func,
  incrementStep: PropTypes.func,
};

export default connect(
    (state) => ({
      step: state.step,
      stepsLimit: state.stepsLimit,
      mistakes: state.mistakes,
      mistakesLimit: state.mistakesLimit,
    }),
    (dispatch) => ({
      incrementStep: (stepsLimit) => dispatch(ActionCreator.incrementStep(stepsLimit)),
      incrementMistake: (currentQuestion, answers, mistakes, mistakesLimit) => {
        dispatch(ActionCreator.incrementMistake(currentQuestion, answers, mistakes, mistakesLimit));
      },
    })
)(GuessArtist);
