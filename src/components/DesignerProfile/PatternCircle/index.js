import React, { useRef } from 'react';
import { Paper } from '@material-ui/core';
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './styles.module.scss';

const patternCircle = (props) => {
  const { item, index, direction = 'Right', secondPart } = props;
  const curImage = useRef(null);
  const imgViewer = useRef(null);
  const description = useRef(null);
  const downloadImage = useRef(null);
  const mintUrl = useRef(null);

  const hovered = (isViewer, e) => {
    if (isViewer) {
      if (imgViewer.current.classList.value.search('fadeIn' + direction) === -1) return;
      imgViewer.current.classList.add('hover');
    }
    curImage.current.style.backgroundImage = `url(${item.thumbnail ? item.thumbnail : item.image})`;
    imgViewer.current.classList.remove('fadeOut' + direction);
    imgViewer.current.classList.add('fadeIn' + direction);
    const nameItem = item.attributes.find((item) => item.type === 'Name of Item');
    let descriptionInnerHTML = '';
    if (nameItem) {
      descriptionInnerHTML = nameItem.value + '<br />';
    }
    descriptionInnerHTML += item.description;
    description.current.innerHTML = descriptionInnerHTML;
    downloadImage.current.src = item.image;
    mintUrl.current.href = `https://opensea.io/assets/matic/0x567c7b3364ba2903a80ecbad6c54ba8c0e1a069e/${item.id}`;
  };

  const hleave = (when, e) => {
    if (when === 1) {
      setTimeout(() => {
        if (imgViewer.current.classList.value.search('hover') === -1) {
          imgViewer.current.classList.remove('fadeIn' + direction);
          imgViewer.current.classList.add('fadeOut' + direction);
          imgViewer.current.classList.remove('hover');
        }
      }, 100);
    } else if (when === 2) {
      if (curImage.current !== null) {
        imgViewer.current.classList.remove('fadeIn' + direction);
        imgViewer.current.classList.add('fadeOut' + direction);
        imgViewer.current.classList.remove('hover');
      }
    }
  };

  let marginLeft = 0;
  let marginTop = 0;

  if (!secondPart) {
    marginLeft = (index % 3) * 30;

    if (index === 2) {
      marginLeft = 65;
      marginTop = -23;
    } else if (index === 5) {
      marginLeft = -20;
      marginTop = -23;
    }
  }

  const handleDownload = async () => {
    const image = await fetch(downloadImage.current.src);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={[styles.patternCircle, secondPart ? styles.secondPart : ''].join(' ')}
      style={
        !secondPart
          ? {
              marginLeft: `${marginLeft}%`,
              marginTop: `${marginTop}%`,
            }
          : {
              marginTop: `${index % 3 === 1 ? -10 : 0}vw`,
            }
      }
    >
      <img
        src={item.thumbnail ? item.thumbnail : item.image}
        onMouseOver={(e) => hovered(false, e)}
        onMouseOut={(e) => hleave(1, e)}
      />
      <Paper
        className={[
          'circlemenu_imgViewer fadeOut' + direction,
          styles.patternCircleViewer,
          direction === 'Right' ? styles.Right : '',
          direction === 'Left' ? styles.Left : '',
        ].join(' ')}
        elevation={3}
        ref={imgViewer}
        onMouseOver={(e) => hovered(true, e)}
        onMouseLeave={(e) => hleave(2, e)}
      >
        <div className="circlemenu_curImage" ref={curImage}>
          <div
            className={['circlemenu_imgDescription', styles.description].join(' ')}
            ref={description}
          />
          <div className="circlemenu_actions">
            <a className="circlemenu_minted_nft" target="_blank" ref={mintUrl}>
              See Minted NFT
            </a>
            <a className="circlemenu_download" target="_blank" onClick={handleDownload}>
              <img ref={downloadImage} style={{ width: 0, height: 0 }} crossOrigin="anonymous" />
              <img src="/images/download.png" />
            </a>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default patternCircle;
