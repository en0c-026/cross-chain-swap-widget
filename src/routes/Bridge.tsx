import React from 'react';
// import { useState, useEffect } from 'preact/hooks';
// import ModalConnect from '../components/ModalConnect/ModalConnect';
import { Box } from 'grommet';
import {Header} from '../components/common/Header';
import { useConfig } from '../context';
// import PanelTrade from '../components/PanelTrade/PanelTrade';
// import { actions } from '../constants';
// import { useWeb3React } from '@web3-react/core';

export const Bridge = () => {
  const { style } = useConfig();

    // const service = useService();
    // const dispatch = useDispatch();
    // const { account, chainId, active } = useWeb3React();
    // const { tokenTo, tokenFrom, amountFrom, dodoRequest, equalTokens } = useStore();
    // const [alias, setAlias] = useState<string | null>(null)
    // const [rpc, setRpc] = useState<string | null>(null)
    // const [currentChainId, setCurrentChainId] = useState<number>(0)



    // useEffect(() => {
    //     parseAmount(amountFrom, tokenFrom).then((amount) => {
    //         dispatch({
    //             type: actions.setDodoRequest,
    //             payload: {
    //                 fromTokenAddress: tokenFrom.address,
    //                 fromTokenDecimals: tokenFrom.decimals,
    //                 toTokenAddress: tokenTo.address,
    //                 toTokenDecimals: tokenTo.decimals,
    //                 fromAmount: amount,
    //                 userAddr: account,
    //                 chainId: chainId

    //             }
    //         })
    //         dispatch({
    //             type: actions.setTradeRequest, payload: {
    //                 requestValue: amount
    //             }
    //         })
    //     })

    // }, [tokenTo, tokenFrom, amountFrom, account])

    // useEffect(() => {
    //     if(!chainId) {
    //         return
    //     } 
    //     if (currentChainId > 0 && currentChainId !== chainId) {
    //         window.location.reload()
    //     }
        
    // }, [chainId])

    // useEffect(() => {
    //     if(chainId) {
    //         setCurrentChainId(chainId)
    //     }
    //     getNetworkAlias(chainId, setAlias, setRpc, dispatch)
    // }, [active])

    // useEffect(() => {
    //     if (!account) {
    //         return
    //     }
    //     dispatch({ type: actions.setDodoRequest, payload: { rpc: rpc } })
    //     getListTokens(alias).then((tokens) => {
    //         dispatch({
    //             type: actions.setTokenList,
    //             payload: tokens
    //         })
    //     }).catch((error) => {
    //         console.log(error)
    //         dispatch({
    //             type: actions.setTokenList,
    //             payload: []
    //         })
    //         getListTokens(alias).then((tokens) => {
    //             dispatch({
    //                 type: actions.setTokenList,
    //                 payload: tokens
    //             })
    //         }).catch(() => {
    //             return
    //         })
    //     })
    // }, [rpc, alias])

    // useEffect(() => {
    //     if (tokenFrom.symbol !== tokenTo.symbol) {
    //         dispatch({ type: actions.setEqualTokens, payload: false})
    //     } else {
    //         dispatch({ type: actions.setEqualTokens, payload: true})
    //         dispatch({ type: actions.setAvailableReq, payload: false })
    //     }
    // }, [tokenTo, tokenFrom])

    // useEffect(() => {
    //     if (!equalTokens && tokenFrom.address !== '' && tokenTo.address !== '' && amountFrom > 0) {
    //         dispatch({ type: actions.setAvailableReq, payload: false })
    //         dispatch({ type: actions.setFetchPriceLoad, payload: true })
    //         getRoute(service, dodoRequest).then((result) => {
                
    //             const { resPricePerFromToken, resAmount, targetApproveAddr, to, data } = result

    //             if (resPricePerFromToken && resAmount && to && data) {
    //                 dispatch({ type: actions.setPricePerFromToken, payload: resPricePerFromToken })
    //                 dispatch({ type: actions.setAmountTo, payload: resAmount })
    //                 dispatch({ type: actions.setTradeRequest, payload: { targetApprove: targetApproveAddr, proxyAddress: to, requestData: data } })
    //                 dispatch({ type: actions.setAvailableReq, payload: true })
    //                 dispatch({ type: actions.setFetchPriceLoad, payload: false })
    //             }

    //         }).catch((error) => {
    //             dispatch({ type: actions.setAmountTo, payload: null })
    //         })
    //     }
    // }, [tokenFrom, dodoRequest, account])

    return (
        <Box>
          <Header />
          Hyphen Bridge
            {/* <Box direction='row' gap='small' alignSelf='end' pad='small'>
                <ModalConnect />
            </Box>
            <PanelTrade /> */}
        </Box>

    );
};
