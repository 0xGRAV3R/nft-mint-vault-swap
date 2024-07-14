import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Nftprogram } from "../target/types/nftprogram";
import { Connection, PublicKey } from "@solana/web3.js";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { findMasterEditionPda, findMetadataPda, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { BN } from "bn.js";

import { publicKey } from "@metaplex-foundation/umi";
import { getOrCreateAssociatedTokenAccount, getAssociatedTokenAddress } from "@solana/spl-token";

import { loadKeypairFromFile } from "../utils/loadPair";
import { Metaplex } from "@metaplex-foundation/js";

describe("nftprogram", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Nftprogram as Program<Nftprogram>;

  const signer = provider.wallet;
  const umi = createUmi("https://api.devnet.solana.com").use(walletAdapterIdentity(signer)).use(mplTokenMetadata());

  const mint = anchor.web3.Keypair.generate();

  const associatedTokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    signer.publicKey
  );

  let metadataAccount = findMetadataPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  let masterEditionAccount = findMasterEditionPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  const metadata = {
    name: "NFT or Token",
    symbol: "NFT",
    uri: "https://arweave.net/ISef3HUc9oSsOHfOudiDIPl7X3zD48Gw32K4JJUo_DE",
  };

  const connection = new Connection('https://api.devnet.solana.com')

  const metaplex = Metaplex.make(connection);


  const [vaultStateAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("state"), provider.publicKey.toBuffer()], program.programId);
  const [vaultAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), vaultStateAccountPDA.toBuffer()], program.programId);

  console.log("vaultStateAccountPDA", vaultStateAccountPDA);
  console.log("vaultAccountPDA", vaultAccountPDA);

  var fromWallet = loadKeypairFromFile("/Users/decaff/.config/solana/id.json");


  const userTokenAcc = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    fromWallet,
    new PublicKey("GXAnm9f6cTRcTwd2u2T3Geat1jnK4Pb2ekns67d82cxf"), // minted token key
    signer.publicKey
  );

  const vaultTokenAcc = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    fromWallet,
    new PublicKey("GXAnm9f6cTRcTwd2u2T3Geat1jnK4Pb2ekns67d82cxf"), // minted token key
    vaultAccountPDA
  );


  it("Mint NFT", async () => {
    const tx = await program.methods
      .mintNft(metadata.name, metadata.symbol, metadata.uri)
      .accounts({
        signer: provider.publicKey,
        mint: mint.publicKey,
        metadataAccount: metadataAccount,
        masterEditionAccount: masterEditionAccount
      })
      .signers([mint])
      .rpc();

    console.log(`mint NFT tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    console.log(`minted NFT: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`);

    let metadataforthismint = await metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey("GXAnm9f6cTRcTwd2u2T3Geat1jnK4Pb2ekns67d82cxf"), tokenOwner: provider.publicKey });

    console.log("metadatas", metadataforthismint)
  });




  it("init vault", async () => {
    const tx = await program.methods.initialize().rpc()
    console.log(`init vault tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  });


  it("it deposit NFT into vault", async () => {

    const tx = await program.methods.deposit(new BN(1)).accounts({
      vaultTokenAcc: vaultTokenAcc.address,
      userTokenAcc: userTokenAcc.address
    })
      .signers([fromWallet])
      .rpc()

    console.log(`deposite nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  });



  it("Widthraw NFT from vault", async () => {
    const tx = await program.methods.withdraw(new BN(1)).accounts({
      vaultTokenAcc: vaultTokenAcc.address,
      userTokenAcc: userTokenAcc.address
    })
      .signers([fromWallet])
      .rpc()

    console.log(`deposite nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  });
});
