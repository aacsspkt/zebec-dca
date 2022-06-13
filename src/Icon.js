import React, { useEffect, useState } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';


export const Icon = ({ mint }) => {
    const [tokenMap, setTokenMap] = useState(new Map());

    useEffect(() => {
        new TokenListProvider().resolve().then(tokens => {
            const tokenList = tokens.filterByClusterSlug("mainnet-beta").getList();
            const solToken = tokenList.filter(token => token.symbol === "SOL");
            setTokenMap(tokenList.reduce((map, item) => {
                map.set(item.address, item);
                return map;
            }, new Map()));
        });
    }, [setTokenMap]);

    const token = tokenMap.get(mint);
    if (!token || !token.logoURI) return null;

    return (<img height={100} width={100} src={token.logoURI} />);
}