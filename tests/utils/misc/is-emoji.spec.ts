import { isEmoji } from '~/utils/misc/is-emoji';

describe('isEmoji', () => {
  test.each([
    ['Simple emoji', '😊'],
    ['Thumbs up', '👍'],
    ['Thumbs up light skin tone', '👍🏻'],
    ['Thumbs up dark skin tone', '👍🏿'],
    ['Man', '👨'],
    ['Woman', '👩'],
    ['Family (man, woman, girl, boy)', '👨‍👩‍👧‍👦'],
    ['Rainbow flag', '🏳️‍🌈'],
    ['Pirate flag', '🏴‍☠️'],
    ['US flag', '🇺🇸'],
    ['Japan flag', '🇯🇵'],
    ['UN flag', '🇺🇳'],
    ['Keycap 1', '1️⃣'],
    ['Keycap #', '#️⃣'],
    ['Medical worker medium skin tone', '👩🏽‍⚕️'],
    ['Couple kissing', '👩‍❤️‍💋‍👨'],
    ['Astronaut', '🧑‍🚀'],
    ['Family of three', '👨‍👩‍👧'],
    ['Transgender flag', '🏳️‍⚧️'],
    ['Heart', '❤️'],
    ['Black heart', '🖤']
  ])('%s', (_, input) => {
    expect(isEmoji(input)).toBe(true);
  });

  test.each([
    ['Empty string', ''],
    ['Text only', 'hello'],
    ['Two emojis', '😊😊'],
    ['Emoji with spaces', ' 🍦 '],
    ['Emoji plus letter', '😊a'],
    ['Letter plus emoji', 'a😊'],
    ['Multiple ZWJ clusters', '👨‍👩‍👧‍👦👨‍👩‍👧‍👦'],
    ['Variation selector only', '\uFE0F'],
    ['Emoji inside text', 'test🚀rocket'],
    ['Combining marks only', 'e\u0301'],
    ['Zero width joiner only', '\u200D']
  ])('%s', (_, input) => {
    expect(isEmoji(input)).toBe(false);
  });
});
