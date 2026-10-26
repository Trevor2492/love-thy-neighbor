# Love Thy Neighbor

live site: https://trevor2492.github.io/love-thy-neighbor/

A single-page animation of the phrase "Love thy ___ neighbor". The blank cycles through a list of words in random order. After the last word, the blank fades away and leaves "Love thy neighbor", with "neighbor" underlined.

When the run ends, it becomes a replay button that starts again in a new random order. On mobile, the sentence stacks onto three lines.

## Running it

There's no build step or dependencies. Open `index.html` in a browser, or serve the folder with any static file server:

```
npx serve .
```

## Files

- `index.html`: page markup
- `styles.css`: all styling, with colors, fonts and timing as CSS variables at the top
- `script.js`: the word list, the animation and the play/pause/replay button

## Customizing

- **Words:** edit the `WORDS` array at the top of `script.js`.
- **Speed:** `INTERVAL_MS` in `script.js` sets how long each word stays on screen. `OUT_MS` and `IN_MS` set how long each fade lasts.
- **Colors and fonts:** change the variables in `:root` at the top of `styles.css`.
- **Phone layout:** the sentence stacks below a screen width of `40rem`. That value appears in both `styles.css` and `script.js`, so change it in both places.
