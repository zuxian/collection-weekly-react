import React from 'react';
// import { useLocation, useNavigate, useParams  } from "react-router-dom";

// export function withRouter( Child ) {
//     return ( props ) => {
//       const location = useLocation();
//       const navigate = useNavigate();
//       const params = useParams()
//       return <Child { ...props } navigate={ navigate } location={ location }  params={ params } />;
//     }
// }

import { useNavigate, useParams } from "react-router-dom";
export const WrapComps = (props)=> {
  let navigate = useNavigate();
  let params = useParams();
  let Element = props.el
  return <Element params={params} navigate={navigate} {...props} />
}
