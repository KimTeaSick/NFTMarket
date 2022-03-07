import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const Layout: FC = ({children}) => {

  return(
    <div>
    <ul style={{listStyle:"none", display:'flex', background:'#eee', }}>
      <li>
        <Link to="/" ><button       style={{background:'none', border:'none', fontSize:'20px', color:'#254'}}>Main</button></Link>
      </li>
      <li>
        <Link to="/mypage" ><button style={{background:'none', border:'none', fontSize:'20px', color:'#254'}}>MyPage</button></Link>
      </li>
      <li>
        <Link to="/market" ><button style={{background:'none', border:'none', fontSize:'20px', color:'#254'}}>Market</button></Link>
      </li>
    </ul>
    <div>{children}</div>
    </div>
  )
}

export default Layout;