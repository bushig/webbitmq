import React, { VFC } from "react";
import {Link} from "@mui/material";
import styles from "./Logo.module.scss";
import logo from "../../assets/img/bugz_logo.png";


const Logo: VFC = () =>
  <div className={styles.logo_wrapper}>
    <img className={styles.logo_img} src={logo} alt="logo" />
      <Link href="/" className={styles.logo_text}>WebbitMQ</Link>
  </div>;


export default Logo;