# Multi-Chain Wallet Generator

A command-line tool to generate wallets for multiple blockchain networks. Currently supports TON, SUI, Solana, and EVM networks.

## Features

- Generate wallets for multiple blockchain networks:
  - TON (The Open Network)
  - SUI (Sui Network)
  - Solana
  - EVM (Ethereum Virtual Machine)
- Bulk wallet generation
- User-friendly CLI with arrow key navigation
- Progress indicators and colorful interface
- Organized output files
- Secure wallet generation

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository

```bash
git clone https://github.com/Galkurta/Wallet-Generator.git
cd Wallet-Generator
```

2. Install dependencies

```bash
npm install
```

## Usage

1. Start the application

```bash
npm start
```

2. Use arrow keys to navigate through the menu
3. Select the desired blockchain network
4. Enter the number of wallets to generate
5. Find the generated wallets in the `output` folder:
   - `{NETWORK}_wallets_details_{TIMESTAMP}.txt`: Contains complete wallet information
   - `{NETWORK}_addresses_{TIMESTAMP}.txt`: Contains only wallet addresses

## Project Structure

```
Wallet-Generator/
├── package.json
├── src/
│   ├── constants/
│   │   └── banner.js
│   ├── core/
│   │   └── baseWallet.js
│   ├── generators/
│   │   ├── tonWallet.js
│   │   ├── suiWallet.js
│   │   ├── solanaWallet.js
│   │   └── evmWallet.js
│   ├── services/
│   │   └── walletService.js
│   └── main.js
└── output/
    └── .gitkeep
```

## Dependencies

- `@mysten/sui.js`: SUI blockchain integration
- `@solana/web3.js`: Solana blockchain integration
- `bs58`: Base58 encoding/decoding
- `chalk`: Terminal string styling
- `ethers`: Ethereum wallet functionality
- `inquirer`: Interactive command line interface
- `ora`: Elegant terminal spinners
- `tonweb`: TON blockchain integration
- `tonweb-mnemonic`: Mnemonic generation for TON

## Security

**IMPORTANT SECURITY NOTES:**

- Keep your private keys and mnemonics secure
- Never share your private keys or mnemonic phrases
- Store generated wallet details in a secure location
- Use generated wallets at your own risk
- This tool is for educational purposes only

## Contributing

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m 'Add some amazing feature'
```

4. Push to the branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- TON Foundation for TON blockchain integration
- Sui Foundation for SUI blockchain integration
- Solana Foundation for Solana blockchain integration
- Ethereum Foundation for EVM compatibility

## Support

If you find this project helpful, please give it a ⭐️!

---

**Note**: This tool is for educational purposes only. Use generated wallets at your own risk.
