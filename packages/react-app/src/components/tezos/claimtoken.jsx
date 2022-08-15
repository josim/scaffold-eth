import { useEffect, useState} from "react";
import {
  getActiveAccount,
  claim_token} from "../../utils/wallet";

import allowList from './allowlist.json';


export default function ClaimToken(props) {
    const [claimToken, setClaimToken] = useState(false);
    const [eligible, setEligible] = useState(null);
    const [freeMintOnly, setFreeMintOnly] = useState(false);
    const token_prize = 2;
    const dateNow  = new Date();
    const exp_date = new Date('Sun, 31 Jul 2022 00:50:30 GMT+1');
    
    const claim = async (e) => {
        e.preventDefault();
        setClaimToken(true);
        if (allowList[props.address]) {
        const claimResult = await claim_token(allowList[props.address].leafDataPacked,allowList[props.address].proof,0);
        }
        else{
        console.log("NOT on allow list")
        const claimResult = await claim_token('0507070a000000160000df5ec2479341e85f0aa325a36d5c02b1693192ab00a401',['6d157f8b869fa62a6947bc9e5ab8dce95f696dcabef2addea9c3fe5f04e65ad6'],token_prize);
        }
        setClaimToken(false);
    }

    useEffect(() => {
        const func = async () => {
            const account = await getActiveAccount();
            if (account) {
                props.setWallet(account.address);
                if (allowList[account.address] != undefined) {
                    console.log("user on allow list")
                    setEligible(account.address);
                }
                if(dateNow > exp_date){
                    setFreeMintOnly(false);
                }
                else {
                    setFreeMintOnly(true);
                }
            }
            };
        func();
    }, []);

    return (
        <div>
            {props.address 
                ?
                <>
                {props.address && eligible
                    ?
                    <>
                        {claimToken ? (
                            <p> claiming... </p>
                        ) : (
                            <button
                                onClick={claim}
                               
                                >
                                claim
                            </button>
                        )}
                    </>
                :
                    <>
                    {freeMintOnly ?
                        <>
                            sorry, you are not on the allow list. wait until dd.mm.yy
                        </>
                    :
                        <>
                            {claimToken ? (
                                <p> claiming... </p>
                            ) : (
                                <button
                                    onClick={claim}
                                    >
                                    mint for x tez
                                </button>
                            )}
                        </>
                    }
                    </>
                }
                </>
                :  
                <>
                    sync wallet to see if you are eligible to claim
                </>
            }
        </div>
    )
}
