import React from "react";
import Moralis from "moralis";
import LotteryABI from "../abi/lottery.json";
import { PolygonButton } from "./Components.sc";
import styled from "styled-components";

const CONTRACT_ADDRESS = "0xE8df5bF52B6A84B8D471F7a00446B6C069Eeb85B";

interface SendOptions {
    contractAddress: string;
    functionName: string;
    abi: any;
    params?: any;
    msgValue?: string;
}

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

// TODO: IMPLEMENT CHECK IF USER IS ALREADY REGISTERED

const Lottery: React.FC = () => {
    const [currentUser] = React.useState(Moralis.User.current());
    const [ticketPrice] = React.useState<number>(0.01);

    const enterLottery = async () => {
        const sendOptions: SendOptions = {
            contractAddress: CONTRACT_ADDRESS,
            functionName: "enter",
            abi: LotteryABI,
            msgValue: Moralis.Units.ETH(ticketPrice),
        };
        const transaction = await Moralis.executeFunction(sendOptions);
        console.log(transaction);
        // @ts-ignore
        transaction.wait().then(() => {
            const Player = Moralis.Object.extend("Player");
            const player = new Player();

            player.set("address", currentUser?.attributes.ethAddress);
            player.set("ticketPrice", ticketPrice);
            player.save();
        });
    };

    return (
        <LotteryContainer>
            <ButtonGrid>
                {currentUser && (
                    <PolygonButton onClick={enterLottery} variant="contained">
                        Enter Lottery
                    </PolygonButton>
                )}
                <PolygonButton
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
                </PolygonButton>
                <PolygonButton
                    variant="contained"
                    onClick={async () => {
                        const balances = await Moralis.Web3API.account.getNFTs({
                            chain: "mumbai",
                            address: currentUser?.attributes.ethAddress,
                        });
                        console.log(balances);
                    }}
                >
                    Check Token Balance
                </PolygonButton>
                <PolygonButton
                    variant="contained"
                    onClick={() =>
                        console.log(
                            "currentUser: ",
                            currentUser?.attributes.ethAddress
                        )
                    }
                >
                    Check current User
                </PolygonButton>
            </ButtonGrid>
        </LotteryContainer>
    );
};

export default Lottery;

const ButtonGrid = styled.div`
    margin-top: 100px;
    display: grid;
    grid-column: 3 / span 20;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 50px;
    place-self: center;
    column-gap: 50px;
`;

const LotteryContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(24, 1fr);
`;
