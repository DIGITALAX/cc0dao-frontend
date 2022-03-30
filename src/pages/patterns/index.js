import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import cn from 'classnames';

function Patterns(props) {
  const [menuClass, setMenuClass] = useState(styles.menu)
  const [cbClass, setCbClass] = useState(styles.centerBtn)
  const [menuContClass, setMenuContClass] = useState(styles.menuContainer)
  const [bgGridClass, setBgGridtClass] = useState(styles.bg_grid)
  const [closeClass, setCloseClass] = useState(styles.closeBtn)
  const [menuEnabled, setMenuEnabled] = useState(false)

  const handleMenuClick = () => {
    if(!menuEnabled) {
      setMenuClass(cn(styles.menu, styles.active))
      setCbClass(cn(styles.centerBtn, styles.active))
      setMenuEnabled(true)
    } else {
      setMenuClass(styles.menu)
      setCbClass(styles.centerBtn)
      setMenuEnabled(false)
    }
  }
  const handleContClick = (e) => {
    setMenuContClass(cn(styles.menuContainer, styles.active))
    var c = e * 30 + 30 * (e - 1);
    setBgGridtClass(cn(styles.bg_grid, styles.active))
    setCloseClass(cn(styles.closeBtn, styles.active))
  }
  const handleCloseClick = () => {
    setMenuContClass(styles.menuContainer)
    setBgGridtClass(styles.bg_grid)
    setCloseClass(styles.closeBtn)
  }

  return (
    <div>
      <div className="flex flex-col pt-20 mb-40 mx-12 pr-20 relative" >
        <div className="flex my-5 items-center">
          <img src="/images/on-chain.png" style={{width: "500px", marginLeft: "40px"}} />
          <img src="/images/opensource.png" style={{width: "900px", marginLeft: "50px"}} />
        </div>
        <div className="flex my-5 items-center">
        <img src="/images/llss.png" style={{width: "250px", marginLeft: "40px"}} />
          <img src="/images/nft.png" style={{width: "250px", transform: "rotate(10deg)", marginLeft: "60px"}} />
          <img src="/images/libraries.png" style={{width: "500px", marginLeft: "150px"}} />
        </div>
        <div className="flex justify-center my-10 w-full">
          <img src="/images/texture.png" />
          <img src="/images/material.png" style={{transform: "rotate(4deg)"}}className="mx-10" />
          <img src="/images/pattern.png" />
        </div>
        <div className="flex my-16">
          <img src="/images/designer_contribution.png" className="mx-auto"/>
        </div>
        <div className="flex flex-row">
          <div className={styles.sec} id="sec" >
            <div className={`${menuContClass} w-1/4`}>
              <button className={cbClass} onClick={handleMenuClick}>➕</button>
              <button className={closeClass} onClick={handleCloseClick}>🏠</button>
              <ul className={menuClass}>
                <li className={styles.six}>
                  <button onClick={() => handleContClick(6)}>
                    <span className={styles.icon}>icon-6</span>
                  </button>
                </li>
                <li className={styles.five}>
                  <button onClick={() => handleContClick(5)}>
                    <span className={styles.icon}>icon-5</span>
                  </button>
                </li>
                <li className={styles.four}>
                  <button onClick={() => handleContClick(4)}>
                    <span className={styles.icon}>icon-4</span>
                  </button>
                </li>
                <li className={styles.three}>
                  <button onClick={() => handleContClick(3)}>
                    <span className={styles.icon}>icon-3</span>
                  </button>
                </li>
                <li className={styles.two}>
                  <button onClick={() => handleContClick(2)}>
                    <span className={styles.icon}>icon-2</span>
                  </button>
                </li>
                <li className={styles.one}>
                  <button onClick={() => handleContClick(1)}>
                  <img src="/images/Rectangle.png"/>
                  </button>
                </li>
                
              </ul>

              <svg height="0" width="0">
                <defs>
                  <clipPath clipPathUnits="objectBoundingBox" id="sector">
                    <path
                      fill="none"
                      stroke="#111"
                      strokeWidth="1"
                      className={styles.sector}
                      d="M0.5,0.5 l0.5,0 A0.5,0.5 0 0,0 0.75,.066987298 z"
                    ></path>
                  </clipPath>
                </defs>
              </svg>
              <div className={bgGridClass}>
                <img src="/images/Rectangle.png"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patterns;
