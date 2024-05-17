document.getElementById('sendSolanaButton').addEventListener('click', async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            // Connect to Phantom Wallet
            const resp = await window.solana.connect();
            console.log('Connected with public key:', resp.publicKey.toString());

            // Specify the recipient and the amount of SOL to send
            const recipient = '3XZwt8wCPJ5UeGvvBJyj3hYE5pRzZ9wADgtb4PBCd6Uu';
            const amountInSol = 1;
            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');

            // Create transaction
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: window.solana.publicKey,
                    toPubkey: new solanaWeb3.PublicKey(recipient),
                    lamports: amountInSol * solanaWeb3.LAMPORTS_PER_SOL,
                })
            );

            // Send transaction
            const { signature } = await window.solana.signAndSendTransaction(transaction);
            await connection.confirmTransaction(signature);
            console.log('Transaction sent with signature:', signature);
        } catch (err) {
            console.error('Error sending SOL:', err);
        }
    } else {
        console.log('Phantom Wallet not found. Please install it.');
    }
});
