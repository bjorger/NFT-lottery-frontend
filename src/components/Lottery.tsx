import React from "react";
import Moralis from "moralis";
import LotteryABI from "../abi/lottery.json";
import { Button } from "@mui/material";

const CONTRACT_ADDRESS = "0x8D44A56eccd19CFF0AeB01281e7A5E4E723a4fBb";

interface SendOptions {
    contractAddress: string;
    functionName: string;
    abi: any;
    params?: any;
    msgValue?: string;
}

const sendOptions: SendOptions = {
    contractAddress: CONTRACT_ADDRESS,
    functionName: "enter",
    abi: LotteryABI,
    msgValue: Moralis.Units.ETH("0.01"),
};

const lotteryPotOptions = {
    contractAddress: CONTRACT_ADDRESS,
    functionName: "lotteryPot",
    abi: LotteryABI,
};

const entrantCountOptions = {
    contractAddress: CONTRACT_ADDRESS,
    functionName: "entrantCount",
    abi: LotteryABI,
};

const Lottery: React.FC = () => {
    const [currentUser] = React.useState(Moralis.User.current());

    const enterLottery = async () => {
        const transaction = await Moralis.executeFunction(sendOptions);
        console.log(transaction);
        // @ts-ignore
        await transaction.wait();
    };

    console.log("currentUser: ", currentUser?.attributes.ethAddress);

    return (
        <>
            {currentUser && (
                <Button onClick={enterLottery} variant="contained">
                    Enter Lottery
                </Button>
            )}
            <Button
                variant="contained"
                onClick={async () => {
                    const lotteryPot = await Moralis.executeFunction(
                        lotteryPotOptions
                    );
                    console.log("lotteryPot:", lotteryPot);
                    const entrantCount = await Moralis.executeFunction(
                        entrantCountOptions
                    );
                    console.log("entrantCount:", entrantCount);
                }}
            >
                Get Contract Data
            </Button>
        </>
    );
};

export default Lottery;
