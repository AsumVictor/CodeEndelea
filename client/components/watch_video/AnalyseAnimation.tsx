import type React from "react"
import styles from "./CameraAnimation.module.css"

const CameraAnimation: React.FC = () => {
  return (
    <div className={styles.cameraFrame}>
      <div className={`${styles.corner} ${styles.topLeft}`}></div>
      <div className={`${styles.corner} ${styles.topRight}`}></div>
      <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
      <div className={`${styles.corner} ${styles.bottomRight}`}></div>
      <div className={styles.cameraAngle}></div>
    </div>
  )
}

export default CameraAnimation

