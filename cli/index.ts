import * as borsh from 'borsh';
import * as web3 from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
const BN = require("bn.js");
import {Buffer} from "buffer";
/**
 * The public key of the account we are saying hello to
 */
 let greetedPubkey: web3.PublicKey;
 /**
 * The state of a greeting account managed by the hello world program
 */
class GreetingAccount {
    counter = 0;
    constructor(fields: {counter: number} | undefined = undefined) {
      if (fields) {
        this.counter = fields.counter;
      }
    }
  }

  /**
 * Borsh schema definition for greeting accounts
 */
const GreetingSchema = new Map([
    [GreetingAccount, {kind: 'struct', fields: [['counter', 'u32']]}],
  ]);
  
  /**
   * The expected size of each greeting account.
   */
  const GREETING_SIZE = borsh.serialize(
    GreetingSchema,
    new GreetingAccount(),
  ).length;

 

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

async function main(){
     const key: Uint8Array = Uint8Array.from([238,31,118,15,192,220,204,186,81,124,82,240,89,170,78,17,214,5,85,17,53,88,189,14,141,124,77,186,160,179,139,13,191,146,80,250,141,179,117,227,100,20,233,20,52,134,100,242,255,188,117,153,132,232,21,73,79,245,137,253,126,13,160,198]);


        const data_to_send: Buffer = Buffer.from(
            
            Uint8Array.of(0, ...new BN(10).toArray("le", 8)
            
            ));

             const data_b = borsh.serialize(
              GreetingSchema,
              new GreetingAccount(),
              
            )

//NO
        const layout = BufferLayout.struct([BufferLayout.u32("counter")])
        let data: Buffer = Buffer.alloc(layout.span);
        layout.encode({counter:3}, data);


        const signer: web3.Keypair = web3.Keypair.fromSecretKey(key);
        let programId: web3.PublicKey = new web3.PublicKey("G5TNPLYcRPRWpg3NFMzpxij2GQuuLAY9MAsbkez3MThP");
     
          // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
   
   //first create account with seed then refer with Public Key
          const GREETING_SEED = 'hello 41';
//    greetedPubkey = await web3.PublicKey.createWithSeed(
//      signer.publicKey,
//      GREETING_SEED,
//      programId,
//    );
   
  greetedPubkey = new web3.PublicKey("DnQHyo1fNeikA2BP6BfGW6GmUW5bK1fjwPBjTpcuDRP9");


   let fees = 0;
 
 

   const lamports = await connection.getMinimumBalanceForRentExemption(
    GREETING_SIZE,
  );
 

//This creteAccount with Seed  only first time    
//    const transaction = new web3.Transaction()

//    .add(
//     web3.SystemProgram.createAccountWithSeed({
//       fromPubkey: signer.publicKey,
//       basePubkey: signer.publicKey,
//       seed: GREETING_SEED,
//       newAccountPubkey: greetedPubkey,
//       lamports,
//       space: GREETING_SIZE,
//       programId,
//     }),
//   );


let transaction: web3.Transaction = new web3.Transaction();
//programId = greetedPubkey;
  transaction.add(
    new web3.TransactionInstruction({
        keys: [
          {pubkey: greetedPubkey, isSigner: false, isWritable: true}],
            programId,
        data: data
        
        
    })
);
// const transaction = new web3.Transaction().add(
//   new web3.TransactionInstruction({
//       keys: [{
//         "pubkey": signer.publicKey
//         ,
//         "isSigner": true,
//         "isWritable": true
//          }],
//       programId,
//       data
      
      
//   })
// );

await web3
.sendAndConfirmTransaction(connection, transaction, [signer])
.then((sig)=> {
  console.log("sig: {}", sig);
});
reportGreetings();
    

    }
     async function reportGreetings(): Promise<void> {
        const accountInfo = await connection.getAccountInfo(greetedPubkey);
        if (accountInfo === null) {
          throw 'Error: cannot find the greeted account';
        }
        const greeting = borsh.deserialize(
          GreetingSchema,
          GreetingAccount,
          accountInfo.data,
        );
        console.log(
          greetedPubkey.toBase58(),
          'has been greeted',
          Number(greeting.counter),
          'time(s)',
        );
      }

    main();
