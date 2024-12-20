# NeoPangea

> A philosophical and introspective app that helps users explore deep questions about life, identity, society, and existence. Connect with thought-provoking ideas tied to locations around the world.

## Table of Contents

- [NeoPangea](#neopangea)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Development](#development)
    - [Production](#production)
  - [Configuration](#configuration)
  - [Contributing](#contributing)
  - [License](#license)
  - [Credits](#credits)

## Features

- Explore deep philosophical questions tied to specific locations.
- Interactive and engaging interface for reflecting on life's big questions.
- Server-client architecture for seamless performance and scalability.
- Built-in linting for maintaining clean and consistent code.

## Installation

1. Clone the repository:
   
   `git clone git@github.com:thaoms/neo-pangea.git`
2. Navigate to the project directory:
   
   `cd neo-pangea`
3. Use `nvm` to set the correct Node.js version:
   
   `nvm use`
4. Install dependencies:
   
   `pnpm i`

## Usage
### Development

1. Lint the project:
   
   `pnpm lint`
2. Start the server:
   
   `pnpm start-server`
3. Start the client:
   
   `pnpm start-client`

### Production
1. `pnpm build`
   
2. `pnpm start-production`
   
3. `pnpm preview-client`

## Configuration

- You need to create your own `.env` file with the following variable:
  - OPENAI_API_KEY: Your OpenAI API key.

Example `.env` file:
`OPENAI_API_KEY=your-api-key`

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   
   `git checkout -b feature/your-feature-name`
3. Commit your changes:
   
   `git commit -m "Add your message here"`
4. Push to your branch:
   
   `git push origin feature/your-feature-name`
5. Open a pull request.

## License

This project is UNLICENSED

## Credits

- Developed by Thomas Van Kerckvoorde.
- Special thanks to OpenAI, Three.js, NASA and royaly free services where I got all my assets.
