import React, { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color'
import { Button, Select, MenuItem } from '@material-ui/core'
import styles from './styles.module.scss'

const FontNames = [
  'Poppins',
  'Raleway',
  'Roboto',
  'Babycakes',
  'Fashionism',
  'Redmond Fashion',
  'PUNK FASHION',
  'Regular Fashion',
  'Just Old Fashion'
]

const FontSizes = [
  '6',
  '8',
  '10',
  '12',
  '14',
  '16',
  '20',
  '24',
  '30',
  '40',
  '60',
  '80',
  '100',
]



const ChooseFont = props => {
  const { target, onClosed } = props
  const [fontName, setFontName] = useState('')
  const [fontSize, setFontSize] = useState('')
  const [fontColor, setFontColor] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    console.log('target: ', target)
    setFontName(target.style.fontFamily.replaceAll('"', ''))
    setFontSize(target.style.fontSize.replace('pt', ''))
    setFontColor(target.style.color)
  }, [target])


  const onChangeFontName = e => {
    setFontName(e.target.value)
    target.style.fontFamily = e.target.value
  }
  
  const onChangeFontSize = e => {
    setFontSize(e.target.value)
    target.style.fontSize = e.target.value + 'pt'
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        Choose Font
      </div>
      <Select
        className={styles.fontFamily}
        onChange={onChangeFontName}
        style={{
          fontFamily: fontName,
        }}
        value={fontName}
      >
        {
          FontNames.map((item, index) => {
            return (
              <MenuItem 
                key={index} 
                value={item}
                style={{
                  fontFamily: item
                }}>
                {
                  item
                }
              </MenuItem>
            )
          })
        }
      </Select>
      <div className={styles.secondRow}>
        <Select
          className={styles.fontSize}
          onChange={onChangeFontSize}
          value={fontSize}
        >
          {
            FontSizes.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  value={item}
                >
                  {
                    item
                  }
                </MenuItem>
              )
            })
          }
        </Select>
        <div
          className={styles.colorButton}
          style={{
            backgroundColor: fontColor
          }}
          onClick={() => setShowColorPicker(true)}
        ></div>
      </div>
      
      <Button
        className={styles.closeButton}
        onClick={onClosed}
      >
        Close
      </Button>
      {
        showColorPicker && 
        <div className={styles.colorPickerWrapper}>
          <div className={ styles.colorPickerCover } onClick={() => setShowColorPicker(false)}/>
          <SketchPicker
            color={fontColor}
            onChange={
              color => {
                console.log('color: ', color)
                const colorString = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
                setFontColor(colorString)
                target.style.color = colorString
              }
            }
          />
        </div>
      }
    </div>
  )
}

export default ChooseFont