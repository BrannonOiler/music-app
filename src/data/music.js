/** CONSTANTS */
const SHARP_NOTES = ['B#', 'C#', 'D', 'D#', 'E', 'E#', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb'];
const INTERVAL_SEMITONE_MAP = new Map(
  Object.entries({
    b9: 13,
    9: 14,
    '#9': 15,
    '#11': 18,
    b13: 20
  })
);

export default { SHARP_NOTES, FLAT_NOTES, INTERVAL_SEMITONE_MAP };
