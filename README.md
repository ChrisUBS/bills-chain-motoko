# Bills Chain with Motoko

## Description

Bills Chain is a small project that allows users to share and manage bills with others. With Bills Chain, you can create new bills, pay existing ones, and even delete them. It is developed using Motoko, providing a simple and efficient way to collaborate in bill management.

## Installation

Clone the repository from GitHub:

```bash
git clone https://github.com/ChrisUBS/bills-chain-motoko
```

**Initial Steps**:  
If you want to start working on the project right away, you can use the following commands:

```bash
cd bills-chain-motoko/
dfx help
dfx canister --help
```

### Running the Project Locally

If you want to test the project on your local machine, follow these steps:

**First Time Setup (Only Once)**:

```bash
# Update package list
sudo apt update

# Install NodeJS
sudo apt-get install nodejs

# Install NPM
sudo apt-get install npm

# Install Vite with NPM
sudo npm install vite --save-dev
```

**Starting the Project**:
To start the project normally, use the following commands:

```bash
# Start the Dfinity replica, running in the background and cleaning the cache
dfx start --background --clean

# Deploy your canisters to the replica and generate the candid interface
dfx deploy
```

## Usage

Bills Chain has a simple interface that allows users to interact with the available bills. Here are the main features of the project:

- **View Bills**:  
  You can view all current bills anonymously without logging in.

- **Manage Bills (Add, Pay, Delete)**:  
  To add new bills, pay current ones, or delete them, you need to log in. This can be done using the **Login** button available in the application.
  - Once logged in, you will use an **identity** that allows you to access the advanced features of the platform.

These actions allow complete management of shared bills, facilitating collaboration among users.

## Contributions

Contributions are welcome! If you wish to contribute to the project, you can do so in the following ways:

- **Open Issues**: If you find any problems or have suggestions, please open an issue in the GitHub repository: [Issues](https://github.com/ChrisUBS/bills-chain-motoko/issues).
- **Make Pull Requests**: If you want to contribute with code, improve features, or fix bugs, you can make a pull request. Be sure to clearly explain the changes and follow best practices to facilitate the review process.

Thank you for your support and collaboration in improving Bills Chain.

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. This means you are free to use, modify, and distribute the code, provided that modified versions are also distributed under the same license. For more information, check [GPL-3.0 License](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Credits

- Project developed by **ChrisUBS**.
- Inspired by the need to manage shared bills in a more efficient and collaborative way.