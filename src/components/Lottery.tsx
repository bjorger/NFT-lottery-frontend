import React from "react";
import Moralis from "moralis";
import LotteryABI from "../abi/lottery.json";
import ERC20ABI from "../abi/ERC20.json";
import { PolygonButton } from "./Components.sc";
import styled from "styled-components";
import { useAppSelector } from "../redux/hooks";

const CONTRACT_ADDRESS = "0x86b7D16308bcAD18EF78C0815697fEb3Df4DdD91";
const WETH_CONTRACT_ADDRESS = "0x3C68CE8504087f89c640D02d133646d98e64ddd9";

const CHAIN_ID = "80001";
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

enum MintingState {
    NOT_MINTING,
    MINTING,
    DONE,
}

// TODO: IMPLEMENT CHECK IF USER IS ALREADY REGISTERED

const Lottery: React.FC = () => {
    const user = useAppSelector((state) => state.user.user);
    const ticket_bracket = 1;
    const [ticketPrice] = React.useState<number>(0.01 * ticket_bracket + 0.001);

    const [mintingState, setMintingState] = React.useState<MintingState>(
        MintingState.NOT_MINTING
    );

    /*
    Moralis.Cloud.run("watchContractEvent", MintTicketEventOptions, {
        useMasterKey: false,
    }).then(() => console.log("Ticket minted"));
    */
    const enterLottery = async () => {
        const sendOptions: SendOptions = {
            contractAddress: CONTRACT_ADDRESS,
            functionName: "enter",
            abi: LotteryABI,
            msgValue: Moralis.Units.ETH(ticketPrice),
        };
        const approveOptions: SendOptions = {
            contractAddress: WETH_CONTRACT_ADDRESS,
            functionName: "approve",
            abi: ERC20ABI,
            params: {
                _spender: CONTRACT_ADDRESS,
                _value: Moralis.Units.Token(ticketPrice),
            },
        };

        try {
            const approval = await Moralis.executeFunction(approveOptions);
            // @ts-ignore
            await approval.wait();
            const transaction = await Moralis.executeFunction(sendOptions);
            // @ts-ignore
            await transaction.wait();
            const Player = Moralis.Object.extend("Entrant");
            const player = new Player();
            console.log("Minting successful");
            player.set("address", user?.attributes.ethAddress);
            player.set("ticketPrice", ticketPrice);
            player.save();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <LotteryContainer>
            <MintingStateContainer>
                {mintingState === MintingState.MINTING && (
                    <div>Ticket will be minted now</div>
                )}
                {mintingState === MintingState.DONE && (
                    <div>Your ticket has been minted!</div>
                )}
            </MintingStateContainer>
            <ButtonGrid>
                <PolygonButton
                    onClick={enterLottery}
                    disabled={!user}
                    variant="contained"
                >
                    Enter Lottery
                </PolygonButton>
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
                            address: user?.attributes.ethAddress,
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
                            user?.attributes.ethAddress
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

const MintingStateContainer = styled.div`
    grid-column: 3 / span 20;
`;
