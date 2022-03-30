import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import apiService from '@services/api/espa/api.service';
import styles from './styles.module.scss';

const Spotlight = () => {
  const [designers, setDesigners] = useState([]);
  const fetchDesigners = async () => {
    const res = await apiService.getAllDesigners();
    setDesigners(res.filter((designer) => designer.Spotlight));
  };

  useEffect(() => {
    fetchDesigners();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Designer Weekly Spotlight</div>
      <div className={styles.description}>
        The Weekly Designer Spotlight uses min-maxing to level up squad wealth, continue to
        accelerate making the web3 fashion market, and, leverage decentralised tech to align
        incentives between designers, collectors and wearers. Each week a designer is voted in on
        Snapshot to be “spotlighted” the following week after the proposal has passed. The $MONA and
        Genesis MONA NFT holders are presented with a curated list of designers from the Global
        Designer Network— the designer’s listed are those that have contributed some threshold
        amount of content to their Web3 Fashion 101 profiles— an initiative brought forth by the GDN
        to buttress the accelerated growth of anyone’s access to and understanding of web3 fashion.
        <br />
        <br />
        The spotlight activities include a dedicated mirror article post under the
        globaldesignernetwork.eth Mirror account with patronage between the GDN, article write and
        spotlighted designer, the purchasing of two of the spotlighted designer’s NFTs from the
        DIGITALAX marketplace— one for the GDN Treasury Vault, voted on by the GDN DAO, and one for
        the DIGITALAX Treasury Vault, voted on by the DIGITALAX DAO—, dedicated social media posting
        by the DIGITALAX and GDN Web3 Fashion accounts of the spotlighted designer + their content,
        a dedicated twitter spaces event and live conversation with the spotlighted designer, an AMA
        in the DIGITALAX discord with the spotlighted designer and more cool events added in
        overtime by the GDN!
      </div>
      <div className={styles.designersSection}>
        {designers.map((designer) => (
          <div className={styles.designer} key={designer.wallet}>
            <Link href={`/designers/${designer.designerId}`}>
              <a>
                <img src={designer.image_url} className={styles.avatar} />
              </a>
            </Link>
            <Link href={`/designers/${designer.designerId}`}>
              <a>
                <div className={styles.name}>{designer.designerId}</div>
              </a>
            </Link>
            <a href={designer.Spotlight} target="_blank" className={styles.spotlight}>
              SEE FULL ARTICLE >
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spotlight;
