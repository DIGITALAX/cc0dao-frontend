import apiService from "@services/api/espa/api.service";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const CreativeResidents = () => {
  const [residents, setResidents] = useState([]);
  const fetchResidents = async () => {
    const res = await apiService.getAllResidents();
    setResidents(res.filter((resident) => resident.GDNPurveyor));
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className="container mx-auto p-4">
        <div className={styles.title}>Web3 CC0 Creative Residents</div>
        <div className={styles.desigersSection}>
          {residents.map((resident) => (
            <div className={styles.designer} key={resident.wallet}>
              <Link href={`/residents/${resident.designerId}`}>
                <a>
                  <img src={resident.image_url} className={styles.avatar} />
                </a>
              </Link>
              <Link href={`/residents/${resident.designerId}`}>
                <a>
                  <div className={styles.name}>{resident.designerId}</div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeResidents;
