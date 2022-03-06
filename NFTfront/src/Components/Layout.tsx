import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const Layout: FC = ({children}) => {

  return(
    <>
    <ul style={{listStyle:"none", display:'flex'}}>
      <li>
        <Link to="/" ><button>Main</button></Link>
      </li>
      <li>
        <Link to="/mypage" ><button>MyPage</button></Link>
      </li>
      <li>
        <Link to="/market" ><button>Market</button></Link>
      </li>
    </ul>
    <div>{children}</div>
    </>
  )
}

export default Layout;