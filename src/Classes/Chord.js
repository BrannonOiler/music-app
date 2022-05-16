/** CLASSES */
import Note from './Note';

/** DATA */
import MusicData from '../data';

/** CONSTANTS */
const { SHARP_NOTES, INTERVAL_SEMITONE_MAP } = MusicData;

class Chord {
  static isNameValid(chordName) {
    try {
      Chord.createFromChordName(chordName);
      return true;
    } catch (e) {
      return false;
    }
  }

  static sortNotes(notes) {
    return notes.sort((a, b) => {
      const aIndex = SHARP_NOTES.indexOf(a.noteName);
      const bIndex = SHARP_NOTES.indexOf(b.noteName);

      if (a.octave < b.octave) return -1;
      if (a.octave > b.octave) return 1;
      if (aIndex < bIndex) return -1;
      if (aIndex > bIndex) return 1;
      return 0;
    });
  }

  static parseChordName(chordName) {
    if (chordName.length === 0) throw new Error('Chord name is empty');

    let currentIndex = 0;
    /* root, quality, tensions, bass */
    const chord = {};

    /* Get root note */
    chord.root = chordName[currentIndex];
    currentIndex += 1;

    if (['#', 'b'].includes(chordName[currentIndex])) {
      chord.root += chordName[currentIndex];
      currentIndex += 1;
    }

    /* Stop early if end of {chordName} is reached */
    if (currentIndex >= chordName.length) return chord;

    /* Get quality */
    if (['major7', 'minor7'].includes(chordName.substring(currentIndex, currentIndex + 6))) {
      chord.quality = chordName.substring(currentIndex, currentIndex + 6);
      currentIndex += 6;
    } else if (['major', 'minor'].includes(chordName.substring(currentIndex, currentIndex + 5))) {
      /* Five-character qualities */
      chord.quality = chordName.substring(currentIndex, currentIndex + 5);
      currentIndex += 5;
    } else if (['maj7', 'min7', 'dom7'].includes(chordName.substring(currentIndex, currentIndex + 4))) {
      /* Four-character qualities */
      chord.quality = chordName.substring(currentIndex, currentIndex + 4);
      currentIndex += 4;
    } else if (['maj', 'min', 'dom'].includes(chordName.substring(currentIndex, currentIndex + 3))) {
      /* Three-character qualities */
      chord.quality = chordName.substring(currentIndex, currentIndex + 3);
      currentIndex += 3;
    } else if (['M7', '^7', 'm7', '-7', '11', '13'].includes(chordName.substring(currentIndex, currentIndex + 2))) {
      /* Two-character qualities */
      chord.quality = chordName.substring(currentIndex, currentIndex + 2);
      currentIndex += 2;
    } else if (['M', '^', 'm', '-', '7', '9'].includes(chordName[currentIndex])) {
      /* One-character qualities */
      chord.quality = chordName[currentIndex];
      currentIndex += 1;
    } else {
      /* Throw error if not a valid quality */
      throw new Error('Invalid chord quality');
    }

    /* Get tensions */
    while (currentIndex < chordName.length && chordName[currentIndex] !== '/') {
      /* Initialize tensions array if it doesn't exist */
      if (chord.tensions === undefined) chord.tensions = [];

      if (INTERVAL_SEMITONE_MAP.has(chordName.substring(currentIndex, currentIndex + 3))) {
        /* Add three-character tension to {tensions} array */
        chord.tensions.push(chordName.substring(currentIndex, currentIndex + 3));
        currentIndex += 3;
      } else if (INTERVAL_SEMITONE_MAP.has(chordName.substring(currentIndex, currentIndex + 2))) {
        /* Add two-character tension to {tensions} array */
        chord.tensions.push(chordName.substring(currentIndex, currentIndex + 2));
        currentIndex += 2;
      } else {
        throw new Error('Invalid tension');
      }
    }

    /* No bass note */
    if (currentIndex >= chordName.length) return chord;

    /* Throw error if not end of string and "/" is not the next character */
    if (chordName[currentIndex] !== '/') throw new Error('Invalid bass note');

    /* Get bass */

    if (SHARP_NOTES.includes(chordName.substring(currentIndex + 1, currentIndex + 3))) {
      chord.bass = chordName.substring(currentIndex + 1, currentIndex + 3);
      currentIndex += 3;
    } else if (SHARP_NOTES.includes(chordName.substring(currentIndex + 1, currentIndex + 2))) {
      chord.bass = chordName.substring(currentIndex + 1, currentIndex + 2);
      currentIndex += 2;
    } else {
      throw new Error('Invalid bass note');
    }

    return chord;
  }

  /* Pseudo constructor
   * Make sure chord name is valid using {Chord.isNameValid}, otherwise use a try/catch block.
   */
  static createFromChordName(chordName) {
    const { root, quality, tensions, bass } = Chord.parseChordName(chordName);
    return new Chord(root, quality, tensions, bass);
  }

  constructor(root = 'C', quality = 'major', tensions = [], bass = root) {
    this.root = root;
    this.quality = quality;
    this.tensions = tensions;
    this.bass = bass;
  }

  getNotes() {
    /** Initialize array with root note */
    const rootOctave = 4;
    const notes = [new Note(this.root, rootOctave)];

    if (['M', 'major', 'maj', '^'].includes(this.quality)) {
      notes.push(new Note(this.root, rootOctave).raiseSemitones(4));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(7));
    } else if (['m', 'minor', 'min', '-'].includes(this.quality)) {
      notes.push(new Note(this.root, rootOctave).raiseSemitones(3));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(7));
    } else if (['major7', 'maj7', 'M7', '^7'].includes(this.quality)) {
      notes.push(new Note(this.root, rootOctave).raiseSemitones(4));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(7));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(11));
    } else if (['minor7', 'min7', 'm7', '-7'].includes(this.quality)) {
      notes.push(new Note(this.root, rootOctave).raiseSemitones(3));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(7));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(10));
    } else if (['7', 'dominant', 'dom7', 'dom'].includes(this.quality)) {
      notes.push(new Note(this.root, rootOctave).raiseSemitones(4));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(7));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(10));
    } else if (['9'].includes(this.quality)) {
      notes.push(new Note(this.root, rootOctave).raiseSemitones(4));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(7));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(10));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(14));
    } else if (['11'].includes(this.quality)) {
      notes.push(new Note(this.root, rootOctave).raiseSemitones(4));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(7));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(10));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(14));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(17));
    } else if (['13'].includes(this.quality)) {
      notes.push(new Note(this.root, rootOctave).raiseSemitones(4));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(7));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(10));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(14));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(17));
      notes.push(new Note(this.root, rootOctave).raiseSemitones(21));
    } else {
      throw new Error('Invalid chord quality');
    }

    this.tensions.forEach((tension) => {
      notes.push(new Note(this.root, 4).raiseInterval(tension));
    });

    /* Add bass note to front of array */
    const bassOctave = notes[0].octave - 1;
    notes.unshift(new Note(this.bass, bassOctave));

    /* Return array */
    console.log(Chord.sortNotes(notes));
    return Chord.sortNotes(notes);
  }
}

export default Chord;
