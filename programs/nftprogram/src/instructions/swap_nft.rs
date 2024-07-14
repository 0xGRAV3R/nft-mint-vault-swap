use {
    anchor_lang::{
        prelude::*,
        system_program,
    },
    anchor_spl::{
        associated_token::AssociatedToken,
        associated_token,
        token::{Token, Mint, TokenAccount},
        token
    },
};


pub fn swapnftforsol(
    ctx: Context<SwapNftForSol>,
    swap_amount: u64
) -> Result<()> {

    msg!("Initiating transfer of {} lamports...", swap_amount);
    msg!("Purchaser (sending lamports): {}", &ctx.accounts.buyer_authority.key());
    msg!("Seller (receiving lamports): {}", &ctx.accounts.owner_authority.key());
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer_authority.to_account_info(),
                to: ctx.accounts.owner_authority.to_account_info(),
            }
        ),
        swap_amount
    )?;
    
    msg!("Lamports transferred successfully.");

    msg!("Creating buyer token account...");
    msg!("Buyer Token Address: {}", &ctx.accounts.buyer_token_account.key());    
    associated_token::create(
        CpiContext::new(
            ctx.accounts.associated_token_program.to_account_info(),
            associated_token::Create {
                payer: ctx.accounts.buyer_authority.to_account_info(),
                associated_token: ctx.accounts.buyer_token_account.to_account_info(),
                authority: ctx.accounts.buyer_authority.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info()
            },
        ),
    )?;

    msg!("Transferring NFT...");
    msg!("Owner Token Address: {}", &ctx.accounts.owner_token_account.key());    
    msg!("Buyer Token Address: {}", &ctx.accounts.buyer_token_account.key());    
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.owner_token_account.to_account_info(),
                to: ctx.accounts.buyer_token_account.to_account_info(),
                authority: ctx.accounts.owner_authority.to_account_info(),
            }
        ),
        1
    )?;
    msg!("NFT transferred successfully.");
    
    msg!("Sale completed successfully!");

    Ok(())
}


#[derive(Accounts)]
pub struct SwapNftForSol<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub owner_authority: Signer<'info>,
    /// CHECK: We're about to create this with Anchor
    #[account(mut)]
    pub buyer_token_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub buyer_authority: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}