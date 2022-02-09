import React from "react";
import Moralis from "moralis";
import LotteryABI from "../abi/lottery.json";
import ERC20ABI from "../abi/ERC20.json";
import { PolygonButton } from "./Components.sc";
import styled from "styled-components";
import { useAppSelector } from "../redux/hooks";

const CONTRACT_ADDRESS = "0x360ea9a55a9b4A9304b7396BFc44dE1c1bD8306f";
const WETH_CONTRACT_ADDRESS = "0x3C68CE8504087f89c640D02d133646d98e64ddd9";

interface SendOptions {
    contractAddress: string;
    functionName: string;
    abi: any;
    params?: any;
    msgValue?: string;
}

const lotteryPotOptions = {
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getLotteryPot",
    abi: LotteryABI,
};

const entrantCountOptions = {
    contractAddress: CONTRACT_ADDRESS,
    functionName: "entrantCount",
    abi: LotteryABI,
};

const getTicketPriceOptions = {
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getTicketPrice",
    abi: LotteryABI,
};

const MapStateToString = {
    0: "Did not enter",
    1: "Currently Minting",
    2: "Owns Ticket",
};

const Lottery: React.FC = () => {
    const user = useAppSelector((state) => state.user.user);
    const [ticketPrice, setTicketPrice] = React.useState<number>(0);
    const [entrantCount, setEntrantCount] = React.useState<number>(0);
    const [currentPot, setCurrenPot] = React.useState<number>(0);
    const [entrantState, setEntrantState] = React.useState<number>(0);

    React.useEffect(() => {
        (async () => {
            setTimeout(async () => {
                const ticketPriceRes = await Moralis.executeFunction(
                    getTicketPriceOptions
                );
                // @ts-ignore
                setTicketPrice(parseInt(ticketPriceRes._hex, 16) / 10 ** 18);

                const entrantCountRes = await Moralis.executeFunction(
                    entrantCountOptions
                );
                // @ts-ignore
                setEntrantCount(parseInt(entrantCountRes._hex, 16));

                const currentPotRes = await Moralis.executeFunction(
                    lotteryPotOptions
                );
                // @ts-ignore
                setCurrenPot(parseInt(currentPotRes._hex, 16) / 10 ** 18);
            }, 1000);
        })();
    }, []);

    const getEntrantState = async () => {
        const getEntrantStateOptions = {
            contractAddress: CONTRACT_ADDRESS,
            functionName: "getEntrantStatus",
            abi: LotteryABI,
            params: {
                entrant: Moralis.User.current()?.attributes.ethAddress,
            },
        };

        try {
            const entrantStateRes = await Moralis.executeFunction(
                getEntrantStateOptions
            );
            // @ts-ignore
            setEntrantState(entrantStateRes);
        } catch (e) {
            console.error(e);
        }
    };

    console.log(ticketPrice);

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
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <LotteryContainer>
            <ButtonGrid>
                <TicketPriceContainer>
                    Current Ticketprice: {ticketPrice} WETH <br />
                    Current Pot: {currentPot} WETH <br />
                    Current Entrants: {entrantCount} <br />
                    Ticket Status:{" "}
                    {
                        // @ts-ignore
                        MapStateToString[entrantState]
                    }
                </TicketPriceContainer>
                <PolygonButton
                    onClick={enterLottery}
                    disabled={!user || ticketPrice === 0}
                    variant="contained"
                >
                    Enter Lottery
                </PolygonButton>
                <PolygonButton
                    onClick={getEntrantState}
                    disabled={!user}
                    variant="contained"
                >
                    Check Ticket Status
                </PolygonButton>
            </ButtonGrid>
        </LotteryContainer>
    );
};

export default Lottery;

const ButtonGrid = styled.div`
    margin-top: 100px;
    grid-column: 3 / span 19;
    width: 100%;
`;

const LotteryContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(24, 1fr);
`;

const TicketPriceContainer = styled.div`
    margin: 50px 0;
    font-weight: bold;
`;
