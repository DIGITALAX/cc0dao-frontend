import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function Landing(props) {
  const screenWidth = useWindowDimensions().width;
  const [isMobile, setIsMobile] = useState(false);
  const [showTopSocial, setShowTopSocial] = useState(false);

  useEffect(() => {
    screenWidth > 707 ? setIsMobile(false) : setIsMobile(true);
  }, [screenWidth]);

  const onClickTopArrow = () => {
    console.log("clicked!");
    setShowTopSocial(true);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.section1}>
          <h1 className={styles.title}> Copyright Cartel: 0 (CC0) DAO </h1>
          <div className={styles.buttons}>
            <a href="" target="_blank" rel="noreferrer">
              {" "}
              Bid in Daily Auctions{" "}
            </a>
            <a href="" target="_blank" rel="noreferrer">
              {" "}
              Web3 CC0 Creative Residents{" "}
            </a>
            <a href="" target="_blank" rel="noreferrer">
              {" "}
              Join the DAO{" "}
            </a>
          </div>
        </div>

        <div className={styles.section2}>
          <video autoPlay loop muted>
            <source src="/video/1.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.section3}>
          <h1 className={styles.title}>On-Chain CC0 Highlights</h1>
        </div>
      </div>
    </>
  );
}

export default Landing;
