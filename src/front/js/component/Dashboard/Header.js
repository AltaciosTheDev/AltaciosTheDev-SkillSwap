import React, {useContext} from 'react'
import { Link } from "react-router-dom";
import {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify} from "react-icons/bs"
import personLogo from "../../../img/personLogo.png"
import { Context } from "../../store/appContext";

export function Header() {
  const { store, actions } = useContext(Context);

  return (
    <div className="header">
        <div className="menu-icon">
            <BsJustify className='icon' onClick={actions.openSidebarToggle}/>
        </div>

        <div className="header-right">
            <BsFillBellFill className="icon"/>
            <BsFillEnvelopeFill className="icon"/>
            <div className="user-badge">
              <img src={personLogo} className="user-badge-image"/>
              <div className="user-details">
                <h6>Enzo</h6>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Header