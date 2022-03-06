import React, {FC} from "react";

interface TokenProps {
  v: any;
}

const Token: FC <TokenProps> = ({v}) =>{
  return (
    <div>
      {v}
    </div>
  )
}

export default Token;