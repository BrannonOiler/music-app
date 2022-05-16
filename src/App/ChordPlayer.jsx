/** PACKAGES */
import { useState } from 'react';
import * as Tone from 'tone';

/** CLASSES */
import Chord from '../Classes/Chord';

function ChordPlayer() {
  const [chordName, setChordName] = useState('');
  const [isChordNameValid, setIsChordNameValid] = useState(false);

  const changeChordName = (event) => {
    const newChordName = event.target.value;

    setIsChordNameValid(Chord.isNameValid(newChordName));
    setChordName(newChordName);
  };

  const playChord = () => {
    /* Create poly synth */
    const amPolySynth = new Tone.PolySynth(Tone.AMSynth).toDestination();
    const fmPolySynth = new Tone.PolySynth(Tone.FMSynth).toDestination();

    /* Instantiate chord */
    const chord = Chord.createFromChordName(chordName);

    /* Play chord */
    const now = Tone.now();
    chord.getNotes().forEach((note, index) => {
      if (index % 2 === 0) amPolySynth.triggerAttackRelease(note.toString(), '4n', now);
      else fmPolySynth.triggerAttackRelease(note.toString(), '4n', now);
    });
  };

  return (
    <div>
      {/** Header */}
      <h1>Chord Player</h1>

      {/** Chord input and play button */}
      {/* Chord name input */}
      <input placeholder="Chord Name" onChange={changeChordName} />
      {/* Play chord button */}
      <button type="button" disabled={!isChordNameValid} onClick={playChord}>
        Play
      </button>

      {/** Chord details */}
      <div>
        <i>Details</i>
        {/* Display chord details */}
        {isChordNameValid && <p>{JSON.stringify(Chord.parseChordName(chordName))}</p>}
      </div>
    </div>
  );
}

export default ChordPlayer;
