import React, { FC, useState, useEffect, useCallback, ChangeEvent } from "react";
import { create, Options } from 'ipfs-http-client';
import { NFTContract } from '../Constracts/index'

interface MainProps {
  account: string;
}

const ipfshashUrl= 'https://ipfs.infura.io:5001/api/v0' as Options

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

    const obj = { name: `${name}`, image: `${fileUrl}`, describe: `${describe}`, attribute: [{ trait_type: `${type}`, value: `${value}` }] }
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
  const NFTMint = async() =>{
    if(!account) return;
    const response = await NFTContract.methods
      .create(account, jsonUrl)
      .send({from: account});

    if(response.status){
      const balanceOf = await NFTContract.methods.balanceOf(account).call();

      const getTokens = await NFTContract.methods.getTokens(account).call()

      console.log('balanceOf : ',balanceOf);
      console.log('getTokens :',getTokens);
    }
    console.log(jsonUrl);
    console.log(response);
  }

  const show=()=>{
    console.log(jsonUrl);
  }

  return (
    <div>
      <div className="App">
        <h1>IPFS Exchange</h1>
        <input
          type="file"
          onChange={onChange}
          style={{ border: 'solid 1px #eee', borderRadius: '5px', width: '300px', height: 'auto', textAlign: 'center' }}
        />
        <br />
        {
          fileUrl && (
            <img src={fileUrl} alt='이미지가 아닙니다.' style={{ width: '720px', height: 'auto', margin: '2%' }} />
          )
        }
        <h1>IPFS 해쉬</h1>
        <p>{fileUrl}</p>

        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', width: '1200px', margin: 'auto' }}>
          <input type="text" value={name} placeholder="name" onChange={nameHandler} />
          <input type="text" value={describe} placeholder="describe" onChange={describeHandler} />
          <input type="text" value={type} placeholder="type" onChange={typeHandler} />
          <input type="text" value={value} placeholder="value" onChange={valueHandler} />
          <button onClick={sendJsonContent}> json 만들기 </button>
        </div>
        <button onClick={NFTMint}>Mint!</button>
        <button onClick={show}>show!</button>
      </div>
    </div>
  )
}

export default Main;