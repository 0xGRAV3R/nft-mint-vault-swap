# nft-mint-vault-swap

Develop a program using Anchor that mints a collection of NFTs. Create a vault to lock these NFTs, where the rent for locking is returned to the protocol rather than the user. This project must include storage and retrieval of images with appropriate metadata. Additionally, create a swap program using Native Rust or Anchor that allows users to exchange $SOL for NFTs. This program should perform all necessary checks, use a vault, and enable swapping between $SOL and NFTs. Here's the checklist:<br><br>

-Mint a collection of NFTs using Anchor.<br>
-Develop a vault system to lock NFTs, where rental fees are returned to the protocol.<br>
-Ensure image storage and retrieval are functional and metadata is appropriately assigned.<br>
-Create a swap program using Native Rust or Anchor that allows users to exchange $SOL for NFTs.

## Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.0 or higher
- Solana CLI 1.18.9 or higher

### Dependencies

[dependencies]<br>


### Anchor.toml
[toolchain] <br>
anchor_version = "0.30.1"

### Installation

#### Clone the repo

```shell
git clone https://github.com/0xGRAV3R/nft-mint-vault-swap.git
cd nft-mint-vault-swap
```

#### Install Dependencies

```shell
npm install
```

#### Start the web app

```
npm run dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id.

```shell
npm run anchor keys sync
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```

