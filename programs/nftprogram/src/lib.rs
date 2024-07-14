use anchor_lang::prelude::*;
pub mod instructions;
pub use instructions::*;
pub mod state;
pub use state::*;

declare_id!("7Es3mr4nWo2LGWyZV3ifNnrrsN5aVoyGUdBya9eshm1V");

#[program]
pub mod nftprogram {
    use super::*;

    pub fn mint_nft(ctx: Context<MintNFT>, name: String, symbol: String, uri: String) -> Result<()> 
    {
        mint_nft::mint_nft(ctx, name, symbol, uri)
    }

    // vault
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        vault_init::initialize(ctx)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        vault_deposit::deposit(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
       vault_widthraw::withdraw(ctx, amount)
    }
    // vault end 

    pub fn sell(
        ctx: Context<SwapNftForSol>,
        swap_amount: u64
    ) -> Result<()> {
        swap_nft::swapnftforsol(
            ctx,
            swap_amount,
        )
    }


}

