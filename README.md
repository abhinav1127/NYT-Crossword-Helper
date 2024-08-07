# NYT-Crossword-Helper

A Chrome extension that reveals certain letters on NYT crosswords!

## Features

- Automatically enables the "Autocheck" feature.
- Fills the crossword puzzle with letters.
- Clears the puzzle after filling it.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/nyt-crossword-helper.git
   ```
2. Navigate to the project directory:
   ```sh
   cd nyt-crossword-helper
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

## Usage

1. Build the project:
   ```sh
   npm run build
   ```
2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" using the toggle switch.
   - Click "Load unpacked" and select the `dist` directory.

### Scripts

- `npm run build`: Builds the project using Webpack.
- `npm run format`: Formats the code using Prettier.
- `npm run format:check`: Checks the code formatting using Prettier.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Make your changes.
4. Run the linter and code formatter:
   ```sh
   npm run lint:fix
   npm run format
   ```
5. Make your changes and commit them:
   ```sh
   git commit -m "Description of changes"
   ```
6. Push to the branch:
   ```sh
   git push origin feature-branch
   ```
7. Open a pull request.

## License

This project is licensed under the ISC License.
