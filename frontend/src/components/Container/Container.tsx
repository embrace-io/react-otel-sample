import { FC, PropsWithChildren } from "react";

import styles from "./Container.module.css";
import classes from "../../helpers/classes";

type ContainerProps = {
  className?: string;
};

const Container: FC<PropsWithChildren<ContainerProps>> = ({
  children,
  className,
}) => {
  return (
    <section className={classes(styles.container, className)}>
      {children}
    </section>
  );
};

export default Container;
