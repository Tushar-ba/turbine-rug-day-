import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "./wallet/turbinewallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("A3eX1xzVmWu67pWV5Vur2tKgX6UABi5wuvJwVrsqhHdG");

// Recipient address
const to = new PublicKey("7QSvWo99bwLA4xUpHjn4trmp2cajWwkhDPrTUVo4au1z");

const token_decimals = 1_000_000n;

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it

        const senderAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,
        )
        console.log("Sender ATA :- ",senderAta.address.toBase58());

        const receiverAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to,
        )
        console.log("Receiver ATA :- ",receiverAta.address.toBase58());

        // Get the token account of the toWallet address, and if it does not exist, create it

        // Transfer the new token to the "toTokenAccount" we just created
        const transferTx = await transfer(
            connection,
            keypair,
            senderAta.address,
            receiverAta.address,
            keypair.publicKey,
            1000000n * token_decimals
        )
        console.log("Transfer Tx :- ",transferTx);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();