import React, {FC} from "react";

interface TokenProps {
  tokenNum: any;
}

const Token: FC <TokenProps> = ({ tokenNum }) =>{
  
  return (
    <div style={{width:'200px',height:'250px', borderRadius:'15px'}}>
      <div style={{height:'200px',background:'#eee'}}>
      {tokenNum}  
      </div>
      <div style={{width:'inhebit', height:'50px'}}>

      </div>
    </div>
  )
}

export default Token;