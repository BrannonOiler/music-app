/** DATA */
import MusicData from '../data';

/** CONSTANTS */
const { SHARP_NOTES, FLAT_NOTES, INTERVAL_SEMITONE_MAP } = MusicData;

class Note {
  constructor(noteName, octave) {
    if (!noteName) throw new Error('Note name is required');
    if (!octave) throw new Error('Octave is required');
    if (!SHARP_NOTES.includes(noteName) && !FLAT_NOTES.includes(noteName)) throw new Error('Invalid note name');

    this.noteName = noteName;
    this.octave = octave;
  }

  /* Returns note with octave (e.g. "C4") */
  toString() {
    return `${this.noteName}${this.octave}`;
  }

  /* {this.noteName} is guaranteed to be in {SHARP_NOTES} or {FLAT_NOTES} because of the constructor */
  /* Elements of {SHARP_NOTES} and {FLAT_NOTES} are enharmonic on the same index */
  /* Returned note will be from {SHARP_NOTES} */
  raiseSemitones(semitones) {
    const index = SHARP_NOTES.includes(this.noteName)
      ? SHARP_NOTES.indexOf(this.noteName)
      : FLAT_NOTES.indexOf(this.noteName);
    let newIndex = index + semitones;
    let newOctave = this.octave;

    /* Raise octave until note index is in {SHARP_NOTES} */
    while (newIndex >= SHARP_NOTES.length) {
      newIndex -= SHARP_NOTES.length;
      newOctave += 1;
    }

    /* Lower octave until note index is in {SHARP_NOTES} */
    while (newIndex < 0) {
      newIndex += SHARP_NOTES.length;
      newOctave -= 1;
    }

    /* Get new note name */
    const newNoteName = SHARP_NOTES[newIndex];

    /* Update instance variables */
    this.noteName = newNoteName;
    this.octave = newOctave;

    /* Return instance */
    return this;
  }

  lowerSemitones(semitones) {
    return this.raiseSemitones(-semitones);
  }

  raiseInterval(interval) {
    const semitones = INTERVAL_SEMITONE_MAP.get(interval);
    if (!semitones) throw new Error('Invalid interval');

    return this.raiseSemitones(semitones);
  }

  lowerInterval(interval) {
    return this.raiseInterval(-interval);
  }
}

export default Note;
