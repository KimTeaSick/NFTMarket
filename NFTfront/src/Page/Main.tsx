import React, { FC, useState, useEffect, useCallback, ChangeEvent } from "react";
import { create, Options } from 'ipfs-http-client';
import { NFTContract } from '../Constracts/index'

interface MainProps {
  account: string;
}

const ipfshashUrl = 'https://ipfs.infura.io:5001/api/v0' as Options

const client = create(ipfshashUrl);

const Main: FC<MainProps> = ({ account }) => {
  const [fileUrl, updateFileUrl] = useState(``);
  const [name, setName] = useState('');
  const [describe, setDescribe] = useState('');
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [jsonUrl, setJsonUrl] = useState('');

  const describeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDescribe(e.target.value)
  }, [name]);
  const typeHandler = useCallback((e) => {
    setType(e.target.value)
  }, [name]);
  const valueHandler = useCallback((e) => {
    setValue(e.target.value)
  }, [name]);
  const nameHandler = useCallback((e) => {
    setName(e.target.value)
  }, [name]);

  //IPFS 변환 함수
  const onChange = useCallback(async (e) => {
    const file = e.target.files[0]
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      updateFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }, [fileUrl]);


  const sendJsonContent = async () => {

    const obj = { name: `${name}`, data: `${fileUrl}`, describe: `${describe}`, attribute: [{ trait_type: `${type}`, value: `${value}` }] }
    const jjson = JSON.stringify(obj);
    const file = new File([jjson], 'text.json');

    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setJsonUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  const NFTMint = async () => {

    if (!account) return;

    const response = await NFTContract.methods
      .create(account, jsonUrl)
      .send({ from: account });

    if (response.status) {
      const balanceOf = await NFTContract.methods
      .balanceOf(account)
      .call();

      const getTokens = await NFTContract.methods
      .getTokens(account)
      .call();

      for (let i = 0; i <= parseInt(balanceOf) - 1; i++) {
        console.log('getTokens :', getTokens[i].TokenNum);
      }
    }
  }
  //

  const show = () => {
    console.log(jsonUrl);
  }

  return (
    <div>
        <h1>IPFS Exchange</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '1200px' }}>
        <input
          type="file"
          onChange={onChange}
          style={{ border: 'solid 1px #eee', borderRadius: '5px', width: '300px', textAlign: 'center' }}
        />
        </div>
        <br />
        {
          fileUrl && (
            <img src={fileUrl} alt='이미지가 아닙니다.' style={{ width: '720px', height: 'auto', margin: '2%' }} />
          )
        }
        <h1>IPFS 해쉬</h1>
        <p>{fileUrl}</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '1200px' }}>
          <input type="text" value={name} style={{ width: '600px', height: '30px', border: 'solid 1px #eee', margin: '5px' }} placeholder="name" onChange={nameHandler} />
          <input type="text" value={describe} style={{ width: '600px', height: '30px', border: 'solid 1px #eee', margin: '5px' }} placeholder="describe" onChange={describeHandler} />
          <input type="text" value={type} style={{ width: '600px', height: '30px', border: 'solid 1px #eee', margin: '5px' }} placeholder="type" onChange={typeHandler} />
          <input type="text" value={value} style={{ width: '600px', height: '30px', border: 'solid 1px #eee', margin: '5px' }} placeholder="value" onChange={valueHandler} />
          <button style={{ width: '310px', background: '#eee', border: 'none', height: '30px', alignItems: 'flex-start' }} onClick={sendJsonContent}> json 만들기 </button>
          <div>
            <button style={{ width: '150px', background: '#eee', border: 'none', height: '30px', alignItems: 'flex-start', margin: '5px' }} onClick={NFTMint}>Mint!</button>
            <button style={{ width: '150px', background: '#eee', border: 'none', height: '30px', alignItems: 'flex-start', margin: '5px' }} onClick={show}>show!</button>
          </div>
        </div>
      </div>
  )
}

export default Main;